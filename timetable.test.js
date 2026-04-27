const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "timetable.html"), "utf8");
const serviceWorker = fs.readFileSync(path.join(__dirname, "service-worker.js"), "utf8");
const scriptTags = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
const appScript = scriptTags.map(([, attrs, body]) => {
  const srcMatch = attrs.match(/\bsrc=["']([^"']+)["']/);
  if (!srcMatch) return body;
  return fs.readFileSync(path.join(__dirname, srcMatch[1]), "utf8");
}).join("\n");

class FakeClassList {
  constructor() {
    this.set = new Set();
  }

  add(...names) {
    names.forEach((name) => this.set.add(name));
  }

  remove(...names) {
    names.forEach((name) => this.set.delete(name));
  }

  contains(name) {
    return this.set.has(name);
  }

  toggle(name, force) {
    if (force === undefined ? !this.set.has(name) : force) this.set.add(name);
    else this.set.delete(name);
  }
}

class FakeElement {
  constructor(id = "") {
    this.id = id;
    this.value = "";
    this.innerHTML = "";
    this.textContent = "";
    this.disabled = false;
    this.checked = false;
    this.dataset = {};
    this.style = {
      setProperty(name, value) {
        this[name] = value;
      },
    };
    this.classList = new FakeClassList();
    this.listeners = {};
    this.elements = {};
  }

  addEventListener(type, fn) {
    this.listeners[type] = fn;
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  removeAttribute(name) {
    delete this[name];
  }

  focus() {
    this.focused = true;
  }

  appendChild() {}
  remove() {}
  click() {}
  closest() { return null; }
  querySelector() { return null; }
}

const elements = new Map();
function elementFor(selector) {
  const id = selector.startsWith("#") ? selector.slice(1) : selector;
  if (!elements.has(id)) elements.set(id, new FakeElement(id));
  return elements.get(id);
}

const storage = {};
global.document = {
  querySelector: elementFor,
  addEventListener() {},
  createElement(tag) {
    const element = new FakeElement(tag);
    if (tag === "canvas") {
      element.getContext = () => ({
        font: "",
        scale() {},
        fillRect() {},
        beginPath() {},
        moveTo() {},
        lineTo() {},
        stroke() {},
        fill() {},
        closePath() {},
        quadraticCurveTo() {},
        fillText() {},
        measureText(text) {
          return { width: String(text).length * 8 };
        },
      });
      element.toDataURL = () => `data:image/jpeg;base64,${Buffer.from("fakejpeg").toString("base64")}`;
    }
    return element;
  },
  body: new FakeElement("body"),
};
global.window = {
  addEventListener() {},
  clearTimeout,
  setTimeout,
  CSS: { escape: (value) => String(value).replace(/[^a-zA-Z0-9_-]/g, "_") },
};
global.navigator = {};
global.location = { protocol: "file:" };
global.localStorage = {
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null;
  },
  setItem(key, value) {
    storage[key] = String(value);
  },
  removeItem(key) {
    delete storage[key];
  },
};
global.URL = { createObjectURL: () => "blob:test", revokeObjectURL() {} };
global.Blob = class Blob {
  constructor(parts, options) {
    this.parts = parts;
    this.options = options;
  }
};
global.TextEncoder = TextEncoder;
global.atob = (value) => Buffer.from(value, "base64").toString("binary");

const api = new Function(`${appScript}
return {
  parseSchedule, renderSummary, renderWeek, render, source, sourceWarnings, summary, week,
  readTaskState, updateTaskState, makeTaskKey, getActiveDays, getTodayLabel,
  readTemplates, writeTemplates, renderTemplateOptions, templateSelect, templateName,
  saveTemplate, loadTemplate, deleteTemplate, drawExportCanvas, commonCategories,
  buildWeeklyReview, createBackupPayload, importBackup, backupText,
  appThemes, applyTheme, readTheme, categoryColorsFor, readThemeBackgrounds, selectThemeBackground,
  selectThemeBackgroundOpacity, themePacks, activeThemePack, readEffectSettings, writeEffectSettings, applyEffectSettings,
  validateScheduleText, renderSourceWarnings, toggleTaskCompleted, themeEasterEggMessage, completionStats,
  themeBadgeImage, themeBadgeText, panelOpacity, panelOpacityValue,
  uncategorizedLabel, setViewMode: (mode) => { viewMode = mode; },
  getViewMode: () => viewMode,
  getCurrentItem: (id) => currentItems.get(id)
};`)();

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function items(days, day) {
  return days.get(day) || [];
}

function countEasterEggs(themeId) {
  const eggs = api.themePacks[themeId].easterEggs;
  return Object.values(eggs.complete).reduce((sum, list) => sum + list.length, 0)
    + eggs.dayClear.length
    + eggs.weekClear.length
    + eggs.rare.length
    + eggs.undo.length;
}

function serviceWorkerAssets() {
  const assetBlocks = [...serviceWorker.matchAll(/const (?:CORE_ASSETS|RUNTIME_ASSET_PREFIXES) = \[([\s\S]*?)\];/g)];
  assert(assetBlocks.length, "service worker should declare cached assets");
  return new Set(assetBlocks.flatMap(([, block]) => [...block.matchAll(/"([^"]+)"/g)].map(([, asset]) => asset)));
}

function resetState() {
  for (const key of [
    "weeklyTimetableTaskState:v1",
    "weeklyTimetableTemplates:v1",
    "weeklyTimetableTheme:v1",
    "weeklyTimetableBackgrounds:v1",
    "weeklyTimetableEffects:v1",
  ]) {
    localStorage.removeItem(key);
  }
  api.setViewMode("week");
  api.applyTheme("default", { persist: false, rerender: false });
}

test("parses point and ranged tasks; first point floats upward", () => {
  const days = api.parseSchedule("**周一**\n- `8:30` 起床\n- `8:30 - 9:00` 早餐");
  assert(items(days, "周一").length === 2, "expected 2 items");
  assert(items(days, "周一")[0].firstPoint === true, "first point should be firstPoint");
  assert(items(days, "周一")[1].firstPoint !== true, "ranged item should not be firstPoint");
});

test("detects real overlap but not touching intervals", () => {
  let days = api.parseSchedule("**周一**\n- `9:00 - 12:00` 任务A\n- `10:00 - 11:00` 任务B");
  assert(days.conflicts.length === 1, "expected one conflict");
  assert(items(days, "周一").every((item) => item.conflict), "both overlapped items should be marked");
  days = api.parseSchedule("**周一**\n- `9:00 - 10:00` 任务A\n- `10:00 - 11:00` 任务B");
  assert(days.conflicts.length === 0, "touching intervals should not conflict");
});

test("handles midnight rollover", () => {
  const days = api.parseSchedule("**周五**\n- `23:50 - 00:30` 游戏");
  const item = items(days, "周五")[0];
  assert(item.minutes === 40, "midnight duration should be 40 minutes");
  assert(item.logicalEnd > item.logicalStart, "logical end should be after start");
});

test("later point sharing a start is raised", () => {
  const days = api.parseSchedule("**周一**\n- `8:00 - 8:20` A\n- `9:00` 提醒\n- `9:00 - 9:30` B");
  const point = items(days, "周一")[1];
  assert(point.pointRaised === true, "same-start non-first point should be raised");
});

test("parses mixed real-world schedule formats across all days", () => {
  resetState();
  const text = [
    "### 周一",
    "* `07:45` 起床",
    "- `08:00 至 08:30` 洗漱 + 早餐",
    "**周二**",
    "- `9:00–10:20` 韩语背诵",
    "- `10:20 — 10:35` 论文速读",
    "周三",
    "- 13:00 到 17:30 实验室学习研究生内容",
    "周四",
    "- `18:00 - 22:20` 上班相关时间",
    "周五",
    "- `23:50 - 00:30` 游戏",
    "周六",
    "- `10:30 - 11:30` 健身：背部 + 手臂",
    "周日",
    "- `22:15` 睡前放松",
  ].join("\n");
  const days = api.parseSchedule(text);
  assert(items(days, "周一").length === 2, "Monday should parse heading, point, and range");
  assert(items(days, "周二")[0].minutes === 80, "en dash range should parse duration");
  assert(items(days, "周三")[0].minutes === 270, "Chinese 到 range should parse duration");
  assert(items(days, "周五")[0].minutes === 40, "midnight rollover should still work in mixed data");
  assert(items(days, "周六")[0].category === "运动", "fitness keyword should infer category");
  assert(items(days, "周日")[0].end === "", "point task should keep empty end");
});

test("category override and uncategorized exclusion affect summary", () => {
  const key = api.makeTaskKey("周一", "09:00", "10:00", "游戏");
  api.updateTaskState(key, (state) => ({ ...state, category: api.uncategorizedLabel }));
  const days = api.parseSchedule("**周一**\n- `9:00 - 10:00` 游戏");
  assert(items(days, "周一")[0].category === api.uncategorizedLabel, "category override should apply");
  api.renderSummary(days, ["周一"]);
  assert(!api.summary.innerHTML.includes("游戏 /"), "uncategorized should not count as game");
  assert(api.summary.innerHTML.includes("暂无分类时间"), "summary should show no category time");
});

test("custom category is counted and reusable", () => {
  const key = api.makeTaskKey("周二", "09:00", "10:00", "写作");
  api.updateTaskState(key, (state) => ({ ...state, category: "创作" }));
  const days = api.parseSchedule("**周二**\n- `9:00 - 10:00` 写作");
  api.renderSummary(days, ["周二"]);
  assert(api.summary.innerHTML.includes("创作 /"), "custom category should appear in summary");
});

test("today view filters to one day", () => {
  const days = api.parseSchedule("**周一**\n- `9:00 - 10:00` A\n**周二**\n- `9:00 - 10:00` B");
  api.setViewMode("today");
  assert(api.getActiveDays(days).length === 1, "today view should contain one day");
  api.setViewMode("week");
  assert(api.getActiveDays(days).length === 7, "week view should contain seven days");
});

test("completion rate counts completed tasks", () => {
  resetState();
  const key = api.makeTaskKey("周一", "09:00", "10:00", "A");
  api.updateTaskState(key, (state) => ({ ...state, completed: true }));
  const days = api.parseSchedule("**周一**\n- `9:00 - 10:00` A\n- `10:00 - 11:00` B");
  api.renderSummary(days, ["周一"]);
  assert(api.summary.innerHTML.includes("50%"), "completion should be 50%");
  assert(api.summary.innerHTML.includes("完成率 1/2"), "completion count should be 1/2");
});

test("toggle completion refreshes summary and day header immediately", () => {
  resetState();
  api.source.value = "**周一**\n- `9:00 - 10:00` A\n- `10:00 - 11:00` B";
  api.render();
  assert(api.summary.innerHTML.includes("0%"), "initial summary should be 0%");
  assert(api.week.innerHTML.includes("0/2 完成"), "initial day header should show 0/2");
  api.toggleTaskCompleted(api.getCurrentItem("周一-0"));
  assert(api.summary.innerHTML.includes("50%"), "summary should refresh after completion toggle");
  assert(api.week.innerHTML.includes("1/2 完成"), "day header should refresh after completion toggle");
});

test("source checker catches malformed import lines", () => {
  resetState();
  api.source.value = [
    "- `8:30 - 9:00` 没有星期",
    "**周一**",
    "- `25:00 - 26:00` 错误时间",
    "- `9:0 - 10:00` 分钟少一位",
    "- 这行没有时间",
    "- `10:00 - 10:30`",
  ].join("\n");
  const warnings = api.renderSourceWarnings();
  assert(warnings.length >= 5, "source checker should report malformed lines");
  assert(api.sourceWarnings.classList.contains("show"), "warning panel should be shown");
  assert(api.sourceWarnings.innerHTML.includes("导入检查发现"), "warning panel should render summary");
});

test("summary combines categories, completion, and active day filtering", () => {
  resetState();
  api.updateTaskState(api.makeTaskKey("周一", "09:00", "10:00", "游戏"), (state) => ({ ...state, completed: true }));
  api.updateTaskState(api.makeTaskKey("周一", "10:00", "10:30", "韩语背诵"), (state) => ({ ...state, completed: true }));
  const days = api.parseSchedule("**周一**\n- `9:00 - 10:00` 游戏\n- `10:00 - 10:30` 韩语背诵\n**周二**\n- `9:00 - 11:00` 实验室学习研究生内容");
  api.renderSummary(days, ["周一"]);
  assert(api.summary.innerHTML.includes("100%"), "Monday-only summary should show all Monday tasks completed");
  assert(api.summary.innerHTML.includes("游戏 /"), "game category should be scoped to active days");
  assert(api.summary.innerHTML.includes("1小时"), "game total should include one hour");
  assert(!api.summary.innerHTML.includes("实验室 /"), "inactive days should not contribute category totals");
  api.renderSummary(days, ["周一", "周二"]);
  assert(api.summary.innerHTML.includes("67%"), "multi-day summary should include Tuesday unfinished task");
  assert(api.summary.innerHTML.includes("实验室 /"), "multi-day summary should include lab category");
  assert(api.summary.innerHTML.includes("2小时"), "multi-day summary should include lab duration");
});

test("template save/load/delete round trip", () => {
  api.source.value = "**周一**\n- `8:00 - 9:00` 模板任务";
  api.templateName.value = "测试模板";
  api.saveTemplate();
  let templates = api.readTemplates();
  assert(templates["测试模板"] && templates["测试模板"].includes("模板任务"), "template should save");
  api.source.value = "changed";
  api.templateSelect.value = "测试模板";
  api.loadTemplate();
  assert(api.source.value.includes("模板任务"), "template should load");
  api.templateSelect.value = "测试模板";
  api.deleteTemplate();
  templates = api.readTemplates();
  assert(!templates["测试模板"], "template should delete");
});

test("renderWeek today mode produces one day column setting", () => {
  const days = api.parseSchedule("**周一**\n- `9:00 - 10:00` A");
  api.renderWeek(days, ["周一"]);
  assert(api.week.innerHTML.includes("--day-count: 1"), "today/one-day render should set day-count 1");
});

test("drawExportCanvas respects active day count", () => {
  const days = api.parseSchedule("**周一**\n- `9:00 - 10:00` A\n**周二**\n- `9:00 - 10:00` B");
  const oneDay = api.drawExportCanvas(days, ["周一"]);
  const week = api.drawExportCanvas(days, ["周一", "周二"]);
  assert(oneDay.width < week.width, "one-day export should be narrower than multi-day export");
});

test("weekly review summarizes totals and busiest day", () => {
  const days = api.parseSchedule("**周一**\n- `9:00 - 10:00` 游戏\n**周二**\n- `9:00 - 11:00` 跑步\n- `12:00 - 12:15` 论文");
  const review = api.buildWeeklyReview(days);
  assert(review.totalMinutes === 195, "weekly review should sum timed tasks");
  assert(review.busiestDay.day === "周二", "Tuesday should be busiest");
  assert(review.fitnessDays === 1, "fitness days should count days with fitness category");
});

test("backup export and import restores source, state, and templates", () => {
  resetState();
  const key = api.makeTaskKey("周一", "09:00", "10:00", "A");
  api.source.value = "**周一**\n- `9:00 - 10:00` A";
  api.updateTaskState(key, (state) => ({ ...state, completed: true }));
  api.writeTemplates({ T1: api.source.value });
  const backup = api.createBackupPayload();
  api.source.value = "**周二**\n- `8:00 - 9:00` B";
  api.writeTemplates({});
  api.backupText.value = JSON.stringify(backup);
  api.importBackup();
  assert(api.source.value.includes("A"), "source should restore from backup");
  assert(api.readTaskState(key).completed === true, "task state should restore from backup");
  assert(api.readTemplates().T1, "templates should restore from backup");
});

test("theme switching persists and changes category palette", () => {
  resetState();
  api.applyTheme("snow-lotus", { rerender: false });
  assert(api.readTheme() === "snow-lotus", "theme should persist");
  assert(api.categoryColorsFor("游戏")[1] === "#b8c1d8", "snow lotus palette should override category colors");
  assert(api.themeBadgeText.textContent === "东雪莲主题 · Azuma Seren", "snow lotus badge should update");
  assert(api.themeBadgeImage.src.includes("assets/dongxuelian/table-backgrounds/blue-collage.jpg"), "snow lotus badge image should update");
  api.applyTheme("default", { rerender: false });
  assert(api.categoryColorsFor("游戏")[1] === "#e7e0f2", "default palette should restore category colors");
  assert(api.themeBadgeText.textContent === "默认手账 · Weekly Planner", "default badge should update");
  assert(api.themeBadgeImage.src.includes("icon.svg"), "default badge image should update");
});

test("theme packs centralize palette backgrounds export colors and tones", () => {
  resetState();
  api.applyTheme("ace-taffy", { rerender: false });
  const pack = api.activeThemePack();
  assert(pack.backgrounds.pageOptions.some((asset) => asset.id === "taffy-pink-room"), "taffy pack should expose page backgrounds");
  assert(pack.backgrounds.tableOptions.some((asset) => asset.id === "taffy-pink-room-table"), "taffy pack should expose table backgrounds");
  assert(pack.categoryPalette.game[1] === "#df74b3", "taffy pack should expose category palette");
  assert(pack.exportColors.paper === "#fff3fb", "taffy pack should expose export colors");
  assert(Array.isArray(pack.effectTones.complete), "taffy pack should expose effect tones");
});

test("theme easter eggs use active theme and category", () => {
  resetState();
  const random = Math.random;
  Math.random = () => 0.99;
  api.applyTheme("ace-taffy", { rerender: false });
  const message = api.themeEasterEggMessage({ category: "游戏" }, true);
  assert(api.themePacks["ace-taffy"].easterEggs.complete.game.includes(message), "taffy game easter egg should come from its category pool");
  api.applyTheme("snow-lotus", { rerender: false });
  const snowMessage = api.themeEasterEggMessage({ category: "运动" }, true);
  assert(api.themePacks["snow-lotus"].easterEggs.complete.fitness.includes(snowMessage), "snow lotus fitness easter egg should come from its category pool");
  api.applyTheme("diana-jiaran", { rerender: false });
  const jiaranMessage = api.themeEasterEggMessage({ category: "学习" }, true);
  assert(api.themePacks["diana-jiaran"].easterEggs.complete.study.includes(jiaranMessage), "jiaran study easter egg should come from its category pool");
  Math.random = random;
});

test("theme easter eggs prioritize day clear and week clear triggers", () => {
  resetState();
  api.applyTheme("ace-taffy", { rerender: false });
  api.updateTaskState(api.makeTaskKey("周一", "09:00", "10:00", "游戏"), (state) => ({ ...state, completed: true }));
  api.updateTaskState(api.makeTaskKey("周一", "10:00", "11:00", "学习"), (state) => ({ ...state, completed: true }));
  let days = api.parseSchedule("**周一**\n- `9:00 - 10:00` 游戏\n- `10:00 - 11:00` 学习\n**周二**\n- `9:00 - 10:00` B");
  assert(api.completionStats(days, "周一").dayClear === true, "Monday should be day-clear");
  assert(api.completionStats(days, "周一").weekClear === false, "week should not be clear yet");
  let message = api.themeEasterEggMessage(items(days, "周一")[0], true, days);
  assert(api.themePacks["ace-taffy"].easterEggs.dayClear.includes(message), "day clear should use day clear message pool");
  api.updateTaskState(api.makeTaskKey("周二", "09:00", "10:00", "B"), (state) => ({ ...state, completed: true }));
  days = api.parseSchedule("**周一**\n- `9:00 - 10:00` 游戏\n- `10:00 - 11:00` 学习\n**周二**\n- `9:00 - 10:00` B");
  assert(api.completionStats(days, "周二").weekClear === true, "week should be clear after all tasks complete");
  message = api.themeEasterEggMessage(items(days, "周二")[0], true, days);
  assert(api.themePacks["ace-taffy"].easterEggs.weekClear.includes(message), "week clear should use week clear message pool");
});

test("effect settings persist and update document controls", () => {
  resetState();
  api.writeEffectSettings({ motion: "reduced", sound: true });
  const settings = api.readEffectSettings();
  assert(settings.motion === "reduced", "motion setting should persist");
  assert(settings.sound === true, "sound setting should persist");
  api.applyEffectSettings(settings);
  assert(document.body.dataset.effects === "reduced", "body should receive motion effect setting");
  assert(document.body.dataset.sound === "on", "body should receive sound effect setting");
});

test("snow lotus background choices persist and update css variables", () => {
  resetState();
  api.applyTheme("snow-lotus", { rerender: false });
  let backgrounds = api.readThemeBackgrounds();
  assert(backgrounds.page === "blue-city-garden", "default page background should be blue city garden");
  assert(backgrounds.table === "rainy-umbrella", "default table background should be rainy umbrella");
  assert(backgrounds.pageOpacity === 46, "default page opacity should be 46");
  assert(backgrounds.tableOpacity === 82, "default table opacity should be 82");
  assert(backgrounds.taskOpacity === 38, "default task opacity should be 38");
  assert(backgrounds.panelOpacity === 100, "default panel opacity should be 100");
  assert(document.body.dataset.tableTone === "dark", "dark table background should select dark task tone");
  api.selectThemeBackground("page", "sunset-birds");
  backgrounds = api.readThemeBackgrounds();
  assert(backgrounds.page === "sunset-birds", "page background should persist");
  assert(document.body.style["--snow-page-bg"].includes("page-backgrounds/sunset-birds.jpg"), "page css variable should update");
  api.selectThemeBackground("table", "chibi-pattern");
  backgrounds = api.readThemeBackgrounds();
  assert(backgrounds.table === "chibi-pattern", "table background should persist");
  assert(document.body.style["--snow-table-bg"].includes("table-backgrounds/chibi-pattern.jpg"), "table css variable should update");
  assert(document.body.dataset.tableTone === "light", "light table background should select light task tone");
  api.selectThemeBackgroundOpacity("pageOpacity", 71);
  api.selectThemeBackgroundOpacity("tableOpacity", 39);
  api.selectThemeBackgroundOpacity("taskOpacity", 64);
  api.selectThemeBackgroundOpacity("panelOpacity", 57);
  backgrounds = api.readThemeBackgrounds();
  assert(backgrounds.pageOpacity === 71, "page opacity should persist");
  assert(backgrounds.tableOpacity === 39, "table opacity should persist");
  assert(backgrounds.taskOpacity === 64, "task opacity should persist");
  assert(backgrounds.panelOpacity === 57, "panel opacity should persist");
  assert(document.body.style["--snow-page-opacity"] === "0.71", "page opacity css variable should update");
  assert(document.body.style["--snow-table-opacity"] === "0.39", "table opacity css variable should update");
  assert(document.body.style["--snow-task-surface-opacity"] === "0.36", "task opacity css variable should update");
  assert(document.body.style["--theme-panel-opacity"] === "0.43", "panel transparency css variable should invert to opacity");
  assert(api.panelOpacityValue.textContent === "57%", "panel opacity label should update");
});

test("taffy theme uses its own palette and background gallery", () => {
  resetState();
  api.applyTheme("ace-taffy", { rerender: false });
  let backgrounds = api.readThemeBackgrounds();
  assert(api.readTheme() === "ace-taffy", "taffy theme should persist");
  assert(api.categoryColorsFor("游戏")[1] === "#df74b3", "taffy palette should override game colors");
  assert(api.themeBadgeText.textContent === "Taffy 主题 · Ace Taffy", "taffy badge should update");
  assert(api.themeBadgeImage.src.includes("assets/taffy/page-backgrounds/115570927_p0.png"), "taffy badge image should update");
  assert(backgrounds.page === "taffy-pink-room", "default taffy page background should be pink room");
  assert(backgrounds.table === "taffy-pink-room-table", "default taffy table background should be pink room");
  assert(backgrounds.pageOpacity === 34, "default taffy page opacity should be 34");
  assert(backgrounds.tableOpacity === 74, "default taffy table opacity should be 74");
  assert(backgrounds.taskOpacity === 34, "default taffy task opacity should be 34");
  assert(backgrounds.panelOpacity === 100, "default taffy panel opacity should be 100");
  api.selectThemeBackground("page", "taffy-bunny-pop");
  backgrounds = api.readThemeBackgrounds();
  assert(backgrounds.page === "taffy-bunny-pop", "taffy page background should persist");
  assert(document.body.style["--snow-page-bg"].includes("assets/taffy/page-backgrounds/96972053_p0.jpg"), "taffy page css variable should update");
  api.selectThemeBackground("table", "taffy-square-sugar-table");
  backgrounds = api.readThemeBackgrounds();
  assert(backgrounds.table === "taffy-square-sugar-table", "taffy table background should persist");
  assert(document.body.style["--snow-table-bg"].includes("assets/taffy/table-backgrounds/131274076_p0.png"), "taffy table css variable should update");
  api.applyTheme("default", { rerender: false });
});

test("jiaran theme uses its own palette, background gallery, and easter egg pool", () => {
  resetState();
  api.applyTheme("diana-jiaran", { rerender: false });
  let backgrounds = api.readThemeBackgrounds();
  assert(api.readTheme() === "diana-jiaran", "jiaran theme should persist");
  assert(api.categoryColorsFor("游戏")[1] === "#df6d87", "jiaran palette should override game colors");
  assert(api.themeBadgeText.textContent === "嘉然主题 · Diana", "jiaran badge should update");
  assert(api.themeBadgeImage.src.includes("assets/jiaran/page-backgrounds/strawberry-diana.png"), "jiaran badge image should update");
  assert(api.themePacks["diana-jiaran"].backgrounds.pageOptions.length === 3, "jiaran theme should expose 3 page backgrounds");
  assert(api.themePacks["diana-jiaran"].backgrounds.tableOptions.length === 10, "jiaran theme should expose 10 table backgrounds");
  assert(
    api.themePacks["diana-jiaran"].backgrounds.tableOptions.every((option) => option.fit === "100% 100%"),
    "jiaran table backgrounds should fit the full timetable area"
  );
  assert(document.body.style["--snow-table-bg-size"] === "100% 100%", "jiaran table background should stretch to the full timetable");
  const jiaranBackgroundIds = [
    ...api.themePacks["diana-jiaran"].backgrounds.pageOptions,
    ...api.themePacks["diana-jiaran"].backgrounds.tableOptions,
  ].map((option) => option.id);
  assert(!jiaranBackgroundIds.includes("jiaran-promo"), "old jiaran page background id should not be exposed");
  assert(!jiaranBackgroundIds.includes("jiaran-shining"), "old jiaran shining background id should not be exposed");
  assert(!jiaranBackgroundIds.includes("jiaran-strawberry-table"), "old jiaran table background id should not be exposed");
  assert(!jiaranBackgroundIds.includes("jiaran-candy-table"), "old jiaran candy background id should not be exposed");
  assert(backgrounds.page === "jiaran-strawberry", "default jiaran page background should be strawberry");
  assert(backgrounds.table === "jiaran-friday-drum-table", "default jiaran table background should be friday drum");
  assert(backgrounds.pageOpacity === 38, "default jiaran page opacity should be 38");
  assert(backgrounds.tableOpacity === 70, "default jiaran table opacity should be 70");
  assert(backgrounds.taskOpacity === 36, "default jiaran task opacity should be 36");
  assert(backgrounds.panelOpacity === 100, "default jiaran panel opacity should be 100");
  assert(countEasterEggs("diana-jiaran") === 60, "jiaran theme should have 60 easter eggs");
  api.selectThemeBackground("page", "jiaran-poolside");
  backgrounds = api.readThemeBackgrounds();
  assert(backgrounds.page === "jiaran-poolside", "jiaran page background should persist");
  assert(document.body.style["--snow-page-bg"].includes("assets/jiaran/page-backgrounds/poolside-portrait.jpg"), "jiaran page css variable should update");
  api.selectThemeBackground("table", "jiaran-deadline-table");
  backgrounds = api.readThemeBackgrounds();
  assert(backgrounds.table === "jiaran-deadline-table", "jiaran table background should persist");
  assert(document.body.style["--snow-table-bg"].includes("assets/jiaran/table-backgrounds/deadline-grave.jpg"), "jiaran table css variable should update");
  assert(document.body.style["--snow-table-bg-size"] === "100% 100%", "selected jiaran table background should preserve fit mode");
  api.applyTheme("default", { rerender: false });
});

test("theme background assets exist and configurable themes are cached", () => {
  const cached = serviceWorkerAssets();
  for (const theme of api.appThemes) {
    if (theme.image) {
      assert(fs.existsSync(path.join(__dirname, theme.image)), `${theme.id} preview image should exist`);
    }
    const pack = api.themePacks[theme.id];
    if (!pack?.backgrounds) continue;
    for (const option of [...pack.backgrounds.pageOptions, ...pack.backgrounds.tableOptions]) {
      assert(fs.existsSync(path.join(__dirname, option.image)), `${theme.id} background should exist: ${option.image}`);
      assert(cached.has(option.image), `${theme.id} background should be precached: ${option.image}`);
    }
  }
});

test("backup restores taffy theme background configuration", () => {
  resetState();
  api.applyTheme("ace-taffy", { rerender: false });
  api.selectThemeBackground("page", "taffy-puff-party");
  api.selectThemeBackground("table", "taffy-bunny-pop-table");
  api.selectThemeBackgroundOpacity("pageOpacity", 44);
  api.selectThemeBackgroundOpacity("tableOpacity", 58);
  api.selectThemeBackgroundOpacity("taskOpacity", 71);
  api.selectThemeBackgroundOpacity("panelOpacity", 63);
  api.writeEffectSettings({ motion: "off", sound: true });
  const backup = api.createBackupPayload();
  assert(backup.effects.motion === "off", "backup should include effect motion setting");
  assert(backup.effects.sound === true, "backup should include effect sound setting");
  api.applyTheme("snow-lotus", { rerender: false });
  api.writeEffectSettings({ motion: "normal", sound: false });
  api.backupText.value = JSON.stringify(backup);
  api.importBackup();
  const backgrounds = api.readThemeBackgrounds();
  const effects = api.readEffectSettings();
  assert(api.readTheme() === "ace-taffy", "backup should restore taffy theme");
  assert(backgrounds.page === "taffy-puff-party", "backup should restore taffy page background");
  assert(backgrounds.table === "taffy-bunny-pop-table", "backup should restore taffy table background");
  assert(backgrounds.pageOpacity === 44, "backup should restore page opacity");
  assert(backgrounds.tableOpacity === 58, "backup should restore table opacity");
  assert(backgrounds.taskOpacity === 71, "backup should restore task opacity");
  assert(backgrounds.panelOpacity === 63, "backup should restore panel opacity");
  assert(effects.motion === "off", "backup should restore effect motion setting");
  assert(effects.sound === true, "backup should restore effect sound setting");
});

test("invalid background ids fall back to active theme defaults", () => {
  resetState();
  api.applyTheme("ace-taffy", { rerender: false });
  api.selectThemeBackground("page", "not-a-real-background");
  api.selectThemeBackground("table", "not-a-real-background");
  const backgrounds = api.readThemeBackgrounds();
  assert(backgrounds.page === "taffy-pink-room", "invalid taffy page background should fall back");
  assert(backgrounds.table === "taffy-pink-room-table", "invalid taffy table background should fall back");
});

let passed = 0;
const failures = [];
for (const t of tests) {
  try {
    t.fn();
    passed += 1;
    console.log("PASS", t.name);
  } catch (error) {
    failures.push({ name: t.name, error: error.message });
    console.error("FAIL", t.name, error.message);
  }
}

console.log(JSON.stringify({ passed, failed: failures.length, failures }, null, 2));
if (failures.length) process.exit(1);

const source = document.querySelector("#source");
const sourceWarnings = document.querySelector("#sourceWarnings");
const week = document.querySelector("#week");
const summary = document.querySelector("#summary");
const conflictsPanel = document.querySelector("#conflicts");
const toast = document.querySelector("#toast");
const metaThemeColor = document.querySelector("meta[name='theme-color']");
const themeBadge = document.querySelector("#themeBadge");
const themeBadgeImage = document.querySelector("#themeBadgeImage");
const themeBadgeText = document.querySelector("#themeBadgeText");
const helpModal = document.querySelector("#helpModal");
const importModal = document.querySelector("#importModal");
const templateModal = document.querySelector("#templateModal");
const themeModal = document.querySelector("#themeModal");
const themeOptions = document.querySelector("#themeOptions");
const motionEffectSelect = document.querySelector("#motionEffectSelect");
const soundEffectToggle = document.querySelector("#soundEffectToggle");
const panelOpacity = document.querySelector("#panelOpacity");
const panelOpacityValue = document.querySelector("#panelOpacityValue");
const backgroundModal = document.querySelector("#backgroundModal");
const pageBackgroundOptions = document.querySelector("#pageBackgroundOptions");
const tableBackgroundOptions = document.querySelector("#tableBackgroundOptions");
const pageBackgroundOpacity = document.querySelector("#pageBackgroundOpacity");
const pageBackgroundOpacityValue = document.querySelector("#pageBackgroundOpacityValue");
const tableBackgroundOpacity = document.querySelector("#tableBackgroundOpacity");
const tableBackgroundOpacityValue = document.querySelector("#tableBackgroundOpacityValue");
const taskBlockOpacity = document.querySelector("#taskBlockOpacity");
const taskBlockOpacityValue = document.querySelector("#taskBlockOpacityValue");
const reviewModal = document.querySelector("#reviewModal");
const reviewBody = document.querySelector("#reviewBody");
const backupModal = document.querySelector("#backupModal");
const backupText = document.querySelector("#backupText");
const templateName = document.querySelector("#templateName");
const templateSelect = document.querySelector("#templateSelect");
const sideDrawer = document.querySelector("#sideDrawer");
const drawerBackdrop = document.querySelector("#drawerBackdrop");
const mobileTodayButton = document.querySelector("#mobileTodayButton");
const mobileWeekButton = document.querySelector("#mobileWeekButton");
const mobileThemeButton = document.querySelector("#mobileThemeButton");
const mobileImportButton = document.querySelector("#mobileImportButton");
const mobileExportButton = document.querySelector("#mobileExportButton");
const taskModal = document.querySelector("#taskModal");
const taskBody = document.querySelector("#taskBody");
const secretModal = document.querySelector("#secretModal");
const secretBody = document.querySelector("#secretBody");
const taskStateStoreKey = "weeklyTimetableTaskState:v1";
const templateStoreKey = "weeklyTimetableTemplates:v1";
const themeStoreKey = "weeklyTimetableTheme:v1";
const themeBackgroundStoreKey = "weeklyTimetableBackgrounds:v1";
const effectStoreKey = "weeklyTimetableEffects:v1";
const timeEggStoreKey = "weeklyTimetableTimeEgg:v1";
const collectionStoreKey = "weeklyTimetableCollection:v1";
const defaultEffectSettings = { motion: "normal", sound: false };
let currentItems = new Map();
let activeTaskId = "";
let viewMode = isMobileViewport() ? "today" : "week";
let currentTheme = "default";
let previousCompletion = null;
let pressTimer = 0;
let pressingElement = null;
let suppressNextClick = false;
let toastTimer = 0;
let audioContext = null;
let secretTapCount = 0;
let secretTapTimer = 0;

source.value = sampleText;
applyTheme(readTheme(), { persist: false, rerender: false });
applyEffectSettings(readEffectSettings());

document.querySelector("#renderButton").addEventListener("click", () => {
  const count = render();
  showToast(`已刷新表格：识别到 ${count} 个时间块`);
});
document.querySelector("#viewToggleButton").addEventListener("click", () => {
  setViewMode(viewMode === "week" ? "today" : "week");
});
document.querySelector("#importButton").addEventListener("click", openImport);
document.querySelector("#applyImportButton").addEventListener("click", () => {
  renderSourceWarnings();
  const count = render();
  closeImport();
  showToast(`已导入表格：识别到 ${count} 个时间块`);
});
document.querySelector("#closeImportButton").addEventListener("click", closeImport);
document.querySelector("#sampleButton").addEventListener("click", () => {
  source.value = sampleText;
  const count = render();
  closeDrawer();
  showToast(`已恢复示例：${count} 个时间块`);
});
document.querySelector("#exportButton").addEventListener("click", exportPdf);
mobileTodayButton?.addEventListener("click", () => setViewMode("today"));
mobileWeekButton?.addEventListener("click", () => setViewMode("week"));
mobileThemeButton?.addEventListener("click", () => {
  setMobileNavIndex(2);
  openTheme();
});
mobileImportButton?.addEventListener("click", () => {
  setMobileNavIndex(3);
  openImport();
});
mobileExportButton?.addEventListener("click", () => {
  setMobileNavIndex(4);
  exportPdf();
});
document.querySelector("#menuButton").addEventListener("click", openDrawer);
document.querySelector("#closeMenuButton").addEventListener("click", closeDrawer);
drawerBackdrop.addEventListener("click", closeDrawer);
document.querySelector("#drawerHelpButton").addEventListener("click", () => {
  closeDrawer();
  openHelp();
});
document.querySelector("#themeButton").addEventListener("click", () => {
  closeDrawer();
  openTheme();
});
document.querySelector("#templateButton").addEventListener("click", () => {
  closeDrawer();
  openTemplates();
});
document.querySelector("#reviewButton").addEventListener("click", () => {
  closeDrawer();
  openReview();
});
document.querySelector("#backupButton").addEventListener("click", () => {
  closeDrawer();
  openBackup();
});
document.querySelector("#closeHelpButton").addEventListener("click", closeHelp);
document.querySelector("#closeThemeButton").addEventListener("click", closeTheme);
document.querySelector("#closeTemplateButton").addEventListener("click", closeTemplates);
document.querySelector("#closeReviewButton").addEventListener("click", closeReview);
document.querySelector("#closeBackupButton").addEventListener("click", closeBackup);
document.querySelector("#closeSecretButton")?.addEventListener("click", closeSecret);
document.querySelector("#exportBackupButton").addEventListener("click", exportBackup);
document.querySelector("#importBackupButton").addEventListener("click", importBackup);
document.querySelector("#saveTemplateButton").addEventListener("click", saveTemplate);
document.querySelector("#loadTemplateButton").addEventListener("click", loadTemplate);
document.querySelector("#deleteTemplateButton").addEventListener("click", deleteTemplate);
document.querySelector("#closeBackgroundButton").addEventListener("click", closeBackgroundSettings);
document.querySelector("#closeTaskButton").addEventListener("click", closeTaskDetail);
helpModal.addEventListener("click", (event) => {
  if (event.target === helpModal) closeHelp();
});
importModal.addEventListener("click", (event) => {
  if (event.target === importModal) closeImport();
});
templateModal.addEventListener("click", (event) => {
  if (event.target === templateModal) closeTemplates();
});
themeModal.addEventListener("click", (event) => {
  if (event.target === themeModal) closeTheme();
});
themeOptions.addEventListener("click", (event) => {
  const backgroundButton = event.target.closest("[data-bg-theme-id]");
  if (backgroundButton) {
    applyTheme(backgroundButton.dataset.bgThemeId);
    openBackgroundSettings();
    return;
  }
  const button = event.target.closest("[data-theme-id]");
  if (!button) return;
  applyTheme(button.dataset.themeId);
  showToast(`已切换皮肤：${button.dataset.themeName}`);
});
motionEffectSelect.addEventListener("change", () => {
  const settings = readEffectSettings();
  settings.motion = motionEffectSelect.value;
  writeEffectSettings(settings);
  applyEffectSettings(settings);
  showToast(`动效已切换：${effectMotionLabel(settings.motion)}`);
});
soundEffectToggle.addEventListener("change", () => {
  const settings = readEffectSettings();
  settings.sound = soundEffectToggle.checked;
  writeEffectSettings(settings);
  applyEffectSettings(settings);
  if (settings.sound) playThemeEffectSound(true);
  showToast(settings.sound ? "完成音效已开启" : "完成音效已关闭");
});
const updatePanelOpacity = () => {
  selectThemeBackgroundOpacity("panelOpacity", panelOpacity.value);
};
panelOpacity.addEventListener("input", updatePanelOpacity);
panelOpacity.addEventListener("change", updatePanelOpacity);
backgroundModal.addEventListener("click", (event) => {
  if (event.target === backgroundModal) closeBackgroundSettings();
  const choice = event.target.closest("[data-background-target]");
  if (!choice) return;
  selectThemeBackground(choice.dataset.backgroundTarget, choice.dataset.backgroundId);
});
const updatePageBackgroundOpacity = () => {
  selectThemeBackgroundOpacity("pageOpacity", pageBackgroundOpacity.value);
};
const updateTableBackgroundOpacity = () => {
  selectThemeBackgroundOpacity("tableOpacity", tableBackgroundOpacity.value);
};
const updateTaskBlockOpacity = () => {
  selectThemeBackgroundOpacity("taskOpacity", taskBlockOpacity.value);
};
pageBackgroundOpacity.addEventListener("input", updatePageBackgroundOpacity);
pageBackgroundOpacity.addEventListener("change", updatePageBackgroundOpacity);
tableBackgroundOpacity.addEventListener("input", updateTableBackgroundOpacity);
tableBackgroundOpacity.addEventListener("change", updateTableBackgroundOpacity);
taskBlockOpacity.addEventListener("input", updateTaskBlockOpacity);
taskBlockOpacity.addEventListener("change", updateTaskBlockOpacity);
source.addEventListener("input", debounce(renderSourceWarnings, 140));
reviewModal.addEventListener("click", (event) => {
  if (event.target === reviewModal) closeReview();
});
backupModal.addEventListener("click", (event) => {
  if (event.target === backupModal) closeBackup();
});
taskModal.addEventListener("click", (event) => {
  if (event.target === taskModal) closeTaskDetail();
});
secretModal?.addEventListener("click", (event) => {
  if (event.target === secretModal) closeSecret();
});
themeBadge?.addEventListener("click", handleThemeBadgeSecretTap);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && helpModal.classList.contains("show")) closeHelp();
  if (event.key === "Escape" && themeModal.classList.contains("show")) closeTheme();
  if (event.key === "Escape" && taskModal.classList.contains("show")) closeTaskDetail();
  if (event.key === "Escape" && importModal.classList.contains("show")) closeImport();
  if (event.key === "Escape" && templateModal.classList.contains("show")) closeTemplates();
  if (event.key === "Escape" && reviewModal.classList.contains("show")) closeReview();
  if (event.key === "Escape" && backupModal.classList.contains("show")) closeBackup();
  if (event.key === "Escape" && backgroundModal.classList.contains("show")) closeBackgroundSettings();
  if (event.key === "Escape" && secretModal?.classList.contains("show")) closeSecret();
  if (event.key === "Escape" && sideDrawer.classList.contains("show")) closeDrawer();
});
week.addEventListener("click", (event) => {
  if (suppressNextClick) {
    suppressNextClick = false;
    return;
  }
  const itemElement = event.target.closest(".item");
  if (!itemElement) return;
  const item = currentItems.get(itemElement.dataset.itemId);
  if (item) openTaskDetail(item);
});
week.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const itemElement = event.target.closest(".item");
  if (!itemElement) return;
  event.preventDefault();
  const item = currentItems.get(itemElement.dataset.itemId);
  if (item) openTaskDetail(item);
});
week.addEventListener("pointerdown", startLongPress);
week.addEventListener("pointerup", cancelLongPress);
week.addEventListener("pointerleave", cancelLongPress);
week.addEventListener("pointercancel", cancelLongPress);
taskBody.addEventListener("submit", handleTaskDetailSubmit);
taskBody.addEventListener("click", handleTaskDetailClick);
taskBody.addEventListener("change", handleTaskDetailChange);
source.addEventListener("input", debounce(render, 250));

render();
updateViewToggleButton();
window.setTimeout(showTimeEasterEggOnce, 800);

function parseSchedule(text) {
  const days = new Map(dayOrder.map((day) => [day, []]));
  let currentDay = null;
  const lastLogicalStartByDay = new Map();

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const dayMatch = line.match(/^(?:#+\s*)?\*{0,2}(周[一二三四五六日])\*{0,2}/);
    if (dayMatch) {
      currentDay = dayMatch[1];
      if (!days.has(currentDay)) days.set(currentDay, []);
      continue;
    }

    if (!currentDay) continue;

    const itemMatch = line.match(/^(?:[-*]\s*)?(?:`)?(\d{1,2}:\d{2})(?:\s*[-–—至到]\s*(\d{1,2}:\d{2}))?(?:`)?\s*(.+)$/);
    if (!itemMatch) continue;

    const start = normalizeTime(itemMatch[1]);
    const end = itemMatch[2] ? normalizeTime(itemMatch[2]) : "";
    const activity = cleanActivity(itemMatch[3]);
    const rawStart = toMinutes(start);
    const rawEnd = end ? toMinutes(end) : rawStart;
    let logicalStart = rawStart;
    const previousStart = lastLogicalStartByDay.get(currentDay);

    if (previousStart !== undefined) {
      while (logicalStart + 180 < previousStart) logicalStart += 24 * 60;
    }

    let logicalEnd = end ? rawEnd : logicalStart + 20;
    while (logicalEnd <= logicalStart) logicalEnd += 24 * 60;

    const key = makeTaskKey(currentDay, start, end, activity);
    const state = readTaskState(key);
    const item = {
      id: `${currentDay}-${days.get(currentDay).length}`,
      key,
      day: currentDay,
      start,
      end,
      activity,
      minutes: end ? logicalEnd - logicalStart : 0,
      logicalStart,
      logicalEnd,
      category: state.category || inferCategory(activity),
      conflict: false,
    };
    item.completed = Boolean(state.completed);

    days.get(currentDay).push(item);
    lastLogicalStartByDay.set(currentDay, logicalStart);
  }

  annotateConflicts(days);
  annotatePointMarkers(days);
  return days;
}

function render() {
  const days = parseSchedule(source.value);
  currentItems = new Map([...days.values()].flat().map((item) => [item.id, item]));
  const activeDays = getActiveDays(days);
  renderSummary(days, activeDays);
  renderConflicts(days.conflicts || []);
  renderWeek(days, activeDays);
  return [...days.values()].flat().length;
}

function renderSummary(days, activeDays = dayOrder) {
  const flat = activeDays.flatMap((day) => days.get(day) || []);
  const completedTasks = flat.filter((item) => item.completed).length;
  const totalTasks = flat.length;
  const completion = totalTasks ? Math.round(completedTasks / totalTasks * 100) : 0;
  const totals = flat.reduce((result, item) => {
    if (!item.minutes) return result;
    if (item.category === uncategorizedLabel) return result;
    result.set(item.category, (result.get(item.category) || 0) + item.minutes);
    return result;
  }, new Map());
  const orderedTotals = [...totals.entries()]
    .filter(([, minutes]) => minutes > 0)
    .sort(([a], [b]) => categorySortIndex(a) - categorySortIndex(b) || a.localeCompare(b, "zh-Hans-CN"));

  const completionCard = `
    <article class="stat">
      <strong class="completion-value" data-completion="${completion}">${completion}%</strong>
      <span>完成率 ${completedTasks}/${totalTasks}</span>
    </article>
  `;
  summary.innerHTML = completionCard + (orderedTotals.map(([label, minutes]) => `
    <article class="stat">
      <strong>${formatDuration(minutes)}</strong>
      <span>${escapeHtml(label)} / ${viewMode === "today" ? "今日" : "周"}</span>
    </article>
  `).join("") || '<article class="stat"><strong>0分钟</strong><span>暂无分类时间</span></article>');
  animateCompletionValue(completion);
}

function animateCompletionValue(nextValue) {
  const valueElement = summary.querySelector(".completion-value");
  const fromValue = previousCompletion;
  previousCompletion = nextValue;
  if (!valueElement || fromValue === null || fromValue === nextValue) return;
  const settings = readEffectSettings();
  if (settings.motion === "off") return;
  valueElement.classList.remove("rolling");
  valueElement.innerHTML = `
    <span class="completion-roll-number completion-roll-old">${fromValue}%</span>
    <span class="completion-roll-number completion-roll-new">${nextValue}%</span>
  `;
  void valueElement.offsetWidth;
  valueElement.classList.add("rolling");
  window.setTimeout(() => {
    valueElement.textContent = `${nextValue}%`;
    valueElement.classList.remove("rolling");
  }, settings.motion === "normal" ? 460 : 260);
}

function renderConflicts(conflicts) {
  if (!conflicts.length) {
    conflictsPanel.classList.remove("show");
    conflictsPanel.innerHTML = "";
    return;
  }

  conflictsPanel.classList.add("show");
  conflictsPanel.innerHTML = `
    <strong>发现 ${conflicts.length} 处时间冲突</strong>
    <ul>
      ${conflicts.map((conflict) => `
        <li>${escapeHtml(conflict.day)}：${escapeHtml(formatRange(conflict.a))} ${escapeHtml(conflict.a.activity)} 和 ${escapeHtml(formatRange(conflict.b))} ${escapeHtml(conflict.b.activity)} 重叠</li>
      `).join("")}
    </ul>
  `;
}

function renderWeek(days, activeDays = dayOrder) {
  const flat = activeDays.flatMap((day) => days.get(day) || []);
  if (!flat.length) {
    week.innerHTML = '<div class="empty">没有识别到时间段。试试：- `8:30 - 9:00` 早餐</div>';
    return;
  }

  const firstItemStart = Math.floor(Math.min(...flat.map((item) => item.logicalStart)) / 60) * 60;
  const timelineStart = Math.min(7 * 60, firstItemStart);
  const timelineEnd = Math.ceil(Math.max(...flat.map((item) => item.logicalEnd)) / 60) * 60;
  const timelineMinutes = Math.max(60, timelineEnd - timelineStart);
  const hourMarks = [];

  for (let mark = timelineStart; mark <= timelineEnd; mark += 60) {
    hourMarks.push(mark);
  }
  const focus = getTimelineFocus(days);
  const sticker = themeTableSticker();

  week.innerHTML = `
    <div class="timeline-shell">
      <div class="table-sticker" aria-hidden="true">
        <span>${sticker.emoji}</span>
        <small>${escapeHtml(sticker.label)}</small>
      </div>
      <div class="timeline" style="--day-count: ${activeDays.length}; --timeline-height: calc(${timelineMinutes} * var(--hour-height) / 60);">
        <div class="timeline-header">
          <div class="corner">时间</div>
          ${activeDays.map((day) => {
            const items = days.get(day) || [];
            const dayTotal = items.reduce((total, item) => total + item.minutes, 0);
            const dayCompleted = items.filter((item) => item.completed).length;
            return `
              <header class="day-title">
                <h2>${day}</h2>
                <span>${dayCompleted}/${items.length} 完成<br>${formatDuration(dayTotal)}</span>
              </header>
            `;
          }).join("")}
        </div>
      <div class="timeline-body">
          <div class="time-axis">
            ${hourMarks.map((mark) => `
              <span class="axis-label" style="top: calc(${mark - timelineStart} * var(--hour-height) / 60);">${formatClock(mark)}</span>
            `).join("")}
          </div>
          ${activeDays.map((day) => `
            <section class="day-column" aria-label="${day}">
              ${(days.get(day) || []).map((item) => renderItem(item, timelineStart, focus)).join("")}
            </section>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderItem(item, timelineStart, focus = {}) {
  const time = item.end ? `${item.start} - ${item.end}` : item.start;
  const duration = item.minutes ? formatDuration(item.minutes) : "时间点";
  const visualMinutes = item.end ? item.minutes : 24;
  // Size is duration-based, so any future short task can become compact automatically.
  const sizeClass = item.end ? (visualMinutes <= 20 ? "tiny" : visualMinutes <= 35 ? "compact" : "") : "point";
  const pointClass = item.firstPoint ? "first-point" : item.pointRaised ? "point-raised" : "";
  const topOffset = item.firstPoint ? 0 : 3;
  const heightStyle = item.firstPoint ? "height: auto;" : `height: calc(${visualMinutes} * var(--hour-height) / 60 - 6px);`;
  const categoryClass = categoryClassName(item.category);
  const categoryColors = categoryColorsFor(item.category);
  const focusClass = item.id === focus.currentId ? "focus-current" : item.id === focus.nextId ? "focus-next" : "";
  return `
    <article
      class="item ${categoryClass} ${sizeClass} ${pointClass} ${focusClass} ${item.completed ? "completed" : ""} ${item.conflict ? "conflict" : ""}"
      role="button"
      tabindex="0"
      data-item-id="${escapeHtml(item.id)}"
      title="${escapeHtml(time)} ${escapeHtml(item.activity)}"
      style="top: calc(${item.logicalStart - timelineStart} * var(--hour-height) / 60 + ${topOffset}px); ${heightStyle} --item-bg: ${categoryColors[0]}; --item-accent: ${categoryColors[1]};"
    >
      <div class="time">
        <span>${escapeHtml(time)}</span>
        <span class="duration">${escapeHtml(duration)}</span>
      </div>
      <div class="activity">${escapeHtml(item.activity)}</div>
      ${item.category === uncategorizedLabel ? "" : `<span class="tag">${escapeHtml(item.category)}</span>`}
    </article>
  `;
}

function inferCategory(activity) {
  const match = commonCategories.find((category) => category.keywords?.test(activity));
  return match?.label || "生活";
}

function categoryClassName(categoryLabel) {
  return commonCategories.find((category) => category.label === categoryLabel)?.className || "custom";
}

function categoryColorsFor(categoryLabel) {
  const category = commonCategories.find((entry) => entry.label === categoryLabel);
  const themedColors = category ? activeThemePack().categoryPalette?.[category.className] : null;
  if (themedColors) return themedColors;
  if (category) return category.colors;
  return colorForCustomCategory(categoryLabel);
}

function categorySortIndex(categoryLabel) {
  const index = commonCategories.findIndex((category) => category.label === categoryLabel);
  return index === -1 ? commonCategories.length + 1 : index;
}

function colorForCustomCategory(label) {
  const palettes = [
    ["#eaf2d9", "#b7c97b"],
    ["#f4e2ee", "#c27aa7"],
    ["#dff0f6", "#78b2c7"],
    ["#f4ead9", "#c7a46f"],
    ["#e9e4f4", "#9580c6"],
    ["#e4f1e3", "#78b97e"],
  ];
  let hash = 0;
  for (const char of label) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return palettes[hash % palettes.length];
}

function stableIndex(seed, length) {
  if (!length) return 0;
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % length;
}

function themeTableSticker() {
  const stickers = {
    default: [
      { emoji: "✓", label: "今日记录" },
      { emoji: "✦", label: "手账贴纸" },
      { emoji: "⌁", label: "计划角标" },
    ],
    "snow-lotus": [
      { emoji: "⭐", label: "星轨记录" },
      { emoji: "✦", label: "微雪贴纸" },
      { emoji: "☾", label: "月光便签" },
    ],
    "ace-taffy": [
      { emoji: "💗", label: "甜度补给" },
      { emoji: "♡", label: "心动便签" },
      { emoji: "✧", label: "糖霜贴纸" },
    ],
    "diana-jiaran": [
      { emoji: "🍓", label: "草莓营业" },
      { emoji: "✦", label: "甜品角标" },
      { emoji: "♪", label: "舞台便签" },
    ],
  };
  const pool = stickers[currentTheme] || stickers.default;
  const dateKey = new Date().toISOString().slice(0, 10);
  return pool[stableIndex(`${currentTheme}:${dateKey}`, pool.length)];
}

function getAvailableCategoryLabels() {
  const labels = new Set(commonCategories.map((category) => category.label));
  const allState = readAllTaskState();
  Object.values(allState).forEach((state) => {
    if (state?.category) labels.add(state.category);
  });
  currentItems.forEach((item) => {
    if (item.category) labels.add(item.category);
  });
  return [...labels].sort((a, b) => categorySortIndex(a) - categorySortIndex(b) || a.localeCompare(b, "zh-Hans-CN"));
}

function annotateConflicts(days) {
  const conflicts = [];

  for (const day of dayOrder) {
    const timedItems = (days.get(day) || []).filter((item) => item.end);
    for (let i = 0; i < timedItems.length; i += 1) {
      for (let j = i + 1; j < timedItems.length; j += 1) {
        const a = timedItems[i];
        const b = timedItems[j];
        if (a.logicalStart < b.logicalEnd && b.logicalStart < a.logicalEnd) {
          a.conflict = true;
          b.conflict = true;
          conflicts.push({ day, a, b });
        }
      }
    }
  }

  days.conflicts = conflicts;
  return conflicts;
}

function annotatePointMarkers(days) {
  for (const day of dayOrder) {
    const items = days.get(day) || [];
    const rangedStarts = new Set(items.filter((item) => item.end).map((item) => item.logicalStart));
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      item.firstPoint = Boolean(index === 0 && !item.end);
      item.pointRaised = Boolean(!item.end && !item.firstPoint && rangedStarts.has(item.logicalStart));
    }
  }
}









function renderSourceWarnings() {
  if (!sourceWarnings) return [];
  const warnings = validateScheduleText(source.value);
  sourceWarnings.classList.toggle("show", warnings.length > 0);
  sourceWarnings.innerHTML = warnings.length
    ? `<strong>导入检查发现 ${warnings.length} 个提示</strong><ul>${warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}</ul>`
    : "";
  return warnings;
}



function readAllTaskState() {
  try {
    return JSON.parse(localStorage.getItem(taskStateStoreKey) || "{}");
  } catch {
    return {};
  }
}

function writeAllTaskState(state) {
  localStorage.setItem(taskStateStoreKey, JSON.stringify(state));
}

function readTaskState(key) {
  const allState = readAllTaskState();
  return allState[key] || { completed: false, subtasks: [], category: "" };
}

function updateTaskState(key, updater) {
  const allState = readAllTaskState();
  const current = allState[key] || { completed: false, subtasks: [], category: "" };
  allState[key] = updater({
    completed: Boolean(current.completed),
    subtasks: Array.isArray(current.subtasks) ? current.subtasks : [],
    category: typeof current.category === "string" ? current.category : "",
  });
  writeAllTaskState(allState);
  return allState[key];
}

function debounce(fn, delay) {
  let timer = 0;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}

function getTodayLabel() {
  const index = new Date().getDay();
  return ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][index];
}

function getCurrentLogicalMinute(now = new Date()) {
  return now.getHours() * 60 + now.getMinutes();
}

function getTimelineFocus(days, now = new Date()) {
  const today = getTodayLabel();
  const nowMinute = getCurrentLogicalMinute(now);
  const items = (days.get(today) || [])
    .filter((item) => !item.completed)
    .sort((a, b) => a.logicalStart - b.logicalStart || a.logicalEnd - b.logicalEnd);
  const current = items.find((item) => item.end && item.logicalStart <= nowMinute && nowMinute < item.logicalEnd);
  if (current) return { currentId: current.id, nextId: "" };
  const next = items.find((item) => item.logicalStart >= nowMinute);
  return { currentId: "", nextId: next?.id || "" };
}

function isMobileViewport() {
  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(max-width: 680px)").matches;
  }
  return Number(window.innerWidth || 1024) <= 680;
}

function setViewMode(mode) {
  const nextMode = mode === "today" ? "today" : "week";
  if (nextMode === viewMode) return;
  viewMode = nextMode;
  render();
  updateViewToggleButton();
  triggerViewModeMotion(nextMode);
}

function getActiveDays(days) {
  if (viewMode !== "today") return dayOrder;
  const today = getTodayLabel();
  return days.has(today) ? [today] : [today];
}

function updateMobileNavState() {
  if (!mobileTodayButton || !mobileWeekButton) return;
  setMobileNavIndex(viewMode === "today" ? 0 : 1);
  mobileTodayButton.classList.toggle("active", viewMode === "today");
  mobileWeekButton.classList.toggle("active", viewMode === "week");
  mobileThemeButton?.classList.remove("active");
  mobileImportButton?.classList.remove("active");
  mobileExportButton?.classList.remove("active");
  mobileTodayButton.setAttribute("aria-pressed", String(viewMode === "today"));
  mobileWeekButton.setAttribute("aria-pressed", String(viewMode === "week"));
}

function setMobileNavIndex(index) {
  const toolbar = mobileTodayButton?.closest?.(".mobile-toolbar");
  if (!toolbar) return;
  toolbar.style.setProperty("--mobile-active-index", String(index));
  [mobileTodayButton, mobileWeekButton, mobileThemeButton, mobileImportButton, mobileExportButton].forEach((button, buttonIndex) => {
    button?.classList.toggle("active", buttonIndex === index);
    button?.setAttribute("aria-pressed", String(buttonIndex === index));
  });
}

function updateViewToggleButton() {
  const button = document.querySelector("#viewToggleButton");
  button.textContent = viewMode === "week" ? "今" : "周";
  button.title = viewMode === "week" ? "切换到今日视图" : "切换到周视图";
  button.setAttribute("aria-label", button.title);
  updateMobileNavState();
}

function triggerViewModeMotion(mode) {
  const settings = readEffectSettings();
  if (settings.motion === "off" || !isMobileViewport()) return;
  week.classList.remove("view-slide-today", "view-slide-week");
  const motionClass = mode === "today" ? "view-slide-today" : "view-slide-week";
  week.classList.add(motionClass);
  window.setTimeout(() => week.classList.remove(motionClass), settings.motion === "normal" ? 340 : 220);
}

function readTheme() {
  const saved = localStorage.getItem(themeStoreKey) || "default";
  return appThemes.some((theme) => theme.id === saved) ? saved : "default";
}

function activeThemePack() {
  return themePacks[currentTheme] || themePacks.default;
}

function activeThemeBackgroundSet() {
  return activeThemePack().backgrounds || themePacks["snow-lotus"].backgrounds;
}

function readEffectSettings() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(effectStoreKey) || "{}");
  } catch {
    saved = {};
  }
  const motion = ["normal", "reduced", "off"].includes(saved.motion) ? saved.motion : defaultEffectSettings.motion;
  const sound = typeof saved.sound === "boolean" ? saved.sound : defaultEffectSettings.sound;
  return { motion, sound };
}

function writeEffectSettings(settings) {
  localStorage.setItem(effectStoreKey, JSON.stringify(settings));
}

function applyEffectSettings(settings) {
  document.body.dataset.effects = settings.motion;
  document.body.dataset.sound = settings.sound ? "on" : "off";
  if (motionEffectSelect) motionEffectSelect.value = settings.motion;
  if (soundEffectToggle) soundEffectToggle.checked = settings.sound;
}


function backgroundOptionsForTarget(target) {
  const set = activeThemeBackgroundSet();
  return target === "page" ? set.pageOptions : set.tableOptions;
}

function backgroundAssetById(target, id) {
  const options = backgroundOptionsForTarget(target);
  return options.find((asset) => asset.id === id) || options[0];
}


function readThemeBackgrounds() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(themeBackgroundStoreKey) || "{}");
  } catch {
    saved = {};
  }
  const defaults = activeThemeBackgroundSet().defaults;
  const page = backgroundAssetById("page", saved.page || defaults.page).id;
  const table = backgroundAssetById("table", saved.table || defaults.table).id;
  const pageOpacity = clampPercent(saved.pageOpacity, defaults.pageOpacity);
  const tableOpacity = clampPercent(saved.tableOpacity, defaults.tableOpacity);
  const taskOpacity = clampPercent(saved.taskOpacity, defaults.taskOpacity, 85);
  const panelOpacity = clampPercent(saved.panelOpacity, defaults.panelOpacity);
  return { page, table, pageOpacity, tableOpacity, taskOpacity, panelOpacity };
}

function writeThemeBackgrounds(backgrounds) {
  localStorage.setItem(themeBackgroundStoreKey, JSON.stringify(backgrounds));
}


function applyThemeBackgrounds() {
  const backgrounds = readThemeBackgrounds();
  const page = backgroundAssetById("page", backgrounds.page);
  const table = backgroundAssetById("table", backgrounds.table);
  document.body.style.setProperty("--snow-page-bg", cssUrl(page.image));
  document.body.style.setProperty("--snow-table-bg", cssUrl(table.image));
  document.body.style.setProperty("--snow-table-bg-size", table.fit || "cover");
  document.body.style.setProperty("--snow-page-opacity", String(backgrounds.pageOpacity / 100));
  document.body.style.setProperty("--snow-table-opacity", String(backgrounds.tableOpacity / 100));
  document.body.style.setProperty("--snow-task-surface-opacity", String((100 - backgrounds.taskOpacity) / 100));
  document.body.style.setProperty("--theme-panel-opacity", String((100 - backgrounds.panelOpacity) / 100));
  document.body.dataset.tableTone = table.tone || "light";
}

function applyThemeBadge(theme) {
  const badge = theme.badge || appThemes[0].badge;
  if (themeBadgeImage) themeBadgeImage.src = badge.image;
  if (themeBadgeText) themeBadgeText.textContent = badge.label;
}

function applyTheme(themeId, options = {}) {
  const { persist = true, rerender = true } = options;
  const theme = appThemes.find((entry) => entry.id === themeId) || appThemes[0];
  currentTheme = theme.id;
  if (theme.id === "default") document.body.removeAttribute("data-theme");
  else document.body.dataset.theme = theme.id;
  applyThemeBadge(theme);
  applyThemeBackgrounds();
  if (metaThemeColor) metaThemeColor.setAttribute("content", theme.metaColor);
  if (persist) localStorage.setItem(themeStoreKey, theme.id);
  renderThemeOptions();
  if (rerender) render();
}

function renderThemeOptions() {
  if (!themeOptions) return;
  const backgrounds = readThemeBackgrounds();
  if (panelOpacity) panelOpacity.value = backgrounds.panelOpacity;
  if (panelOpacityValue) panelOpacityValue.textContent = `${backgrounds.panelOpacity}%`;
  themeOptions.innerHTML = appThemes.map((theme) => `
    <div class="theme-card ${theme.id === currentTheme ? "active" : ""}">
      <button
        class="theme-select"
        type="button"
        data-theme-id="${escapeHtml(theme.id)}"
        data-theme-name="${escapeHtml(theme.name)}"
        aria-pressed="${theme.id === currentTheme}"
      >
        <span class="theme-preview" aria-hidden="true">
          ${theme.colors.map((color) => `<span style="background: ${escapeHtml(color)}"></span>`).join("")}
        </span>
        <strong>${escapeHtml(theme.name)}</strong>
        <small>${escapeHtml(theme.description)}</small>
      </button>
      ${theme.configurableBackgrounds ? `
        <button
          class="theme-portrait-button"
          type="button"
          data-bg-theme-id="${escapeHtml(theme.id)}"
          title="设置${escapeHtml(theme.name)}背景"
          aria-label="设置${escapeHtml(theme.name)}背景"
        >
          <img src="${escapeHtml(theme.image)}" alt="">
        </button>
      ` : ""}
    </div>
  `).join("");
}

function renderBackgroundOptions() {
  const backgrounds = readThemeBackgrounds();
  pageBackgroundOpacity.value = backgrounds.pageOpacity;
  tableBackgroundOpacity.value = backgrounds.tableOpacity;
  taskBlockOpacity.value = backgrounds.taskOpacity;
  pageBackgroundOpacityValue.textContent = `${backgrounds.pageOpacity}%`;
  tableBackgroundOpacityValue.textContent = `${backgrounds.tableOpacity}%`;
  taskBlockOpacityValue.textContent = `${backgrounds.taskOpacity}%`;
  const renderGroup = (target) => backgroundOptionsForTarget(target).map((asset) => `
    <button
      class="background-choice ${backgrounds[target] === asset.id ? "active" : ""}"
      type="button"
      data-background-target="${escapeHtml(target)}"
      data-background-id="${escapeHtml(asset.id)}"
      aria-pressed="${backgrounds[target] === asset.id}"
    >
      <img class="background-thumb" src="${escapeHtml(asset.image)}" alt="">
      <span>${escapeHtml(asset.name)}</span>
    </button>
  `).join("");
  pageBackgroundOptions.innerHTML = renderGroup("page");
  tableBackgroundOptions.innerHTML = renderGroup("table");
}

function selectThemeBackground(target, backgroundId) {
  if (!["page", "table"].includes(target)) return;
  const asset = backgroundAssetById(target, backgroundId);
  const backgrounds = readThemeBackgrounds();
  backgrounds[target] = asset.id;
  writeThemeBackgrounds(backgrounds);
  applyThemeBackgrounds();
  renderBackgroundOptions();
  showToast(`${target === "page" ? "网页" : "表格"}背景已切换：${asset.name}`);
}

function selectThemeBackgroundOpacity(target, value) {
  if (!["pageOpacity", "tableOpacity", "taskOpacity", "panelOpacity"].includes(target)) return;
  const backgrounds = readThemeBackgrounds();
  const defaults = activeThemeBackgroundSet().defaults;
  backgrounds[target] = clampPercent(value, defaults[target], target === "taskOpacity" ? 85 : 100);
  writeThemeBackgrounds(backgrounds);
  applyThemeBackgrounds();
  if (target === "pageOpacity") pageBackgroundOpacityValue.textContent = `${backgrounds[target]}%`;
  else if (target === "tableOpacity") tableBackgroundOpacityValue.textContent = `${backgrounds[target]}%`;
  else if (target === "taskOpacity") taskBlockOpacityValue.textContent = `${backgrounds[target]}%`;
  else panelOpacityValue.textContent = `${backgrounds[target]}%`;
}

function readTemplates() {
  try {
    return JSON.parse(localStorage.getItem(templateStoreKey) || "{}");
  } catch {
    return {};
  }
}

function writeTemplates(templates) {
  localStorage.setItem(templateStoreKey, JSON.stringify(templates));
}

function renderTemplateOptions() {
  const templates = readTemplates();
  const names = Object.keys(templates).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  templateSelect.innerHTML = names.length
    ? names.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")
    : '<option value="">还没有模板</option>';
  document.querySelector("#loadTemplateButton").disabled = !names.length;
  document.querySelector("#deleteTemplateButton").disabled = !names.length;
}

async function exportPdf() {
  try {
    const days = parseSchedule(source.value);
    const activeDays = getActiveDays(days);
    renderSummary(days, activeDays);
    renderConflicts(days.conflicts || []);
    renderWeek(days, activeDays);

    const flat = activeDays.flatMap((day) => days.get(day) || []);
    if (!flat.length) {
      showToast("没有可导出的表格，请先生成时间表");
      return;
    }

    showToast("正在生成 PDF，稍等一下");
    const exportCanvas = drawExportCanvas(days, activeDays);
    const pdfBlob = makePdfFromCanvas(exportCanvas.canvas, exportCanvas.width, exportCanvas.height);
    const today = new Date().toISOString().slice(0, 10);
    downloadBlob(pdfBlob, `weekly-timetable-${today}.pdf`);
    showToast("PDF 已开始下载");
  } catch (error) {
    console.error(error);
    showToast("PDF 生成失败，可以刷新页面后再试一次");
  } finally {
    updateMobileNavState();
  }
}

function drawExportCanvas(days, activeDays = dayOrder) {
  const flat = activeDays.flatMap((day) => days.get(day) || []);
  const firstItemStart = Math.floor(Math.min(...flat.map((item) => item.logicalStart)) / 60) * 60;
  const timelineStart = Math.min(7 * 60, firstItemStart);
  const timelineEnd = Math.ceil(Math.max(...flat.map((item) => item.logicalEnd)) / 60) * 60;
  const timelineMinutes = Math.max(60, timelineEnd - timelineStart);
  const scale = 2;
  const axisWidth = 94;
  const dayWidth = 222;
  const headerHeight = 68;
  const hourHeight = 92;
  const padding = 18;
  const width = axisWidth + dayWidth * activeDays.length + padding * 2;
  const height = headerHeight + timelineMinutes * hourHeight / 60 + padding * 2;
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  const exportColors = activeThemePack().exportColors;
  const themedExport = Boolean(exportColors);

  ctx.fillStyle = themedExport ? exportColors.paper : "#fffaf0";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = themedExport ? exportColors.panel : "#fffdf7";
  roundRect(ctx, padding, padding, width - padding * 2, height - padding * 2, 8);
  ctx.fill();
  ctx.strokeStyle = themedExport ? exportColors.line : "#dfd5c4";
  ctx.stroke();

  const left = padding;
  const top = padding;
  const bodyTop = top + headerHeight;
  const bodyHeight = height - padding * 2 - headerHeight;

  ctx.fillStyle = themedExport ? exportColors.header : "#f9efdc";
  ctx.fillRect(left, top, width - padding * 2, headerHeight);
  ctx.strokeStyle = themedExport ? exportColors.line : "#dfd5c4";
  ctx.beginPath();
  ctx.moveTo(left, bodyTop);
  ctx.lineTo(width - padding, bodyTop);
  ctx.stroke();

  ctx.fillStyle = themedExport ? exportColors.muted : "#6a665f";
  ctx.font = "14px Microsoft YaHei UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("时间", left + axisWidth / 2, top + headerHeight / 2);

  for (let i = 0; i < activeDays.length; i += 1) {
    const x = left + axisWidth + i * dayWidth;
    ctx.strokeStyle = themedExport ? exportColors.line : "#dfd5c4";
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, height - padding);
    ctx.stroke();

    ctx.fillStyle = themedExport ? exportColors.ink : "#252525";
    ctx.font = "bold 20px Microsoft YaHei UI, sans-serif";
    ctx.fillText(activeDays[i], x + dayWidth / 2, top + headerHeight / 2);
  }

  ctx.beginPath();
  ctx.moveTo(left + axisWidth + dayWidth * activeDays.length, top);
  ctx.lineTo(left + axisWidth + dayWidth * activeDays.length, height - padding);
  ctx.stroke();

  for (let mark = timelineStart; mark <= timelineEnd; mark += 60) {
    const y = bodyTop + (mark - timelineStart) * hourHeight / 60;
    ctx.strokeStyle = "rgba(118, 104, 83, 0.2)";
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();

    ctx.fillStyle = themedExport ? exportColors.muted : "#6a665f";
    ctx.font = "13px Cascadia Mono, Consolas, monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(formatClock(mark), left + axisWidth - 11, y);
  }

  for (let dayIndex = 0; dayIndex < activeDays.length; dayIndex += 1) {
    const day = activeDays[dayIndex];
    const x = left + axisWidth + dayIndex * dayWidth;
    const dayItems = days.get(day) || [];
    for (const item of dayItems.filter((entry) => entry.end)) {
      drawCanvasItem(ctx, item, x + 8, bodyTop, dayWidth - 16, hourHeight, timelineStart);
    }
    for (const item of dayItems.filter((entry) => !entry.end)) {
      drawCanvasItem(ctx, item, x + 8, bodyTop, dayWidth - 16, hourHeight, timelineStart);
    }
  }

  return { canvas, width, height };
}

function drawCanvasItem(ctx, item, x, bodyTop, width, hourHeight, timelineStart) {
  const visualMinutes = item.end ? item.minutes : 24;
  if (!item.end) {
    width = item.firstPoint ? Math.min(96, width) : Math.min(64, width);
  }
  let height = Math.max(visualMinutes * hourHeight / 60 - 8, item.end ? 28 : 36);
  if (item.firstPoint) {
    height = Math.max(42, estimateCanvasTextHeight(item.activity, width - 22, "13px Microsoft YaHei UI, sans-serif", 16) + 27);
  }
  const baseY = bodyTop + (item.logicalStart - timelineStart) * hourHeight / 60;
  const y = item.firstPoint ? baseY - height - 8 : baseY + (item.pointRaised ? -20 : 4);
  const palette = categoryColorsFor(item.category);
  ctx.globalAlpha = item.completed ? 0.58 : 1;

  ctx.fillStyle = palette[0];
  roundRect(ctx, x, y, width, height, 7);
  ctx.fill();
  ctx.fillStyle = palette[1];
  roundRect(ctx, x, y, 6, height, 4);
  ctx.fill();
  ctx.strokeStyle = item.conflict ? "rgba(198, 83, 56, 0.88)" : "rgba(37, 37, 37, 0.08)";
  ctx.lineWidth = item.conflict ? 2 : 1;
  roundRect(ctx, x, y, width, height, 7);
  ctx.stroke();
  ctx.lineWidth = 1;

  const textX = x + 14;
  const maxTextWidth = width - 22;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#4d473f";
  ctx.font = "12px Cascadia Mono, Consolas, monospace";

  if (item.end && height > 32) {
    ctx.fillText(`${item.start} - ${item.end}`, textX, y + 7);
    ctx.fillStyle = "#252525";
    ctx.font = "14px Microsoft YaHei UI, sans-serif";
    wrapCanvasText(ctx, item.activity, textX, y + 27, maxTextWidth, 18, Math.max(1, Math.floor((height - 34) / 18)));
  } else if (item.end) {
    ctx.fillStyle = "#252525";
    ctx.font = "12px Microsoft YaHei UI, sans-serif";
    wrapCanvasText(ctx, item.activity, textX, y + 6, maxTextWidth, 15, 1);
  } else {
    ctx.fillText(item.start, textX, y + 6);
    ctx.fillStyle = "#252525";
    ctx.font = "13px Microsoft YaHei UI, sans-serif";
    wrapCanvasText(ctx, item.activity, textX, y + 21, maxTextWidth, 16, item.firstPoint ? 3 : 1);
  }

  if (item.completed) {
    ctx.strokeStyle = "#2f6f73";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(textX, y + Math.min(height - 12, 42));
    ctx.lineTo(x + width - 10, y + Math.min(height - 12, 42));
    ctx.stroke();
    ctx.lineWidth = 1;
  }

  if (item.end && height > 62 && item.category !== uncategorizedLabel) {
    const label = item.category;
    ctx.font = "11px Microsoft YaHei UI, sans-serif";
    const labelWidth = ctx.measureText(label).width + 16;
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    roundRect(ctx, textX, y + height - 24, labelWidth, 18, 9);
    ctx.fill();
    ctx.strokeStyle = "rgba(37, 37, 37, 0.14)";
    ctx.stroke();
    ctx.fillStyle = "#484136";
    ctx.fillText(label, textX + 8, y + height - 21);
  }
  ctx.globalAlpha = 1;
}

function makePdfFromCanvas(canvas, width, height) {
  const dataUrl = canvas.toDataURL("image/jpeg", 0.94);
  const jpegBytes = base64ToBytes(dataUrl.split(",")[1]);
  const pageWidth = width * 0.72;
  const pageHeight = height * 0.72;
  const imageWidth = canvas.width;
  const imageHeight = canvas.height;
  const content = `q\n${pageWidth.toFixed(2)} 0 0 ${pageHeight.toFixed(2)} 0 0 cm\n/Im0 Do\nQ\n`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`,
    `<< /Length ${byteLength(content)} >>\nstream\n${content}endstream`,
    {
      prefix: `<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`,
      bytes: jpegBytes,
      suffix: "\nendstream",
    },
  ];

  return buildPdf(objects);
}

function buildPdf(objects) {
  const encoder = new TextEncoder();
  const parts = [];
  const offsets = [0];
  let position = 0;

  const addString = (value) => {
    const bytes = encoder.encode(value);
    parts.push(bytes);
    position += bytes.length;
  };

  const addBytes = (bytes) => {
    parts.push(bytes);
    position += bytes.length;
  };

  addString("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");

  objects.forEach((object, index) => {
    offsets.push(position);
    addString(`${index + 1} 0 obj\n`);
    if (typeof object === "string") {
      addString(`${object}\n`);
    } else {
      addString(object.prefix);
      addBytes(object.bytes);
      addString(object.suffix + "\n");
    }
    addString("endobj\n");
  });

  const xrefPosition = position;
  addString(`xref\n0 ${objects.length + 1}\n`);
  addString("0000000000 65535 f \n");
  for (let i = 1; i < offsets.length; i += 1) {
    addString(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  }
  addString(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPosition}\n%%EOF`);

  return new Blob(parts, { type: "application/pdf" });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}



function estimateCanvasTextHeight(text, maxWidth, font, lineHeight) {
  const canvas = estimateCanvasTextHeight.canvas || (estimateCanvasTextHeight.canvas = document.createElement("canvas"));
  const ctx = canvas.getContext("2d");
  ctx.font = font;
  const characters = Array.from(text);
  let line = "";
  let lines = 1;

  for (const character of characters) {
    const testLine = line + character;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines += 1;
      line = character;
    } else {
      line = testLine;
    }
  }

  return lines * lineHeight;
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const characters = Array.from(text);
  let line = "";
  let lines = 0;

  for (let i = 0; i < characters.length; i += 1) {
    const testLine = line + characters[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      const hasMore = lines + 1 >= maxLines;
      ctx.fillText(hasMore ? trimToWidth(ctx, line + "…", maxWidth) : line, x, y + lines * lineHeight);
      lines += 1;
      line = characters[i];
      if (hasMore) return;
    } else {
      line = testLine;
    }
  }

  if (line && lines < maxLines) {
    ctx.fillText(trimToWidth(ctx, line, maxWidth), x, y + lines * lineHeight);
  }
}

function trimToWidth(ctx, text, maxWidth) {
  let result = text;
  while (result.length > 1 && ctx.measureText(result).width > maxWidth) {
    result = result.slice(0, -2) + "…";
  }
  return result;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function timeEasterEggSlot(now = new Date()) {
  const hour = now.getHours();
  if (hour >= 0 && hour < 5) return "midnight";
  if (hour >= 5 && hour < 9) return "morning";
  if (hour >= 12 && hour < 14) return "noon";
  if (hour >= 22) return "late";
  if (hour >= 18) return "evening";
  return "";
}

function timeEasterEggMessage(slot) {
  const messages = {
    default: {
      midnight: "夜间计划模式：别忘了给明天留一点余量",
      morning: "早安，今日副本已刷新",
      noon: "中场补给时间，下午继续稳稳推进",
      evening: "晚上好，适合收束今天的进度",
      late: "深夜时段开启，记得保护睡眠条",
    },
    "snow-lotus": {
      midnight: "星夜记录开启，今晚也要轻一点",
      morning: "晨光落在时间轴上，今日开始",
      noon: "午间星轨校准，慢慢来",
      evening: "蓝白暮色已到，适合复盘一下",
      late: "夜航模式启动，别把自己排太满",
    },
    "ace-taffy": {
      midnight: "夜间软糖补给：该休息也算完成",
      morning: "粉色早安，今天也轻轻启动",
      noon: "午间甜度恢复中，下午继续",
      evening: "晚间心动时间，收个漂亮尾",
      late: "深夜爱心提醒：睡觉也是计划的一部分",
    },
    "diana-jiaran": {
      midnight: "草莓夜巡中，别把明天的甜度透支啦",
      morning: "早安，草莓日程开始营业",
      noon: "午间补糖完成，下午稳住",
      evening: "晚间甜品时间，给今天做个收尾",
      late: "深夜草莓提醒：休息窗口也很珍贵",
    },
  };
  return messages[currentTheme]?.[slot] || messages.default[slot];
}

function showTimeEasterEggOnce(now = new Date()) {
  const slot = timeEasterEggSlot(now);
  if (!slot) return;
  const dateKey = now.toISOString().slice(0, 10);
  const key = `${dateKey}:${currentTheme}:${slot}`;
  if (localStorage.getItem(timeEggStoreKey) === key) return;
  localStorage.setItem(timeEggStoreKey, key);
  const message = timeEasterEggMessage(slot);
  collectEasterEgg("time", { theme: currentTheme, slot, message });
  showToast(message);
}

function handleThemeBadgeSecretTap() {
  secretTapCount += 1;
  themeBadge?.classList.add("secret-tap");
  window.setTimeout(() => themeBadge?.classList.remove("secret-tap"), 160);
  window.clearTimeout(secretTapTimer);
  secretTapTimer = window.setTimeout(() => {
    secretTapCount = 0;
  }, 1400);
  if (secretTapCount === 5) showToast("再点两下，像是在敲隐藏门");
  if (secretTapCount < 7) return;
  secretTapCount = 0;
  window.clearTimeout(secretTapTimer);
  openSecret();
}

function secretThemeEmoji() {
  if (currentTheme === "snow-lotus") return "⭐";
  if (currentTheme === "ace-taffy") return "💗";
  if (currentTheme === "diana-jiaran") return "🍓";
  return "✓";
}

function defaultCollection() {
  return { rare: [], time: [], doors: [], stamps: {} };
}

function readCollection() {
  try {
    return { ...defaultCollection(), ...JSON.parse(localStorage.getItem(collectionStoreKey) || "{}") };
  } catch {
    return defaultCollection();
  }
}

function writeCollection(collection) {
  localStorage.setItem(collectionStoreKey, JSON.stringify(collection));
}

function collectionKey(entry) {
  return [entry.theme, entry.slot || "", entry.message || ""].join("|");
}

function collectEasterEgg(type, entry = {}) {
  const collection = readCollection();
  const record = {
    theme: entry.theme || currentTheme,
    message: entry.message || "",
    slot: entry.slot || "",
    date: new Date().toISOString().slice(0, 10),
  };
  if (type === "stamp") {
    const key = record.theme;
    const current = collection.stamps[key] || { count: 0, emoji: secretThemeEmoji(), theme: key };
    collection.stamps[key] = { ...current, count: current.count + 1, emoji: secretThemeEmoji(), theme: key };
  } else if (type === "door") {
    const exists = collection.doors.some((item) => item.theme === record.theme);
    if (!exists) collection.doors.unshift(record);
  } else {
    const list = collection[type] || [];
    const key = collectionKey(record);
    if (!list.some((item) => collectionKey(item) === key)) list.unshift(record);
    collection[type] = list.slice(0, 24);
  }
  writeCollection(collection);
}

function renderCollectionList(items, emptyText) {
  if (!items.length) return `<li>${emptyText}</li>`;
  return items.slice(0, 5).map((item) => `
    <li>
      <strong>${escapeHtml(themeLabel(item.theme))}</strong>
      <span>${escapeHtml(item.message || item.slot || item.date)}</span>
    </li>
  `).join("");
}

function themeLabel(themeId) {
  return appThemes.find((theme) => theme.id === themeId)?.name || "默认主题";
}

function renderSecretBody() {
  if (!secretBody) return;
  const pack = activeThemePack();
  const totalItems = currentItems.size;
  const completedItems = [...currentItems.values()].filter((item) => item.completed).length;
  const rareCount = pack.easterEggs?.rare?.length || 0;
  const themeName = themeBadgeText?.textContent || "默认手账";
  const collection = readCollection();
  const stampRows = Object.values(collection.stamps || {})
    .sort((a, b) => b.count - a.count)
    .map((item) => `<li><strong>${item.emoji} ${escapeHtml(themeLabel(item.theme))}</strong><span>${item.count} 枚完成徽章</span></li>`)
    .join("") || "<li>还没有收集到完成徽章</li>";
  secretBody.innerHTML = `
    <section class="secret-card">
      <div class="secret-mark">${secretThemeEmoji()}</div>
      <h3>${escapeHtml(themeName)} 暗门已打开</h3>
      <p>这里先放一块小型彩蛋面板，后面可以继续接成就、隐藏背景、语音彩蛋和稀有记录。</p>
      <ul class="secret-list">
        <li>当前计划：${completedItems}/${totalItems} 个任务已完成</li>
        <li>稀有语句池：当前主题有 ${rareCount} 条隐藏台词</li>
        <li>暗门入口：连续点击顶部主题徽章 7 次</li>
      </ul>
      <div class="collection-grid">
        <section class="collection-panel">
          <h4>稀有语句收藏</h4>
          <ul class="secret-list">${renderCollectionList(collection.rare || [], "还没有抽到稀有语句")}</ul>
        </section>
        <section class="collection-panel">
          <h4>时间彩蛋记录</h4>
          <ul class="secret-list">${renderCollectionList(collection.time || [], "还没有触发时间彩蛋")}</ul>
        </section>
        <section class="collection-panel">
          <h4>完成印章收藏</h4>
          <ul class="secret-list">${stampRows}</ul>
        </section>
      </div>
    </section>
  `;
}

function openSecret() {
  collectEasterEgg("door", { theme: currentTheme, message: `${themeBadgeText?.textContent || "主题"} 暗门` });
  renderSecretBody();
  secretModal?.classList.add("show");
  secretModal?.setAttribute("aria-hidden", "false");
  document.querySelector("#closeSecretButton")?.focus();
}

function closeSecret() {
  secretModal?.classList.remove("show");
  secretModal?.setAttribute("aria-hidden", "true");
  updateMobileNavState();
}

function startLongPress(event) {
  const itemElement = event.target.closest(".item");
  if (!itemElement) return;
  pressingElement = itemElement;
  itemElement.classList.add("long-pressing", "press-active");
  window.clearTimeout(pressTimer);
  pressTimer = window.setTimeout(() => {
    const item = currentItems.get(itemElement.dataset.itemId);
    if (!item) return;
    toggleTaskCompleted(item);
    suppressNextClick = true;
    itemElement.classList.remove("long-pressing", "press-active");
    pressingElement = null;
  }, 1000);
}

function cancelLongPress() {
  window.clearTimeout(pressTimer);
  if (pressingElement) pressingElement.classList.remove("long-pressing", "press-active");
  pressingElement = null;
}

function toggleTaskCompleted(item) {
  const nextState = updateTaskState(item.key, (state) => ({
    ...state,
    completed: !state.completed,
  }));
  item.completed = nextState.completed;
  const element = document.querySelector(`[data-item-id="${cssEscape(item.id)}"]`);
  if (element) {
    element.classList.toggle("completed", item.completed);
    triggerStatusEffect(element, item.completed);
    if (item.completed) triggerCompletionStamp(element);
  }
  playThemeEffectSound(item.completed);
  const refreshed = refreshCurrentView(item.id);
  const refreshedItem = refreshed.item || item;
  const refreshedElement = document.querySelector(`[data-item-id="${cssEscape(item.id)}"]`);
  if (refreshedElement) {
    triggerStatusEffect(refreshedElement, item.completed);
    if (item.completed) triggerCompletionStamp(refreshedElement);
  }
  if (item.completed) collectEasterEgg("stamp", { theme: currentTheme });
  if (activeTaskId === item.id) renderTaskDetail(refreshedItem);
  showToast(themeEasterEggMessage(refreshedItem, item.completed, refreshed.days));
}

function triggerStatusEffect(element, completed = false) {
  const settings = readEffectSettings();
  if (settings.motion === "off") return;
  const className = completed ? "status-complete" : "status-pulse";
  element.classList.remove("status-pulse", "status-complete");
  void element.offsetWidth;
  element.classList.add(className);
  window.setTimeout(() => element.classList.remove(className), settings.motion === "normal" ? 700 : 360);
}

function completionStampText() {
  if (currentTheme === "snow-lotus") return "⭐";
  if (currentTheme === "ace-taffy") return "💗";
  if (currentTheme === "diana-jiaran") return "🍓";
  return "✓";
}

function triggerCompletionStamp(element) {
  const settings = readEffectSettings();
  if (settings.motion === "off") return;
  element.querySelector(".completion-stamp")?.remove();
  const stamp = document.createElement("span");
  stamp.className = "completion-stamp";
  stamp.textContent = completionStampText();
  element.appendChild(stamp);
  element.classList.add("status-stamp");
  window.setTimeout(() => {
    stamp.remove();
    element.classList.remove("status-stamp");
  }, settings.motion === "normal" ? 820 : 460);
}

function playThemeEffectSound(completed) {
  const settings = readEffectSettings();
  if (!settings.sound) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  try {
    if (!audioContext) audioContext = new AudioContextClass();
    const tones = activeThemePack().effectTones || themePacks.default.effectTones;
    const frequencies = completed ? tones.complete : tones.undo;
    const start = audioContext.currentTime;
    frequencies.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start + index * 0.055);
      gain.gain.setValueAtTime(0.0001, start + index * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.055, start + index * 0.055 + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + index * 0.055 + 0.16);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(start + index * 0.055);
      oscillator.stop(start + index * 0.055 + 0.18);
    });
    if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
  } catch {
    // Audio feedback is optional; state changes should never fail because of it.
  }
}

function refreshCurrentView(preferredItemId = "") {
  const days = parseSchedule(source.value);
  const activeDays = getActiveDays(days);
  currentItems = new Map([...days.values()].flat().map((entry) => [entry.id, entry]));
  renderSummary(days, activeDays);
  renderConflicts(days.conflicts || []);
  renderWeek(days, activeDays);
  return { days, activeDays, item: preferredItemId ? currentItems.get(preferredItemId) : null };
}

function themeEasterEggMessage(item, completed, days = null) {
  const pack = activeThemePack();
  const eggs = pack.easterEggs || themePacks.default.easterEggs;
  if (!completed) return pickRandom(eggs.undo || themePacks.default.easterEggs.undo);
  const stats = days ? completionStats(days, item.day) : null;
  if (stats?.weekClear && eggs.weekClear) return pickRandom(eggs.weekClear);
  if (stats?.dayClear && eggs.dayClear) return pickRandom(eggs.dayClear);
  if (eggs.rare && Math.random() < 0.07) {
    const message = pickRandom(eggs.rare);
    collectEasterEgg("rare", { theme: currentTheme, message });
    return message;
  }
  const category = commonCategories.find((entry) => entry.label === item.category);
  const messages = eggs.complete?.[category?.className] || eggs.complete?.default || themePacks.default.easterEggs.complete.default;
  return pickRandom(messages);
}

function completionStats(days, day) {
  const dayItems = days.get(day) || [];
  const weekItems = dayOrder.flatMap((label) => days.get(label) || []);
  const dayClear = dayItems.length > 0 && dayItems.every((entry) => entry.completed);
  const weekClear = weekItems.length > 0 && weekItems.every((entry) => entry.completed);
  return { dayClear, weekClear };
}


function openTaskDetail(item) {
  activeTaskId = item.id;
  renderTaskDetail(item);
  taskModal.classList.add("show");
  taskModal.setAttribute("aria-hidden", "false");
  document.querySelector("#closeTaskButton").focus();
}

function renderTaskDetail(item) {
  const state = readTaskState(item.key);
  item.completed = Boolean(state.completed);
  item.category = state.category || item.category || inferCategory(item.activity);
  const subtasks = state.subtasks || [];
  const availableCategories = getAvailableCategoryLabels();
  const isExistingCategory = availableCategories.includes(item.category);
  taskBody.innerHTML = `
    <dl class="detail-grid">
      <dt>日期</dt>
      <dd>${escapeHtml(item.day)}</dd>
      <dt>时间</dt>
      <dd>${escapeHtml(formatRange(item))}</dd>
      <dt>时长</dt>
      <dd>${escapeHtml(item.minutes ? formatDuration(item.minutes) : "时间点")}</dd>
      <dt>类别</dt>
      <dd>
        <form class="category-editor" data-action="set-category">
          <select name="category">
            ${availableCategories.map((label) => `<option value="${escapeHtml(label)}" ${label === item.category ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
            <option value="__custom__" ${isExistingCategory ? "" : "selected"}>新增自定义类别</option>
          </select>
          <input name="customCategory" type="text" placeholder="输入自定义类别" value="${isExistingCategory ? "" : escapeHtml(item.category)}" ${isExistingCategory ? "disabled" : ""}>
          <button class="button subtle" type="submit">保存类别</button>
        </form>
      </dd>
      <dt>内容</dt>
      <dd>${escapeHtml(item.activity)}</dd>
      <dt>状态</dt>
      <dd class="${item.conflict ? "conflict-note" : ""}">${item.conflict ? "存在时间冲突" : "时间正常"}${item.completed ? "；已完成" : ""}</dd>
    </dl>
    <div class="detail-actions">
      <button class="button subtle" type="button" data-action="toggle-completed">${item.completed ? "切换为未完成" : "标记完成"}</button>
    </div>
    <section class="subtasks">
      <h3>子任务</h3>
      <form class="subtask-form" data-action="add-subtask">
        <input name="subtask" type="text" placeholder="例如：整理单词错题" autocomplete="off">
        <button class="button subtle" type="submit">添加</button>
      </form>
      ${subtasks.length ? `
        <ul class="subtask-list">
          ${subtasks.map((subtask) => `
            <li class="subtask-item ${subtask.done ? "done" : ""}">
              <input type="checkbox" data-action="toggle-subtask" data-subtask-id="${escapeHtml(subtask.id)}" ${subtask.done ? "checked" : ""}>
              <span>${escapeHtml(subtask.text)}</span>
              <button class="button subtle" type="button" data-action="delete-subtask" data-subtask-id="${escapeHtml(subtask.id)}">删除</button>
            </li>
          `).join("")}
        </ul>
      ` : `<p class="hint">还没有子任务，添加后只会出现在这个详情里。</p>`}
    </section>
  `;
}

function closeTaskDetail() {
  taskModal.classList.remove("show");
  taskModal.setAttribute("aria-hidden", "true");
  activeTaskId = "";
}

function handleTaskDetailSubmit(event) {
  const categoryForm = event.target.closest("form[data-action='set-category']");
  if (categoryForm && activeTaskId) {
    event.preventDefault();
    const item = currentItems.get(activeTaskId);
    if (!item) return;
    const selected = categoryForm.elements.category.value;
    const custom = categoryForm.elements.customCategory.value.trim();
    const nextCategory = selected === "__custom__" ? custom : selected;
    if (!nextCategory) {
      showToast("请先输入自定义类别名称");
      return;
    }
    updateTaskState(item.key, (state) => ({
      ...state,
      category: nextCategory,
    }));
    item.category = nextCategory;
    render();
    const updatedItem = currentItems.get(activeTaskId) || item;
    renderTaskDetail(updatedItem);
    showToast("类别已更新，顶部统计已同步");
    return;
  }

  const form = event.target.closest("form[data-action='add-subtask']");
  if (!form || !activeTaskId) return;
  event.preventDefault();
  const item = currentItems.get(activeTaskId);
  if (!item) return;
  const input = form.elements.subtask;
  const text = input.value.trim();
  if (!text) return;
  updateTaskState(item.key, (state) => ({
    ...state,
    subtasks: [...state.subtasks, { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, done: false }],
  }));
  input.value = "";
  renderTaskDetail(item);
}

function handleTaskDetailClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button || !activeTaskId) return;
  const item = currentItems.get(activeTaskId);
  if (!item) return;
  const action = button.dataset.action;

  if (action === "toggle-completed") {
    toggleTaskCompleted(item);
  }

  if (action === "delete-subtask") {
    const id = button.dataset.subtaskId;
    updateTaskState(item.key, (state) => ({
      ...state,
      subtasks: state.subtasks.filter((subtask) => subtask.id !== id),
    }));
    renderTaskDetail(item);
  }
}

function handleTaskDetailChange(event) {
  const categorySelect = event.target.closest("select[name='category']");
  if (categorySelect) {
    const form = categorySelect.closest("form[data-action='set-category']");
    const customInput = form?.elements.customCategory;
    if (customInput) {
      customInput.disabled = categorySelect.value !== "__custom__";
      if (!customInput.disabled) customInput.focus();
    }
    return;
  }

  const checkbox = event.target.closest("[data-action='toggle-subtask']");
  if (!checkbox || !activeTaskId) return;
  const item = currentItems.get(activeTaskId);
  if (!item) return;
  const id = checkbox.dataset.subtaskId;
  updateTaskState(item.key, (state) => ({
    ...state,
    subtasks: state.subtasks.map((subtask) => subtask.id === id ? { ...subtask, done: checkbox.checked } : subtask),
  }));
  renderTaskDetail(item);
}

function buildWeeklyReview(days) {
  const flat = dayOrder.flatMap((day) => days.get(day) || []);
  const timedItems = flat.filter((item) => item.minutes > 0);
  const completedTasks = flat.filter((item) => item.completed).length;
  const categoryTotals = timedItems.reduce((result, item) => {
    if (item.category === uncategorizedLabel) return result;
    result.set(item.category, (result.get(item.category) || 0) + item.minutes);
    return result;
  }, new Map());
  const dayTotals = dayOrder.map((day) => ({
    day,
    minutes: (days.get(day) || []).reduce((total, item) => total + item.minutes, 0),
    count: (days.get(day) || []).length,
  }));
  const topCategory = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1])[0] || ["暂无", 0];
  const busiestDay = dayTotals.slice().sort((a, b) => b.minutes - a.minutes)[0] || { day: "暂无", minutes: 0 };
  const fitnessLabel = commonCategories.find((category) => category.className === "fitness")?.label || "运动";
  const gameLabel = commonCategories.find((category) => category.className === "game")?.label || "游戏";
  const paperLabel = commonCategories.find((category) => category.className === "paper")?.label || "论文";
  const fitnessDays = dayOrder.filter((day) => (days.get(day) || []).some((item) => item.category === fitnessLabel)).length;

  return {
    totalMinutes: timedItems.reduce((total, item) => total + item.minutes, 0),
    totalTasks: flat.length,
    completedTasks,
    completion: flat.length ? Math.round(completedTasks / flat.length * 100) : 0,
    topCategory,
    busiestDay,
    fitnessDays,
    gameMinutes: categoryTotals.get(gameLabel) || 0,
    paperTasks: flat.filter((item) => item.category === paperLabel).length,
    dayTotals,
  };
}

function renderWeeklyReview(days) {
  const review = buildWeeklyReview(days);
  if (!review.totalTasks) {
    reviewBody.innerHTML = '<p class="hint">还没有识别到任务，先用左上角 + 导入一份时间表吧。</p>';
    return;
  }

  const dayRows = review.dayTotals
    .filter((entry) => entry.count || entry.minutes)
    .map((entry) => `<li>${escapeHtml(entry.day)}：${escapeHtml(formatDuration(entry.minutes))} / ${entry.count} 个任务</li>`)
    .join("");

  reviewBody.innerHTML = `
    <div class="review-grid">
      <article class="review-card">
        <strong>${escapeHtml(formatDuration(review.totalMinutes))}</strong>
        <span>本周总规划时间</span>
      </article>
      <article class="review-card">
        <strong>${review.completion}%</strong>
        <span>完成率 ${review.completedTasks}/${review.totalTasks}</span>
      </article>
      <article class="review-card">
        <strong>${escapeHtml(review.busiestDay.day)}</strong>
        <span>最满的一天：${escapeHtml(formatDuration(review.busiestDay.minutes))}</span>
      </article>
      <article class="review-card">
        <strong>${escapeHtml(review.topCategory[0])}</strong>
        <span>最高类别：${escapeHtml(formatDuration(review.topCategory[1]))}</span>
      </article>
      <article class="review-card">
        <strong>${review.fitnessDays} 天</strong>
        <span>本周安排了运动</span>
      </article>
      <article class="review-card">
        <strong>${escapeHtml(formatDuration(review.gameMinutes))}</strong>
        <span>游戏/娱乐时间</span>
      </article>
    </div>
    <h3>每天概览</h3>
    <ul class="review-list">${dayRows || "<li>暂无可统计的日期。</li>"}</ul>
    <p class="hint">论文任务共 ${review.paperTasks} 个；复盘统计会跟随类别修改、完成状态和导入文字实时变化。</p>
  `;
}

function createBackupPayload() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    source: source.value,
    taskState: readAllTaskState(),
    templates: readTemplates(),
    theme: currentTheme,
    themeBackgrounds: readThemeBackgrounds(),
    effects: readEffectSettings(),
  };
}


function exportBackup() {
  backupText.value = JSON.stringify(createBackupPayload(), null, 2);
  backupText.focus();
  backupText.select?.();
  showToast("备份已生成，可以保存这段 JSON");
}

function importBackup() {
  let payload;
  try {
    payload = JSON.parse(backupText.value);
  } catch {
    showToast("备份 JSON 格式不正确，先检查有没有漏复制");
    return;
  }

  if (!isPlainObject(payload)) {
    showToast("备份内容无效");
    return;
  }

  if (typeof payload.source === "string") source.value = payload.source;
  if (isPlainObject(payload.taskState)) writeAllTaskState(payload.taskState);
  if (isPlainObject(payload.templates)) writeTemplates(payload.templates);
  if (typeof payload.theme === "string") applyTheme(payload.theme, { rerender: false });
  if (isPlainObject(payload.themeBackgrounds)) {
    const defaults = activeThemeBackgroundSet().defaults;
    writeThemeBackgrounds({
      page: backgroundAssetById("page", payload.themeBackgrounds.page).id,
      table: backgroundAssetById("table", payload.themeBackgrounds.table).id,
      pageOpacity: clampPercent(payload.themeBackgrounds.pageOpacity, defaults.pageOpacity),
      tableOpacity: clampPercent(payload.themeBackgrounds.tableOpacity, defaults.tableOpacity),
      taskOpacity: clampPercent(payload.themeBackgrounds.taskOpacity, defaults.taskOpacity, 85),
      panelOpacity: clampPercent(payload.themeBackgrounds.panelOpacity, defaults.panelOpacity),
    });
    applyThemeBackgrounds();
  }
  if (isPlainObject(payload.effects)) {
    const motion = ["normal", "reduced", "off"].includes(payload.effects.motion) ? payload.effects.motion : defaultEffectSettings.motion;
    const sound = typeof payload.effects.sound === "boolean" ? payload.effects.sound : defaultEffectSettings.sound;
    const effects = { motion, sound };
    writeEffectSettings(effects);
    applyEffectSettings(effects);
  }

  const count = render();
  closeBackup();
  showToast(`备份已恢复：识别到 ${count} 个时间块`);
}

function openHelp() {
  helpModal.classList.add("show");
  helpModal.setAttribute("aria-hidden", "false");
}

function closeHelp() {
  helpModal.classList.remove("show");
  helpModal.setAttribute("aria-hidden", "true");
}

function openTheme() {
  renderThemeOptions();
  themeModal.classList.add("show");
  themeModal.setAttribute("aria-hidden", "false");
  document.querySelector("#closeThemeButton").focus();
}

function closeTheme() {
  themeModal.classList.remove("show");
  themeModal.setAttribute("aria-hidden", "true");
  updateMobileNavState();
}

function openBackgroundSettings() {
  renderBackgroundOptions();
  backgroundModal.classList.add("show");
  backgroundModal.setAttribute("aria-hidden", "false");
  document.querySelector("#closeBackgroundButton").focus();
}

function closeBackgroundSettings() {
  backgroundModal.classList.remove("show");
  backgroundModal.setAttribute("aria-hidden", "true");
}

function openImport() {
  renderSourceWarnings();
  importModal.classList.add("show");
  importModal.setAttribute("aria-hidden", "false");
  source.focus();
}

function closeImport() {
  importModal.classList.remove("show");
  importModal.setAttribute("aria-hidden", "true");
  updateMobileNavState();
}

function openTemplates() {
  renderTemplateOptions();
  templateModal.classList.add("show");
  templateModal.setAttribute("aria-hidden", "false");
  templateName.focus();
}

function closeTemplates() {
  templateModal.classList.remove("show");
  templateModal.setAttribute("aria-hidden", "true");
}

function openReview() {
  const days = parseSchedule(source.value);
  renderWeeklyReview(days);
  reviewModal.classList.add("show");
  reviewModal.setAttribute("aria-hidden", "false");
  document.querySelector("#closeReviewButton").focus();
}

function closeReview() {
  reviewModal.classList.remove("show");
  reviewModal.setAttribute("aria-hidden", "true");
}

function openBackup() {
  backupModal.classList.add("show");
  backupModal.setAttribute("aria-hidden", "false");
  backupText.focus();
}

function closeBackup() {
  backupModal.classList.remove("show");
  backupModal.setAttribute("aria-hidden", "true");
}

function saveTemplate() {
  const name = templateName.value.trim();
  if (!name) {
    showToast("先给模板起个名字");
    return;
  }
  const templates = readTemplates();
  templates[name] = source.value;
  writeTemplates(templates);
  templateName.value = "";
  renderTemplateOptions();
  templateSelect.value = name;
  showToast(`已保存模板：${name}`);
}

function loadTemplate() {
  const name = templateSelect.value;
  const templates = readTemplates();
  if (!name || !templates[name]) return;
  source.value = templates[name];
  const count = render();
  closeTemplates();
  showToast(`已加载模板：${name}，识别到 ${count} 个时间块`);
}

function deleteTemplate() {
  const name = templateSelect.value;
  if (!name) return;
  const templates = readTemplates();
  delete templates[name];
  writeTemplates(templates);
  renderTemplateOptions();
  showToast(`已删除模板：${name}`);
}

function openDrawer() {
  sideDrawer.classList.add("show");
  drawerBackdrop.classList.add("show");
  sideDrawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  sideDrawer.classList.remove("show");
  drawerBackdrop.classList.remove("show");
  sideDrawer.setAttribute("aria-hidden", "true");
}

function cssEscape(value) {
  if (window.CSS?.escape) return window.CSS.escape(value);
  return String(value).replace(/["\\]/g, "\\$&");
}

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      // PWA install support is optional; the timetable still works without it.
    });
  });
}

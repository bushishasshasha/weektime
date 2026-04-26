// Shared utility helpers for parsing, validation, formatting, and export support.
function formatRange(item) {
  return item.end ? `${item.start}-${item.end}` : item.start;
}

function normalizeTime(value) {
  const [hour, minute] = value.split(":").map(Number);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function toMinutes(value) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function formatDuration(minutes) {
  if (!minutes) return "0分钟";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest}分钟`;
  if (!rest) return `${hours}小时`;
  return `${hours}小时${rest}分钟`;
}

function formatClock(minutes) {
  const normalized = ((minutes % (24 * 60)) + (24 * 60)) % (24 * 60);
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function cleanActivity(value) {
  return value.replace(/^[-：:\s]+/, "").trim();
}

function clockIssue(value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return "时间格式应类似 8:30 或 08:30";
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return "时间超出 00:00-23:59 范围";
  return "";
}

function validateScheduleText(text) {
  const warnings = [];
  let currentDay = "";
  text.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) return;
    const dayMatch = line.match(/^(?:#+\s*)?\*{0,2}(周[一二三四五六日])\*{0,2}/);
    if (dayMatch) {
      currentDay = dayMatch[1];
      return;
    }
    const timeLike = line.match(/^(?:[-*]\s*)?(?:`)?(\d{1,2}:\d{1,2})(?:\s*[-–—至到]\s*(\d{1,2}:\d{1,2}))?(?:`)?\s*(.*)$/);
    if (!timeLike) {
      warnings.push(`第 ${index + 1} 行可能不会被识别：${line}`);
      return;
    }
    if (!currentDay) warnings.push(`第 ${index + 1} 行在星期标题前，导入时会被忽略。`);
    const startIssue = clockIssue(timeLike[1]);
    if (startIssue) warnings.push(`第 ${index + 1} 行开始时间有问题：${startIssue}。`);
    if (timeLike[2]) {
      const endIssue = clockIssue(timeLike[2]);
      if (endIssue) warnings.push(`第 ${index + 1} 行结束时间有问题：${endIssue}。`);
      if (!startIssue && !endIssue) {
        const minutes = toMinutes(normalizeTime(timeLike[2])) - toMinutes(normalizeTime(timeLike[1]));
        const duration = minutes <= 0 ? minutes + 24 * 60 : minutes;
        if (duration > 16 * 60) warnings.push(`第 ${index + 1} 行跨度超过 16 小时，确认是否写反了开始/结束时间。`);
      }
    }
    if (!cleanActivity(timeLike[3] || "")) warnings.push(`第 ${index + 1} 行缺少任务内容。`);
  });
  return warnings;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function makeTaskKey(day, start, end, activity) {
  return [day, start, end || "point", activity].join("|");
}

function effectMotionLabel(value) {
  return { normal: "标准", reduced: "轻微", off: "关闭" }[value] || "标准";
}

function clampPercent(value, fallback, max = 100) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(max, Math.round(number)));
}

function cssUrl(path) {
  return `url("${String(path).replace(/"/g, "%22")}")`;
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function byteLength(value) {
  return new TextEncoder().encode(value).length;
}

function pickRandom(messages) {
  if (!Array.isArray(messages) || !messages.length) return "已更新";
  return messages[Math.floor(Math.random() * messages.length)];
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

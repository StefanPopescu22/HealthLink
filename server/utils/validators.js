const isNonEmptyString = (value, minLength = 1) => {
  return typeof value === "string" && value.trim().length >= minLength;
};

const normalizeText = (value) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const isValidEmail = (email) => {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const isValidPassword = (password) => {
  return typeof password === "string" && password.length >= 6;
};

const isPositiveInt = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0;
};

const isValidRating = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 5;
};

const isValidDateString = (value) => {
  if (typeof value !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
};

const isValidTimeString = (value) => {
  if (typeof value !== "string") return false;
  return /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(value);
};

const isTodayOrFutureDate = (value) => {
  if (!isValidDateString(value)) return false;

  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const selected = new Date(`${value}T00:00:00`);

  return selected >= todayOnly;
};

const isValidWeekday = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 6;
};

const isValidWorkingHoursArray = (workingHours) => {
  if (!Array.isArray(workingHours) || workingHours.length === 0) {
    return false;
  }

  const normalized = workingHours.map((item) => ({
    weekday: Number(item.weekday),
    startTime: item.startTime,
    endTime: item.endTime,
  }));

  for (const item of normalized) {
    if (!isValidWeekday(item.weekday)) return false;
    if (!isValidTimeString(item.startTime)) return false;
    if (!isValidTimeString(item.endTime)) return false;
    if (item.startTime >= item.endTime) return false;
  }

  const byDay = {};

  for (const item of normalized) {
    if (!byDay[item.weekday]) byDay[item.weekday] = [];
    byDay[item.weekday].push(item);
  }

  for (const weekday of Object.keys(byDay)) {
    const intervals = byDay[weekday].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

    for (let i = 0; i < intervals.length - 1; i++) {
      const current = intervals[i];
      const next = intervals[i + 1];

      if (current.endTime > next.startTime) {
        return false;
      }
    }
  }

  return true;
};

module.exports = {
  isNonEmptyString,
  normalizeText,
  isValidEmail,
  isValidPassword,
  isPositiveInt,
  isValidRating,
  isValidDateString,
  isValidTimeString,
  isTodayOrFutureDate,
  isValidWeekday,
  isValidWorkingHoursArray,
};
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
};
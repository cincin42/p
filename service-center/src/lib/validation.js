// src/lib/validation.js

// Regexes
export const PHONE_DIGITS_RE = /^\d{10}$/;
export const ZIP_RE = /^\d{5}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const STATE_RE = /^[A-Z]{2}$/;

// US state abbreviations set
export const US_STATES = new Set([
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY",
  "LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND",
  "OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
]);

// Normalizers
export function normalizePhone(raw) {
  return (raw || "").replace(/\D/g, "");
}
export function normalizeState(raw) {
  return (raw || "").toUpperCase();
}

// Validators
export function isValidPhone(raw) {
  return PHONE_DIGITS_RE.test(normalizePhone(raw));
}
export function isValidZip(zip) {
  return ZIP_RE.test((zip || "").trim());
}
export function isValidEmail(email) {
  return EMAIL_RE.test((email || "").trim());
}
export function isValidState(state) {
  const up = normalizeState(state);
  return STATE_RE.test(up) && US_STATES.has(up);
}
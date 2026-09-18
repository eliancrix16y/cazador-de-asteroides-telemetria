const RULES = Object.freeze({
  playerName: { type: "string", min: 1, max: 16 },
  score: { type: "integer", min: 0, max: 999999 },
  waveReached: { type: "integer", min: 1, max: 999 },
  averageFps: { type: "number", min: 0, max: 1000 },
});

export function validateScorePayload(payload) {
  const body = payload || {};
  const errors = [];
  for (const key of Object.keys(RULES)) {
    const error = validateField(key, body[key], RULES[key]);
    if (error) errors.push(error);
  }
  return errors;
}

function validateField(key, value, rule) {
  if (value === undefined || value === null) return `${key} es obligatorio`;
  if (rule.type === "string") return validateString(key, value, rule);
  if (rule.type === "integer") return validateInteger(key, value, rule);
  return validateNumber(key, value, rule);
}

function validateString(key, value, rule) {
  if (typeof value !== "string") return `${key} debe ser texto`;
  const length = value.trim().length;
  if (length < rule.min || length > rule.max) {
    return `${key} debe tener entre ${rule.min} y ${rule.max} caracteres`;
  }
  return null;
}

function validateInteger(key, value, rule) {
  if (!Number.isInteger(value)) return `${key} debe ser un entero`;
  if (value < rule.min || value > rule.max) {
    return `${key} debe estar entre ${rule.min} y ${rule.max}`;
  }
  return null;
}

function validateNumber(key, value, rule) {
  if (typeof value !== "number" || Number.isNaN(value)) return `${key} debe ser numerico`;
  if (value < rule.min || value > rule.max) {
    return `${key} debe estar entre ${rule.min} y ${rule.max}`;
  }
  return null;
}
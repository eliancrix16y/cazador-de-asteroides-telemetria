const NAME_MAX_LENGTH = 16;
const SCORE_MAX = 999999;
const WAVE_MAX = 999;
const FPS_MAX = 1000;
const DEFAULT_NAME = "Jugador";

export function createLeaderboardService(repository) {
  return {
    getTopScores: () => repository.findAllTop(),
    addScore: (payload) => addScore(repository, payload),
  };
}

function addScore(repository, payload) {
  const entry = sanitizeEntry(payload);
  const id = repository.insert(entry);
  return { id, ...entry };
}

function sanitizeEntry(payload) {
  return {
    playerName: sanitizeName(payload.playerName),
    score: clampInt(payload.score, 0, SCORE_MAX),
    waveReached: clampInt(payload.waveReached, 1, WAVE_MAX),
    averageFps: clampNumber(payload.averageFps, 0, FPS_MAX),
  };
}

function sanitizeName(value) {
  if (typeof value !== "string") return DEFAULT_NAME;
  const trimmed = value.trim().slice(0, NAME_MAX_LENGTH);
  return trimmed.length > 0 ? trimmed : DEFAULT_NAME;
}

function clampInt(value, min, max) {
  if (!Number.isInteger(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function clampNumber(value, min, max) {
  if (typeof value !== "number" || Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_ENV_FILE = path.resolve(__dirname, "../../.env");

const DEFAULTS = Object.freeze({
  port: 3000,
  dbPath: "./data/scores.db",
  corsOrigin: "*",
});

export function loadConfig() {
  loadRootEnvFile();
  return {
    port: parsePort(process.env.PORT),
    dbPath: process.env.DB_PATH || DEFAULTS.dbPath,
    corsOrigins: splitCorsOrigins(process.env.CORS_ORIGIN),
  };
}

function loadRootEnvFile() {
  if (typeof process.loadEnvFile !== "function") return;
  if (!existsSync(ROOT_ENV_FILE)) return;
  process.loadEnvFile(ROOT_ENV_FILE);
}

function parsePort(value) {
  if (!value) return DEFAULTS.port;
  const portNumber = Number.parseInt(value, 10);
  if (Number.isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
    return DEFAULTS.port;
  }
  return portNumber;
}

function splitCorsOrigins(value) {
  if (!value) return [DEFAULTS.corsOrigin];
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}
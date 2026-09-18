import path from "node:path";
import { fileURLToPath } from "node:url";
import { createLeaderboardRoutes } from "../routes/leaderboard.routes.js";
import { handleNotFound } from "../middlewares/not-found.js";
import { handleErrors } from "../middlewares/error-handler.js";
import { parseJsonBody } from "./parse-json-body.js";
import { serveStaticFile } from "./static-files.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = path.resolve(__dirname, "../../../frontend");

export function createRequestHandler(database, config) {
  const apiRoutes = createLeaderboardRoutes(database);
  return async function requestHandler(request, response) {
    applyCorsHeaders(response, config.corsOrigins);
    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }
    try {
      if (isApiRequest(request.url)) {
        await routeApi(request, response, apiRoutes);
        return;
      }
      await serveStaticFile(request, response, FRONTEND_DIR, request.url);
    } catch (error) {
      handleErrors(error, request, response);
    }
  };
}

function isApiRequest(url) {
  return url.split("?")[0].startsWith("/api/");
}

async function routeApi(request, response, apiRoutes) {
  const pathname = request.url.split("?")[0];
  for (const route of apiRoutes) {
    if (route.method !== request.method) continue;
    if (route.path !== pathname) continue;
    if (request.method === "POST") request.body = await parseJsonBody(request);
    route.handler(request, response);
    return;
  }
  handleNotFound(request, response);
}

function applyCorsHeaders(response, origins) {
  const origin = origins.includes("*") ? "*" : origins[0];
  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
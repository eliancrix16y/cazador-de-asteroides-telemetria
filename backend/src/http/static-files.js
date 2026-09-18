import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";

const MIME_TYPES = Object.freeze({
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".map": "application/json; charset=utf-8",
});

export function serveStaticFile(request, response, root, url) {
  return new Promise((resolve) => {
    const filePath = findFile(root, url);
    if (!filePath) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Recurso no encontrado");
      resolve();
      return;
    }
    const stream = createReadStream(filePath);
    stream.on("error", () => {
      response.writeHead(404);
      response.end();
      resolve();
    });
    response.writeHead(200, { "Content-Type": mimeFor(filePath) });
    stream.pipe(response);
    stream.on("close", resolve);
  });
}

function findFile(root, url) {
  const pathname = url.split("?")[0];
  const relativePath = pathname === "/" ? "/index.html" : pathname;
  const absolutePath = path.resolve(root, "." + relativePath);
  if (!absolutePath.startsWith(path.resolve(root))) return null;
  if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) return null;
  return absolutePath;
}

function mimeFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return MIME_TYPES[extension] || "application/octet-stream";
}
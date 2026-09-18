export function sendSuccess(response, data, message = "Operacion completada") {
  sendJson(response, 200, true, data, message);
}

export function sendCreated(response, data, message = "Recurso creado") {
  sendJson(response, 201, true, data, message);
}

export function sendBadRequest(response, message) {
  sendJson(response, 400, false, null, message);
}

export function sendNotFound(response, message = "Recurso no encontrado") {
  sendJson(response, 404, false, null, message);
}

export function sendServerError(response, message = "Error interno del servidor") {
  sendJson(response, 500, false, null, message);
}

function sendJson(response, statusCode, success, data, message) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({ success, data, message }));
}
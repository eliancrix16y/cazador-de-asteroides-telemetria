export function parseJsonBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
    });
    request.on("end", () => {
      if (raw.length === 0) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(createBadRequestError());
      }
    });
    request.on("error", reject);
  });
}

function createBadRequestError() {
  const error = new Error("JSON inválido en el cuerpo de la solicitud");
  error.status = 400;
  return error;
}
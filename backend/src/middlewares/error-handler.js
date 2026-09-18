import { sendBadRequest, sendServerError } from "../utils/response.js";

export function handleErrors(error, request, response) {
  if (Number.isInteger(error?.status) && error.status === 400) {
    return sendBadRequest(response, error.message || "Solicitud inválida");
  }
  return sendServerError(response);
}
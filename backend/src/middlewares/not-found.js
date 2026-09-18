import { sendNotFound } from "../utils/response.js";

export function handleNotFound(request, response) {
  sendNotFound(response);
}
import { FPS_SMOOTH_THRESHOLD, FPS_REGULAR_THRESHOLD } from "../constants.js";

export function classifyFps(fps) {
  if (fps >= FPS_SMOOTH_THRESHOLD) return { label: "FLUIDO", cssClass: "is-fluid" };
  if (fps >= FPS_REGULAR_THRESHOLD) return { label: "REGULAR", cssClass: "is-regular" };
  return { label: "DEFICIENTE", cssClass: "is-poor" };
}
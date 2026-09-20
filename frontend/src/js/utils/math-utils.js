import { WORLD_WIDTH, WORLD_HEIGHT } from "../constants.js";

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

export function randomAngle() {
  return Math.random() * Math.PI * 2;
}

export function distanceBetween(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function wrapPosition(position) {
  position.x = wrapAxis(position.x, WORLD_WIDTH);
  position.y = wrapAxis(position.y, WORLD_HEIGHT);
}

function wrapAxis(value, size) {
  return ((value % size) + size) % size;
}
import { WORLD_WIDTH, WORLD_HEIGHT, COLOR_BACKGROUND } from "../constants.js";

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  clear() {
    this.context.fillStyle = COLOR_BACKGROUND;
    this.context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  }
}
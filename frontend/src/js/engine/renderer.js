import { WORLD_WIDTH, WORLD_HEIGHT, COLOR_BACKGROUND } from "../constants.js";

const STAR_COUNT = 120;

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.stars = this.buildStars();
  }

  buildStars() {
    const stars = [];
    for (let index = 0; index < STAR_COUNT; index++) {
      stars.push({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT,
        size: 0.6 + Math.random() * 0.9,
        alpha: 0.18 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return stars;
  }

  clear() {
    const context = this.context;
    context.fillStyle = COLOR_BACKGROUND;
    context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.drawStars(context);
  }

  drawStars(context) {
    const now = performance.now();
    for (const star of this.stars) {
      const twinkle = 0.7 + 0.3 * Math.sin(now / 500 + star.phase);
      context.fillStyle = `rgba(255, 255, 255, ${(star.alpha * twinkle).toFixed(3)})`;
      context.fillRect(star.x, star.y, star.size, star.size);
    }
  }
}
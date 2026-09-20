import { FPS_HISTORY_LIMIT } from "../constants.js";

export class FpsMonitor {
  constructor() {
    this.history = [];
    this.lastTimestamp = null;
    this.totalFrames = 0;
    this.minFps = null;
    this.maxFps = null;
    this.lastFrameTime = 0;
    this.lastWorkload = 0;
    this.lastEntities = 0;
  }

  reset() {
    this.history.length = 0;
    this.totalFrames = 0;
    this.minFps = null;
    this.maxFps = null;
    this.lastTimestamp = null;
    this.lastFrameTime = 0;
    this.lastWorkload = 0;
    this.lastEntities = 0;
  }

  record(timestamp) {
    this.totalFrames += 1;
    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp;
      return null;
    }
    const frameTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    if (frameTime <= 0) return null;
    const fps = 1000 / frameTime;
    this.pushHistory(fps);
    this.updateExtremes(fps);
    this.lastFrameTime = frameTime;
    return fps;
  }

  pushHistory(fps) {
    this.history.push(fps);
    if (this.history.length > FPS_HISTORY_LIMIT) this.history.shift();
  }

  updateExtremes(fps) {
    if (this.minFps === null || fps < this.minFps) this.minFps = fps;
    if (this.maxFps === null || fps > this.maxFps) this.maxFps = fps;
  }

  recordWorkload(pairs) {
    this.lastWorkload = pairs;
  }

  recordEntities(count) {
    this.lastEntities = count;
  }

  average() {
    if (this.history.length === 0) return 0;
    let sum = 0;
    for (const fps of this.history) sum += fps;
    return sum / this.history.length;
  }
}
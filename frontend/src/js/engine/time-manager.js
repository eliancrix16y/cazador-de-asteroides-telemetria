import { MAX_DELTA_SECONDS } from "../constants.js";

export class TimeManager {
  constructor() {
    this.previousTimestamp = null;
  }

  reset() {
    this.previousTimestamp = null;
  }

  calculateDelta(timestamp) {
    if (this.previousTimestamp === null) {
      this.previousTimestamp = timestamp;
      return 0;
    }
    const deltaSeconds = (timestamp - this.previousTimestamp) / 1000;
    this.previousTimestamp = timestamp;
    return Math.min(deltaSeconds, MAX_DELTA_SECONDS);
  }
}
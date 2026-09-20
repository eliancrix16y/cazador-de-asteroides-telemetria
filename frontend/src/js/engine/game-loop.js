export class GameLoop {
  constructor(runner, monitor, timeManager) {
    this.runner = runner;
    this.monitor = monitor;
    this.timeManager = timeManager;
    this.running = false;
    this.animationId = null;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.requestFrame();
  }

  stop() {
    this.running = false;
    if (this.animationId !== null) cancelAnimationFrame(this.animationId);
    this.animationId = null;
  }

  requestFrame() {
    this.animationId = requestAnimationFrame((timestamp) => this.frame(timestamp));
  }

  frame(timestamp) {
    if (!this.running) return;
    try {
      const deltaSeconds = this.timeManager.calculateDelta(timestamp);
      const fps = this.monitor.record(timestamp);
      this.runner.update(deltaSeconds, fps);
      this.runner.render();
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      if (this.lastError !== message) {
        this.lastError = message;
        console.error("Error en el bucle de juego:", error);
      }
    } finally {
      this.requestFrame();
    }
  }
}
import { getElement } from "../utils/dom-utils.js";
import { classifyFps } from "./fps-classifier.js";
import { FPS_GRAPH_CAP, FPS_HISTORY_LIMIT } from "../constants.js";

export class TelemetryPanel {
  constructor(monitor) {
    this.monitor = monitor;
    this.badgeValue = getElement("fps-badge-value");
    this.current = getElement("fps-current");
    this.state = getElement("fps-state");
    this.average = getElement("fps-average");
    this.minimum = getElement("fps-min");
    this.maximum = getElement("fps-max");
    this.frames = getElement("fps-frames");
    this.frameTime = getElement("fps-frame-time");
    this.collisions = getElement("fps-collisions");
    this.entities = getElement("fps-entities");
    this.graphContext = getElement("fps-graph").getContext("2d");
  }

  update(fps) {
    if (fps === null) return;
    const rounded = Math.round(fps);
    const classification = classifyFps(fps);
    this.badgeValue.textContent = rounded;
    this.current.textContent = rounded;
    this.state.textContent = classification.label;
    this.state.className = classification.cssClass;
    this.average.textContent = Math.round(this.monitor.average());
    this.minimum.textContent = this.displayValue(this.monitor.minFps);
    this.maximum.textContent = this.displayValue(this.monitor.maxFps);
    this.frames.textContent = this.monitor.totalFrames;
    this.frameTime.textContent = this.monitor.lastFrameTime.toFixed(1);
    this.collisions.textContent = this.monitor.lastWorkload;
    this.entities.textContent = this.monitor.lastEntities;
    this.drawGraph();
  }

  displayValue(value) {
    if (value === null) return "-";
    return Math.round(value);
  }

  drawGraph() {
    const context = this.graphContext;
    const width = context.canvas.width;
    const height = context.canvas.height;
    context.clearRect(0, 0, width, height);
    context.strokeStyle = "#2a2e37";
    this.traceBaseline(context, width, height);
    if (this.monitor.history.length < 2) return;
    context.beginPath();
    this.traceHistory(context, width, height);
    context.strokeStyle = "#2bb7a9";
    context.lineWidth = 1.6;
    context.stroke();
  }

  traceBaseline(context, width, height) {
    context.beginPath();
    context.moveTo(0, height - 1);
    context.lineTo(width, height - 1);
    context.stroke();
  }

  traceHistory(context, width, height) {
    let first = true;
    for (let index = 0; index < this.monitor.history.length; index++) {
      const x = (index / (FPS_HISTORY_LIMIT - 1)) * width;
      const y = height - (Math.min(this.monitor.history[index], FPS_GRAPH_CAP) / FPS_GRAPH_CAP) * height;
      if (first) {
        context.moveTo(x, y);
        first = false;
      } else {
        context.lineTo(x, y);
      }
    }
  }
}
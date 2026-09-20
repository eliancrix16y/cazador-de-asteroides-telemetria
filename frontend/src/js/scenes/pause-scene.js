import { getElement } from "../utils/dom-utils.js";

export class PauseScene {
  constructor(runner, keyInput) {
    this.runner = runner;
    this.keys = keyInput;
    this.element = getElement("scene-pause");
  }

  enter() {
    this.element.classList.remove("hidden");
    this.keys.consumePresses();
  }

  exit() {
    this.element.classList.add("hidden");
  }

  update(deltaSeconds, fps) {
    if (this.keys.justPressed("KeyP") || this.keys.justPressed("Space")) {
      this.runner.changeScene("play", { fresh: false });
    }
    this.keys.consumePresses();
  }
}
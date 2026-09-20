export class KeyInput {
  constructor() {
    this.pressed = {};
    this.justPressedSet = new Set();
    this.bindGlobalListeners();
  }

  bindGlobalListeners() {
    window.addEventListener("keydown", (event) => this.onKeyDown(event));
    window.addEventListener("keyup", (event) => this.onKeyUp(event));
  }

  onKeyDown(event) {
    if (event.code === "Space") event.preventDefault();
    if (!this.pressed[event.code]) this.justPressedSet.add(event.code);
    this.pressed[event.code] = true;
  }

  onKeyUp(event) {
    this.pressed[event.code] = false;
  }

  isDown(code) {
    return Boolean(this.pressed[code]);
  }

  justPressed(code) {
    return this.justPressedSet.has(code);
  }

  consumePresses() {
    this.justPressedSet.clear();
  }
}
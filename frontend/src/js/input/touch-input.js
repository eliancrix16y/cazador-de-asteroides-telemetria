import { getElement } from "../utils/dom-utils.js";

export class TouchInput {
  constructor() {
    this.leftHeld = false;
    this.rightHeld = false;
    this.thrust = false;
    this.firePressed = false;
    this.bindControls(this.buildButtons());
  }

  buildButtons() {
    return {
      left: getElement("btn-touch-left"),
      right: getElement("btn-touch-right"),
      thrust: getElement("btn-touch-thrust"),
      fire: getElement("btn-touch-fire"),
    };
  }

  bindControls(buttons) {
    const left = () => this.setHeld("leftHeld", true);
    const stopLeft = () => this.setHeld("leftHeld", false);
    const right = () => this.setHeld("rightHeld", true);
    const stopRight = () => this.setHeld("rightHeld", false);

    this.bindHold(buttons.left, left, stopLeft);
    this.bindHold(buttons.right, right, stopRight);
    this.bindHold(buttons.thrust, () => { this.thrust = true; }, () => { this.thrust = false; });
    this.bindHold(buttons.fire, () => { this.firePressed = true; }, () => { this.firePressed = false; });
  }

  bindHold(button, onPress, onRelease) {
    button.addEventListener("pointerdown", onPress);
    button.addEventListener("pointerup", onRelease);
    button.addEventListener("pointercancel", onRelease);
    button.addEventListener("pointerleave", onRelease);
  }

  setHeld(property, value) {
    this[property] = value;
  }

  get turn() {
    let direction = 0;
    if (this.leftHeld) direction -= 1;
    if (this.rightHeld) direction += 1;
    return direction;
  }
}
import { getElement } from "../utils/dom-utils.js";

export class ApiState {
  constructor() {
    this.element = getElement("api-state");
  }

  setOk(text = "OK") {
    this.element.textContent = text;
    this.element.className = "is-ok";
  }

  setDown() {
    this.element.textContent = "Sin conexion";
    this.element.className = "is-off";
  }
}
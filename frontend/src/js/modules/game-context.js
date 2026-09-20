import { DEFAULT_PLAYER_NAME } from "../constants.js";

export class GameContext {
  constructor() {
    this.playerName = DEFAULT_PLAYER_NAME;
    this.final = { score: 0, wave: 1, fps: 0 };
  }

  setFinal(score, wave, fps) {
    this.final = { score, wave, fps };
  }
}
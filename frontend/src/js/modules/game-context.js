import { DEFAULT_PLAYER_NAME, GAME_MODES } from "../constants.js";

export class GameContext {
  constructor() {
    this.playerName = DEFAULT_PLAYER_NAME;
    this.mode = "classic";
    this.final = { score: 0, wave: 1, fps: 0 };
  }

  setFinal(score, wave, fps) {
    this.final = { score, wave, fps };
  }

  getModeConfig() {
    return GAME_MODES[this.mode] || GAME_MODES.classic;
  }

  getModeLabel() {
    return this.getModeConfig().label;
  }
}
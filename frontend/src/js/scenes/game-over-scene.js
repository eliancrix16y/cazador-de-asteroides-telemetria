import { getElement } from "../utils/dom-utils.js";

export class GameOverScene {
  constructor(runner, keys, leaderboardService, telemetry, apiState, context) {
    this.runner = runner;
    this.keys = keys;
    this.leaderboardService = leaderboardService;
    this.telemetry = telemetry;
    this.apiState = apiState;
    this.context = context;
    this.element = getElement("scene-game-over");
    this.summary = getElement("game-over-summary");
    this.retryButton = getElement("btn-retry");
    this.retryButton.addEventListener("click", () => this.retry());
  }

  enter() {
    this.element.classList.remove("hidden");
    this.keys.consumePresses();
    this.renderSummary();
    this.saveScore();
  }

  exit() {
    this.element.classList.add("hidden");
  }

  update(deltaSeconds, fps) {
    this.telemetry.update(fps);
    if (this.keys.justPressed("Enter")) this.retry();
    this.keys.consumePresses();
  }

  retry() {
    this.runner.changeScene("play", { playerName: this.context.playerName, fresh: true });
  }

  renderSummary() {
    const final = this.context.final;
    this.summary.textContent =
      `${this.context.playerName} — puntaje ${final.score}, oleada ${final.wave}, ` +
      `fps promedio ${final.fps}.`;
  }

  saveScore() {
    this.leaderboardService
      .submitScore(this.buildPayload())
      .then(() => this.apiState.setOk("guardado"))
      .catch(() => this.apiState.setDown());
  }

  buildPayload() {
    return {
      playerName: this.context.playerName,
      score: this.context.final.score,
      waveReached: this.context.final.wave,
      averageFps: this.context.final.fps,
    };
  }
}
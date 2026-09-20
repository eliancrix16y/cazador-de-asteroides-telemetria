import { getElement } from "../utils/dom-utils.js";
import { DEFAULT_PLAYER_NAME } from "../constants.js";

export class MenuScene {
  constructor(runner, keyInput, leaderboardService, telemetry, apiState) {
    this.runner = runner;
    this.keys = keyInput;
    this.leaderboardService = leaderboardService;
    this.telemetry = telemetry;
    this.apiState = apiState;
    this.element = getElement("scene-menu");
    this.nameInput = getElement("player-name");
    this.startButton = getElement("btn-start");
    this.leaderboardList = getElement("leaderboard-list");
    this.startButton.addEventListener("click", () => this.startGame());
  }

  enter() {
    this.element.classList.remove("hidden");
    this.keys.consumePresses();
    this.loadLeaderboard();
  }

  exit() {
    this.element.classList.add("hidden");
  }

  update(deltaSeconds, fps) {
    this.telemetry.update(fps);
    if (this.keys.justPressed("Enter")) this.startGame();
    this.keys.consumePresses();
  }

  startGame() {
    const playerName = this.nameInput.value.trim() || DEFAULT_PLAYER_NAME;
    this.runner.changeScene("play", { playerName, fresh: true });
  }

  async loadLeaderboard() {
    this.renderHint("Cargando…");
    try {
      const scores = await this.leaderboardService.getTopScores();
      this.apiState.setOk();
      this.renderScores(scores);
    } catch {
      this.apiState.setDown();
      this.renderHint("Sin conexion con la API. Ejecuta ComenzarPartida.cmd o revisa que el servidor este activo en http://localhost:3000");
    }
  }

  renderHint(text) {
    this.leaderboardList.textContent = "";
    const item = document.createElement("li");
    item.textContent = text;
    item.className = "leaderboard-hint";
    this.leaderboardList.appendChild(item);
  }

  renderScores(scores) {
    this.leaderboardList.textContent = "";
    if (scores.length === 0) {
      this.renderHint("Sin puntuaciones guardadas");
      return;
    }
    for (const score of scores) {
      const item = document.createElement("li");
      item.textContent = `${score.playerName}: ${score.score} pts · oleada ${score.waveReached}`;
      this.leaderboardList.appendChild(item);
    }
  }
}
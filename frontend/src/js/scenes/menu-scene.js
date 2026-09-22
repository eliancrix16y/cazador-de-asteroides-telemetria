import { getElement } from "../utils/dom-utils.js";
import { DEFAULT_PLAYER_NAME, GAME_MODES } from "../constants.js";

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
    this.selectedMode = "classic";
    this.modeButtons = new Map();
    const modeSelect = getElement("mode-select");
    for (const card of modeSelect.querySelectorAll("button[data-mode]")) {
      this.modeButtons.set(card.dataset.mode, card);
      this.renderModeCard(card, card.dataset.mode);
      card.addEventListener("click", () => this.selectMode(card.dataset.mode));
    }
    this.startButton.addEventListener("click", () => this.startGame());
    this.applySelection();
  }

  selectMode(mode) {
    this.selectedMode = mode;
    this.applySelection();
  }

  applySelection() {
    for (const [mode, card] of this.modeButtons) {
      card.classList.toggle("selected", mode === this.selectedMode);
    }
  }

  renderModeCard(card, mode) {
    const config = GAME_MODES[mode];
    if (!config) return;
    const title = card.querySelector(".mode-title");
    const desc = card.querySelector(".mode-desc");
    if (title) title.textContent = config.label;
    if (desc) desc.textContent = config.description;
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
    this.runner.changeScene("play", { playerName, fresh: true, mode: this.selectedMode });
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
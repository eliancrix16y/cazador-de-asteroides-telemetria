/* Generado desde los ES modules de src/js. No editar a mano. Regenerar: node scripts/bundle.js */
(function () {
  var __modules = {};
  var __cache = {};
  function __require(id) {
    if (__cache[id]) { return __cache[id].exports; }
    var module = { exports: {} };
    __cache[id] = module;
    __modules[id].call(module.exports, module.exports, module, __require);
    return module.exports;
  }
  __modules["constants.js"] = function (exports, module, __require) {
const WORLD_WIDTH = 620;
const WORLD_HEIGHT = 460;

const PLAYER_TURN_RATE = 3.4;
const PLAYER_ACCELERATION = 220;
const PLAYER_FRICTION = 0.992;
const PLAYER_MAX_SPEED = 260;
const PLAYER_RADIUS = 12;
const SHOOT_COOLDOWN = 0.22;

const BULLET_SPEED = 380;
const BULLET_RADIUS = 2.2;
const BULLET_LIFETIME = 1.1;

const ASTEROID_SIDES = 9;
const ASTEROID_RADIUS = Object.freeze({ large: 32, medium: 19, small: 10 });
const ASTEROID_SCORE = Object.freeze({ large: 20, medium: 50, small: 100 });
const FRAGMENTS_ON_BREAK = 2;
const FRAGMENT_MIN_SPEED = 50;
const FRAGMENT_MAX_SPEED = 110;

const STARTING_LIVES = 3;
const GAME_MODES = Object.freeze({
  classic: {
    label: "Clasico",
    lives: 3,
    timeout: null,
    speedBonus: 0,
    description: "Oleadas progresivas · 3 naves",
  },
  blitz: {
    label: "Velocidad",
    lives: Infinity,
    timeout: 45,
    speedBonus: 0,
    description: "45 segundos para el maximo puntaje",
  },
  survival: {
    label: "Supervivencia",
    lives: 1,
    timeout: null,
    speedBonus: 25,
    description: "Oleadas rapidas e infinitas · 1 nave",
  },
});
const INVINCIBLE_TIME = 2.2;
const BASE_WAVE_SIZE = 3;
const WAVE_MIN_SPEED = 30;
const WAVE_SPEED_RANDOM = 30;
const WAVE_SPEED_PER_LEVEL = 4;
const SPAWN_MARGIN = 20;

const PARTICLE_LIFETIME = 1;
const PARTICLE_MIN_SPEED = 40;
const PARTICLE_MAX_SPEED = 140;

const MAX_DELTA_SECONDS = 0.05;
const BLINK_INTERVAL_MS = 60;

const FPS_GRAPH_CAP = 90;
const FPS_SMOOTH_THRESHOLD = 50;
const FPS_REGULAR_THRESHOLD = 30;
const FPS_HISTORY_LIMIT = 90;

const DEFAULT_PLAYER_NAME = "Jugador";

const COLOR_BACKGROUND = "#05060a";
const COLOR_ASTEROID = "#8b8f99";
const COLOR_BULLET = "#2bb7a9";
const COLOR_PLAYER = "#edeae4";
const COLOR_THRUST = "#e8a33d";
const COLOR_HIT = "#d9524f";
  module.exports = { WORLD_WIDTH, WORLD_HEIGHT, PLAYER_TURN_RATE, PLAYER_ACCELERATION, PLAYER_FRICTION, PLAYER_MAX_SPEED, PLAYER_RADIUS, SHOOT_COOLDOWN, BULLET_SPEED, BULLET_RADIUS, BULLET_LIFETIME, ASTEROID_SIDES, ASTEROID_RADIUS, ASTEROID_SCORE, FRAGMENTS_ON_BREAK, FRAGMENT_MIN_SPEED, FRAGMENT_MAX_SPEED, STARTING_LIVES, GAME_MODES, INVINCIBLE_TIME, BASE_WAVE_SIZE, WAVE_MIN_SPEED, WAVE_SPEED_RANDOM, WAVE_SPEED_PER_LEVEL, SPAWN_MARGIN, PARTICLE_LIFETIME, PARTICLE_MIN_SPEED, PARTICLE_MAX_SPEED, MAX_DELTA_SECONDS, BLINK_INTERVAL_MS, FPS_GRAPH_CAP, FPS_SMOOTH_THRESHOLD, FPS_REGULAR_THRESHOLD, FPS_HISTORY_LIMIT, DEFAULT_PLAYER_NAME, COLOR_BACKGROUND, COLOR_ASTEROID, COLOR_BULLET, COLOR_PLAYER, COLOR_THRUST, COLOR_HIT };

  };
  __modules["engine/renderer.js"] = function (exports, module, __require) {
const { WORLD_WIDTH, WORLD_HEIGHT, COLOR_BACKGROUND } = __require("constants.js");

const STAR_COUNT = 120;

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.stars = this.buildStars();
  }

  buildStars() {
    const stars = [];
    for (let index = 0; index < STAR_COUNT; index++) {
      stars.push({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT,
        size: 0.6 + Math.random() * 0.9,
        alpha: 0.18 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return stars;
  }

  clear() {
    const context = this.context;
    context.fillStyle = COLOR_BACKGROUND;
    context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.drawStars(context);
  }

  drawStars(context) {
    const now = performance.now();
    for (const star of this.stars) {
      const twinkle = 0.7 + 0.3 * Math.sin(now / 500 + star.phase);
      context.fillStyle = `rgba(255, 255, 255, ${(star.alpha * twinkle).toFixed(3)})`;
      context.fillRect(star.x, star.y, star.size, star.size);
    }
  }
}
  module.exports = { Renderer };

  };
  __modules["engine/game-loop.js"] = function (exports, module, __require) {
class GameLoop {
  constructor(runner, monitor, timeManager) {
    this.runner = runner;
    this.monitor = monitor;
    this.timeManager = timeManager;
    this.running = false;
    this.animationId = null;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.requestFrame();
  }

  stop() {
    this.running = false;
    if (this.animationId !== null) cancelAnimationFrame(this.animationId);
    this.animationId = null;
  }

  requestFrame() {
    this.animationId = requestAnimationFrame((timestamp) => this.frame(timestamp));
  }

  frame(timestamp) {
    if (!this.running) return;
    try {
      const deltaSeconds = this.timeManager.calculateDelta(timestamp);
      const fps = this.monitor.record(timestamp);
      this.runner.update(deltaSeconds, fps);
      this.runner.render();
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      if (this.lastError !== message) {
        this.lastError = message;
        console.error("Error en el bucle de juego:", error);
      }
    } finally {
      this.requestFrame();
    }
  }
}
  module.exports = { GameLoop };

  };
  __modules["engine/time-manager.js"] = function (exports, module, __require) {
const { MAX_DELTA_SECONDS } = __require("constants.js");

class TimeManager {
  constructor() {
    this.previousTimestamp = null;
  }

  reset() {
    this.previousTimestamp = null;
  }

  calculateDelta(timestamp) {
    if (this.previousTimestamp === null) {
      this.previousTimestamp = timestamp;
      return 0;
    }
    const deltaSeconds = (timestamp - this.previousTimestamp) / 1000;
    this.previousTimestamp = timestamp;
    return Math.min(deltaSeconds, MAX_DELTA_SECONDS);
  }
}
  module.exports = { TimeManager };

  };
  __modules["fps/fps-monitor.js"] = function (exports, module, __require) {
const { FPS_HISTORY_LIMIT } = __require("constants.js");

class FpsMonitor {
  constructor() {
    this.history = [];
    this.lastTimestamp = null;
    this.totalFrames = 0;
    this.minFps = null;
    this.maxFps = null;
    this.lastFrameTime = 0;
    this.lastWorkload = 0;
    this.lastEntities = 0;
  }

  reset() {
    this.history.length = 0;
    this.totalFrames = 0;
    this.minFps = null;
    this.maxFps = null;
    this.lastTimestamp = null;
    this.lastFrameTime = 0;
    this.lastWorkload = 0;
    this.lastEntities = 0;
  }

  record(timestamp) {
    this.totalFrames += 1;
    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp;
      return null;
    }
    const frameTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    if (frameTime <= 0) return null;
    const fps = 1000 / frameTime;
    this.pushHistory(fps);
    this.updateExtremes(fps);
    this.lastFrameTime = frameTime;
    return fps;
  }

  pushHistory(fps) {
    this.history.push(fps);
    if (this.history.length > FPS_HISTORY_LIMIT) this.history.shift();
  }

  updateExtremes(fps) {
    if (this.minFps === null || fps < this.minFps) this.minFps = fps;
    if (this.maxFps === null || fps > this.maxFps) this.maxFps = fps;
  }

  recordWorkload(pairs) {
    this.lastWorkload = pairs;
  }

  recordEntities(count) {
    this.lastEntities = count;
  }

  average() {
    if (this.history.length === 0) return 0;
    let sum = 0;
    for (const fps of this.history) sum += fps;
    return sum / this.history.length;
  }
}
  module.exports = { FpsMonitor };

  };
  __modules["utils/dom-utils.js"] = function (exports, module, __require) {
function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Elemento no encontrado: #${id}`);
  }
  return element;
}
  module.exports = { getElement };

  };
  __modules["fps/fps-classifier.js"] = function (exports, module, __require) {
const { FPS_SMOOTH_THRESHOLD, FPS_REGULAR_THRESHOLD } = __require("constants.js");

function classifyFps(fps) {
  if (fps >= FPS_SMOOTH_THRESHOLD) return { label: "FLUIDO", cssClass: "is-fluid" };
  if (fps >= FPS_REGULAR_THRESHOLD) return { label: "REGULAR", cssClass: "is-regular" };
  return { label: "DEFICIENTE", cssClass: "is-poor" };
}
  module.exports = { classifyFps };

  };
  __modules["fps/telemetry-panel.js"] = function (exports, module, __require) {
const { getElement } = __require("utils/dom-utils.js");
const { classifyFps } = __require("fps/fps-classifier.js");
const { FPS_GRAPH_CAP, FPS_HISTORY_LIMIT } = __require("constants.js");

class TelemetryPanel {
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
  module.exports = { TelemetryPanel };

  };
  __modules["scenes/scene-runner.js"] = function (exports, module, __require) {
class SceneRunner {
  constructor() {
    this.scenes = new Map();
    this.currentScene = null;
    this.payload = null;
  }

  registerScene(name, scene) {
    this.scenes.set(name, scene);
  }

  changeScene(name, payload = null) {
    const nextScene = this.scenes.get(name);
    if (!nextScene) return;
    if (this.currentScene && typeof this.currentScene.exit === "function") {
      this.currentScene.exit();
    }
    this.payload = payload;
    nextScene.enter(payload);
    this.currentScene = nextScene;
  }

  update(deltaSeconds, fps) {
    if (this.currentScene) this.currentScene.update(deltaSeconds, fps);
  }

  render() {
    if (this.currentScene && typeof this.currentScene.render === "function") {
      this.currentScene.render();
    }
  }
}
  module.exports = { SceneRunner };

  };
  __modules["scenes/menu-scene.js"] = function (exports, module, __require) {
const { getElement } = __require("utils/dom-utils.js");
const { DEFAULT_PLAYER_NAME, GAME_MODES } = __require("constants.js");

class MenuScene {
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
  module.exports = { MenuScene };

  };
  __modules["utils/vector2.js"] = function (exports, module, __require) {
class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  multiplyScalar(factor) {
    return new Vector2(this.x * factor, this.y * factor);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalized(targetMagnitude) {
    const current = this.magnitude();
    if (current === 0) return new Vector2(0, 0);
    return this.multiplyScalar(targetMagnitude / current);
  }
}
  module.exports = { Vector2 };

  };
  __modules["utils/math-utils.js"] = function (exports, module, __require) {
const { WORLD_WIDTH, WORLD_HEIGHT } = __require("constants.js");

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function randomAngle() {
  return Math.random() * Math.PI * 2;
}

function distanceBetween(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function wrapPosition(position) {
  position.x = wrapAxis(position.x, WORLD_WIDTH);
  position.y = wrapAxis(position.y, WORLD_HEIGHT);
}

function wrapAxis(value, size) {
  return ((value % size) + size) % size;
}
  module.exports = { clamp, randomRange, randomAngle, distanceBetween, wrapPosition };

  };
  __modules["entities/player.js"] = function (exports, module, __require) {
const { Vector2 } = __require("utils/vector2.js");
const { wrapPosition } = __require("utils/math-utils.js");
const { PLAYER_TURN_RATE, PLAYER_ACCELERATION, PLAYER_FRICTION, PLAYER_MAX_SPEED, WORLD_WIDTH, WORLD_HEIGHT, COLOR_PLAYER, COLOR_THRUST, COLOR_BULLET, BLINK_INTERVAL_MS } = __require("constants.js");

class Player {
  constructor() {
    this.position = new Vector2(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
    this.velocity = new Vector2(0, 0);
    this.angle = -Math.PI / 2;
    this.turnDirection = 0;
    this.accelerating = false;
    this.invincibleTime = 0;
    this.shootCooldown = 0;
  }

  update(deltaSeconds) {
    this.angle += this.turnDirection * PLAYER_TURN_RATE * deltaSeconds;
    this.applyThrust(deltaSeconds);
    this.applyFrictionAndSpeedCap();
    this.position = this.position.add(this.velocity.multiplyScalar(deltaSeconds));
    wrapPosition(this.position);
    this.decreaseTimers(deltaSeconds);
  }

  applyThrust(deltaSeconds) {
    if (!this.accelerating) return;
    const thrust = new Vector2(Math.cos(this.angle), Math.sin(this.angle))
      .multiplyScalar(PLAYER_ACCELERATION * deltaSeconds);
    this.velocity = this.velocity.add(thrust);
  }

  applyFrictionAndSpeedCap() {
    this.velocity = this.velocity.multiplyScalar(PLAYER_FRICTION);
    if (this.velocity.magnitude() > PLAYER_MAX_SPEED) {
      this.velocity = this.velocity.normalized(PLAYER_MAX_SPEED);
    }
  }

  decreaseTimers(deltaSeconds) {
    if (this.invincibleTime > 0) this.invincibleTime -= deltaSeconds;
    if (this.shootCooldown > 0) this.shootCooldown -= deltaSeconds;
  }

  render(context) {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle);
    context.globalAlpha = this.getAlpha();
    if (this.accelerating) this.renderThrust(context);
    context.beginPath();
    context.moveTo(16, 0);
    context.lineTo(-9, 9);
    context.lineTo(-5, 3);
    context.lineTo(-5, -3);
    context.lineTo(-9, -9);
    context.closePath();
    context.strokeStyle = COLOR_PLAYER;
    context.lineWidth = 1.6;
    context.stroke();
    context.beginPath();
    context.moveTo(16, 0);
    context.lineTo(-4, 2.6);
    context.lineTo(-4, -2.6);
    context.closePath();
    context.fillStyle = "rgba(237, 234, 228, 0.16)";
    context.fill();
    context.beginPath();
    context.arc(3, 0, 2.7, 0, Math.PI * 2);
    context.fillStyle = COLOR_BULLET;
    context.fill();
    context.restore();
    context.globalAlpha = 1;
  }

  renderThrust(context) {
    context.beginPath();
    context.moveTo(-5.5, 4.5);
    context.lineTo(-17 - Math.random() * 7, 0);
    context.lineTo(-5.5, -4.5);
    context.closePath();
    context.fillStyle = COLOR_THRUST;
    context.fill();
    context.beginPath();
    context.moveTo(-5, 2.6);
    context.lineTo(-11 - Math.random() * 4, 0);
    context.lineTo(-5, -2.6);
    context.closePath();
    context.fillStyle = "#ffd37a";
    context.fill();
  }

  getAlpha() {
    if (this.invincibleTime <= 0) return 1;
    return Math.sin(performance.now() / BLINK_INTERVAL_MS) > 0 ? 0.35 : 1;
  }
}
  module.exports = { Player };

  };
  __modules["entities/bullet.js"] = function (exports, module, __require) {
const { Vector2 } = __require("utils/vector2.js");
const { wrapPosition } = __require("utils/math-utils.js");
const { BULLET_SPEED, BULLET_RADIUS, BULLET_LIFETIME, PLAYER_RADIUS, COLOR_BULLET } = __require("constants.js");

class Bullet {
  constructor(shipPosition, angle) {
    const offset = new Vector2(Math.cos(angle), Math.sin(angle)).multiplyScalar(PLAYER_RADIUS + 4);
    this.position = shipPosition.add(offset);
    this.velocity = new Vector2(Math.cos(angle), Math.sin(angle)).multiplyScalar(BULLET_SPEED);
    this.lifetime = BULLET_LIFETIME;
    this.radius = BULLET_RADIUS;
  }

  update(deltaSeconds) {
    this.position = this.position.add(this.velocity.multiplyScalar(deltaSeconds));
    wrapPosition(this.position);
    this.lifetime -= deltaSeconds;
  }

  isAlive() {
    return this.lifetime > 0;
  }

  render(context) {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius * 3, 0, Math.PI * 2);
    context.fillStyle = COLOR_BULLET;
    context.globalAlpha = 0.18;
    context.fill();
    context.globalAlpha = 0.45;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius * 1.5, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;
    context.fillStyle = "#eafffb";
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius * 0.8, 0, Math.PI * 2);
    context.fill();
  }
}
  module.exports = { Bullet };

  };
  __modules["entities/particle.js"] = function (exports, module, __require) {
const { Vector2 } = __require("utils/vector2.js");
const { randomAngle, randomRange } = __require("utils/math-utils.js");
const { PARTICLE_LIFETIME, PARTICLE_MIN_SPEED, PARTICLE_MAX_SPEED } = __require("constants.js");

class Particle {
  constructor(position, color) {
    this.position = new Vector2(position.x, position.y);
    this.velocity = this.createVelocity();
    this.color = color;
    this.lifetime = PARTICLE_LIFETIME;
    this.radius = 2;
  }

  createVelocity() {
    const heading = randomAngle();
    const speed = randomRange(PARTICLE_MIN_SPEED, PARTICLE_MAX_SPEED);
    return new Vector2(Math.cos(heading), Math.sin(heading)).multiplyScalar(speed);
  }

  update(deltaSeconds) {
    this.position = this.position.add(this.velocity.multiplyScalar(deltaSeconds));
    this.lifetime -= deltaSeconds * 1.4;
  }

  isAlive() {
    return this.lifetime > 0;
  }

  render(context) {
    context.globalAlpha = Math.max(this.lifetime, 0);
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.globalAlpha = 1;
  }
}
  module.exports = { Particle };

  };
  __modules["input/shooter-input.js"] = function (exports, module, __require) {
class ShooterInput {
  constructor(keys, touch) {
    this.keys = keys;
    this.touch = touch;
  }

  isThrusting() {
    return this.acceleratingWithKeyboard() || this.touch.thrust;
  }

  getTurn() {
    let direction = this.touch.turn;
    if (this.turningLeft()) direction -= 1;
    if (this.turningRight()) direction += 1;
    return direction;
  }

  wantsToFire() {
    return this.keys.isDown("Space") || this.touch.firePressed;
  }

  acceleratingWithKeyboard() {
    return this.keys.isDown("ArrowUp") || this.keys.isDown("KeyW");
  }

  turningLeft() {
    return this.keys.isDown("ArrowLeft") || this.keys.isDown("KeyA");
  }

  turningRight() {
    return this.keys.isDown("ArrowRight") || this.keys.isDown("KeyD");
  }
}
  module.exports = { ShooterInput };

  };
  __modules["engine/collisions.js"] = function (exports, module, __require) {
const { distanceBetween } = __require("utils/math-utils.js");
const { PLAYER_RADIUS } = __require("constants.js");

function hitAsteroidsByBullets(asteroids, bullets, onHit) {
  for (let bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex--) {
    const bullet = bullets[bulletIndex];
    const asteroidIndex = findAsteroidIndex(asteroids, bullet);
    if (asteroidIndex === -1) continue;
    onHit(asteroidIndex);
    bullets.splice(bulletIndex, 1);
  }
}

function findShipCollision(asteroids, ship) {
  for (const asteroid of asteroids) {
    if (distanceBetween(asteroid.position, ship.position) < asteroid.radius + PLAYER_RADIUS) {
      return asteroid;
    }
  }
  return null;
}

function findAsteroidIndex(asteroids, bullet) {
  for (let index = 0; index < asteroids.length; index++) {
    const asteroid = asteroids[index];
    if (distanceBetween(asteroid.position, bullet.position) < asteroid.radius + bullet.radius) {
      return index;
    }
  }
  return -1;
}
  module.exports = { hitAsteroidsByBullets, findShipCollision };

  };
  __modules["entities/asteroid.js"] = function (exports, module, __require) {
const { wrapPosition } = __require("utils/math-utils.js");
const { randomAngle, randomRange } = __require("utils/math-utils.js");
const { ASTEROID_RADIUS, ASTEROID_SIDES, COLOR_ASTEROID } = __require("constants.js");

const MAX_SPIN = 0.7;
const SHAPE_MIN = 0.75;
const SHAPE_MAX = 1.25;

class Asteroid {
  constructor(position, velocity, size) {
    this.position = position;
    this.velocity = velocity;
    this.size = size;
    this.radius = ASTEROID_RADIUS[size];
    this.angle = randomAngle();
    this.spin = (Math.random() - 0.5) * MAX_SPIN;
    this.vertices = this.buildShape();
  }

  buildShape() {
    const vertices = [];
    if (ASTEROID_SIDES > 0) {
      for (let index = 0; index < ASTEROID_SIDES; index++) {
        const vertexAngle = (index / ASTEROID_SIDES) * Math.PI * 2;
        const vertexRadius = this.radius * randomRange(SHAPE_MIN, SHAPE_MAX);
        vertices.push({ angle: vertexAngle, radius: vertexRadius });
      }
    }
    return vertices;
  }

  update(deltaSeconds) {
    this.position = this.position.add(this.velocity.multiplyScalar(deltaSeconds));
    wrapPosition(this.position);
    this.angle += this.spin * deltaSeconds;
  }

  render(context) {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle);
    context.beginPath();
    this.traceShape(context);
    context.fillStyle = "rgba(139, 143, 153, 0.08)";
    context.fill();
    context.strokeStyle = COLOR_ASTEROID;
    context.lineWidth = 1.4;
    context.stroke();
    context.beginPath();
    this.traceInnerShape(context);
    context.globalAlpha = 0.4;
    context.lineWidth = 1;
    context.stroke();
    context.restore();
  }

  traceInnerShape(context) {
    let first = true;
    for (const vertex of this.vertices) {
      const x = Math.cos(vertex.angle) * (vertex.radius * 0.55 + 1.5) + 1.4;
      const y = Math.sin(vertex.angle) * (vertex.radius * 0.55 - 0.8);
      if (first) {
        context.moveTo(x, y);
        first = false;
      } else {
        context.lineTo(x, y);
      }
    }
    context.closePath();
  }

  traceShape(context) {
    let first = true;
    for (const vertex of this.vertices) {
      const x = Math.cos(vertex.angle) * vertex.radius;
      const y = Math.sin(vertex.angle) * vertex.radius;
      if (first) {
        context.moveTo(x, y);
        first = false;
      } else {
        context.lineTo(x, y);
      }
    }
    context.closePath();
  }
}
  module.exports = { Asteroid };

  };
  __modules["modules/wave-spawner.js"] = function (exports, module, __require) {
const { Asteroid } = __require("entities/asteroid.js");
const { Vector2 } = __require("utils/vector2.js");
const { randomAngle, randomRange } = __require("utils/math-utils.js");
const { WORLD_WIDTH, WORLD_HEIGHT, SPAWN_MARGIN, BASE_WAVE_SIZE, WAVE_MIN_SPEED, WAVE_SPEED_RANDOM, WAVE_SPEED_PER_LEVEL, FRAGMENT_MIN_SPEED, FRAGMENT_MAX_SPEED } = __require("constants.js");

function createWaveAsteroids(waveNumber, speedBonus = 0) {
  const count = BASE_WAVE_SIZE + waveNumber;
  const asteroids = [];
  for (let index = 0; index < count; index++) {
    asteroids.push(createEdgeAsteroid(waveNumber, speedBonus));
  }
  return asteroids;
}

function createFragmentAsteroid(position, size) {
  return createAsteroidWithSpeed(
    position,
    randomRange(FRAGMENT_MIN_SPEED, FRAGMENT_MAX_SPEED),
    size,
  );
}

function createEdgeAsteroid(waveNumber, speedBonus) {
  const speed =
    WAVE_MIN_SPEED +
    Math.random() * WAVE_SPEED_RANDOM +
    waveNumber * WAVE_SPEED_PER_LEVEL +
    speedBonus;
  return createAsteroidWithSpeed(pickEdgePosition(), speed, "large");
}

function createAsteroidWithSpeed(position, speed, size) {
  const heading = randomAngle();
  const velocity = new Vector2(Math.cos(heading), Math.sin(heading)).multiplyScalar(speed);
  return new Asteroid(new Vector2(position.x, position.y), velocity, size);
}

function pickEdgePosition() {
  const edge = Math.floor(Math.random() * 4);
  if (edge === 0) return new Vector2(randomRange(0, WORLD_WIDTH), -SPAWN_MARGIN);
  if (edge === 1) return new Vector2(WORLD_WIDTH + SPAWN_MARGIN, randomRange(0, WORLD_HEIGHT));
  if (edge === 2) return new Vector2(randomRange(0, WORLD_WIDTH), WORLD_HEIGHT + SPAWN_MARGIN);
  return new Vector2(-SPAWN_MARGIN, randomRange(0, WORLD_HEIGHT));
}
  module.exports = { createWaveAsteroids, createFragmentAsteroid };

  };
  __modules["scenes/play-scene.js"] = function (exports, module, __require) {
const { Player } = __require("entities/player.js");
const { Bullet } = __require("entities/bullet.js");
const { Particle } = __require("entities/particle.js");
const { Vector2 } = __require("utils/vector2.js");
const { getElement } = __require("utils/dom-utils.js");
const { ShooterInput } = __require("input/shooter-input.js");
const { hitAsteroidsByBullets, findShipCollision } = __require("engine/collisions.js");
const { createWaveAsteroids, createFragmentAsteroid } = __require("modules/wave-spawner.js");
const { INVINCIBLE_TIME, WORLD_WIDTH, WORLD_HEIGHT, ASTEROID_SCORE, FRAGMENTS_ON_BREAK, GAME_MODES, COLOR_ASTEROID, COLOR_HIT } = __require("constants.js");

class PlayScene {
  constructor(renderer, runner, keys, touch, telemetry, monitor, context) {
    this.renderer = renderer;
    this.runner = runner;
    this.keys = keys;
    this.touch = touch;
    this.telemetry = telemetry;
    this.monitor = monitor;
    this.context = context;
    this.input = new ShooterInput(keys, touch);
    this.scoreEl = getElement("hud-score");
    this.livesEl = getElement("hud-lives");
    this.waveEl = getElement("hud-wave");
    this.timerBlock = getElement("hud-timer");
    this.timeEl = getElement("hud-time");
    this.modeConfig = GAME_MODES.classic;
    this.started = false;
  }

  enter(payload) {
    if (payload?.mode) this.context.mode = payload.mode;
    this.modeConfig = this.context.getModeConfig();
    if (!this.started || payload?.fresh) {
      this.reset();
      this.monitor.reset();
      this.started = true;
    }
    if (payload?.playerName) this.context.playerName = payload.playerName;
    this.keys.consumePresses();
  }

  exit() {
    this.keys.consumePresses();
  }

  reset() {
    this.player = new Player();
    this.bullets = [];
    this.asteroids = [];
    this.particles = [];
    this.score = 0;
    this.lives = this.modeConfig.lives;
    this.timeLeft = this.modeConfig.timeout;
    this.wave = 1;
    this.asteroids.push(...createWaveAsteroids(this.wave, this.modeConfig.speedBonus));
    this.syncHud();
  }

  update(deltaSeconds, fps) {
    this.readInput();
    this.player.update(deltaSeconds);
    this.updateBullets(deltaSeconds);
    this.updateAsteroids(deltaSeconds);
    this.updateParticles(deltaSeconds);
    this.detectCollisions();
    this.checkWaveCompletion();
    this.checkTimeLimit(deltaSeconds);
    this.reportTelemetry(fps);
    this.keys.consumePresses();
  }

  readInput() {
    this.player.accelerating = this.input.isThrusting();
    this.player.turnDirection = this.input.getTurn();
    if (this.keys.justPressed("KeyP")) this.runner.changeScene("pause", {});
    if (this.input.wantsToFire()) this.shoot();
  }

  shoot() {
    if (this.player.shootCooldown > 0) return;
    this.bullets.push(new Bullet(this.player.position, this.player.angle));
    this.player.shootCooldown = 0.22;
  }

  updateBullets(deltaSeconds) {
    for (const bullet of this.bullets) bullet.update(deltaSeconds);
    this.bullets = this.bullets.filter((bullet) => bullet.isAlive());
  }

  updateAsteroids(deltaSeconds) {
    for (const asteroid of this.asteroids) asteroid.update(deltaSeconds);
  }

  updateParticles(deltaSeconds) {
    for (const particle of this.particles) particle.update(deltaSeconds);
    this.particles = this.particles.filter((particle) => particle.isAlive());
  }

  detectCollisions() {
    hitAsteroidsByBullets(this.asteroids, this.bullets, (index) => this.breakAsteroidAt(index));
    this.detectShipCollision();
  }

  detectShipCollision() {
    if (this.player.invincibleTime > 0) return;
    const asteroid = findShipCollision(this.asteroids, this.player);
    if (asteroid) this.loseLife();
  }

  breakAsteroidAt(index) {
    const asteroid = this.asteroids[index];
    this.spawnParticles(asteroid.position, 10, COLOR_ASTEROID);
    this.asteroids.splice(index, 1);
    this.score += ASTEROID_SCORE[asteroid.size];
    this.spawnFragments(asteroid);
    this.syncHud();
  }

  spawnFragments(asteroid) {
    if (asteroid.size === "small") return;
    const nextSize = asteroid.size === "large" ? "medium" : "small";
    for (let count = 0; count < FRAGMENTS_ON_BREAK; count++) {
      this.asteroids.push(createFragmentAsteroid(asteroid.position, nextSize));
    }
  }

  loseLife() {
    this.spawnParticles(this.player.position, 18, COLOR_HIT);
    this.lives -= 1;
    this.syncHud();
    if (this.lives <= 0) {
      this.finishGame();
      return;
    }
    this.respawnPlayer();
  }

  respawnPlayer() {
    this.player.position = new Vector2(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
    this.player.velocity = new Vector2(0, 0);
    this.player.invincibleTime = INVINCIBLE_TIME;
  }

  finishGame() {
    this.context.setFinal(this.score, this.wave, Math.round(this.monitor.average()));
    this.runner.changeScene("game-over", {});
  }

  checkWaveCompletion() {
    if (this.asteroids.length > 0) return;
    this.wave += 1;
    this.asteroids.push(...createWaveAsteroids(this.wave, this.modeConfig.speedBonus));
    this.syncHud();
  }

  checkTimeLimit(deltaSeconds) {
    if (this.modeConfig.timeout === null) return;
    this.timeLeft = Math.max(0, this.timeLeft - deltaSeconds);
    this.syncHud();
    if (this.timeLeft <= 0) this.finishGame();
  }

  spawnParticles(position, quantity, color) {
    for (let count = 0; count < quantity; count++) {
      this.particles.push(new Particle(position, color));
    }
  }

  reportTelemetry(fps) {
    this.monitor.recordWorkload(this.countCollisionPairs());
    this.monitor.recordEntities(this.countEntities());
    this.telemetry.update(fps);
  }

  countCollisionPairs() {
    return this.asteroids.length * this.bullets.length + this.asteroids.length;
  }

  countEntities() {
    return this.asteroids.length + this.bullets.length + this.particles.length;
  }

  syncHud() {
    this.scoreEl.textContent = this.score;
    this.livesEl.textContent = Number.isFinite(this.lives) ? Math.max(this.lives, 0) : "\u221E";
    this.waveEl.textContent = this.wave;
    if (this.modeConfig.timeout === null) {
      this.timerBlock.classList.add("hidden");
    } else {
      this.timerBlock.classList.remove("hidden");
      this.timeEl.textContent = Math.ceil(this.timeLeft);
    }
  }

  render() {
    this.renderer.clear();
    this.drawEntities();
    this.player.render(this.renderer.context);
  }

  drawEntities() {
    const context = this.renderer.context;
    for (const asteroid of this.asteroids) asteroid.render(context);
    for (const bullet of this.bullets) bullet.render(context);
    for (const particle of this.particles) particle.render(context);
  }
}
  module.exports = { PlayScene };

  };
  __modules["scenes/pause-scene.js"] = function (exports, module, __require) {
const { getElement } = __require("utils/dom-utils.js");

class PauseScene {
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
  module.exports = { PauseScene };

  };
  __modules["scenes/game-over-scene.js"] = function (exports, module, __require) {
const { getElement } = __require("utils/dom-utils.js");

class GameOverScene {
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
    this.menuButton = getElement("btn-menu");
    this.menuButton.addEventListener("click", () => this.toMenu());
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

  toMenu() {
    this.runner.changeScene("menu", {});
  }

  renderSummary() {
    const final = this.context.final;
    this.summary.textContent =
      `${this.context.playerName} — modalidad ${this.context.getModeLabel()}, ` +
      `puntaje ${final.score}, oleada ${final.wave}, fps promedio ${final.fps}.`;
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
  module.exports = { GameOverScene };

  };
  __modules["input/key-input.js"] = function (exports, module, __require) {
class KeyInput {
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
  module.exports = { KeyInput };

  };
  __modules["input/touch-input.js"] = function (exports, module, __require) {
const { getElement } = __require("utils/dom-utils.js");

class TouchInput {
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
  module.exports = { TouchInput };

  };
  __modules["services/api-client.js"] = function (exports, module, __require) {
class ApiClient {
  constructor() {
    this.baseUrl = "";
  }

  async request(path, options = {}) {
    const response = await fetch(this.baseUrl + path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const body = await response.json();
    if (!body.success) throw new Error(body.message || "Error de API");
    return body.data;
  }
}
  module.exports = { ApiClient };

  };
  __modules["services/leaderboard-service.js"] = function (exports, module, __require) {
const { ApiClient } = __require("services/api-client.js");

class LeaderboardService {
  constructor() {
    this.client = new ApiClient();
  }

  async getTopScores() {
    return this.client.request("/api/scores");
  }

  async submitScore(payload) {
    return this.client.request("/api/scores", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}
  module.exports = { LeaderboardService };

  };
  __modules["services/api-state.js"] = function (exports, module, __require) {
const { getElement } = __require("utils/dom-utils.js");

class ApiState {
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
  module.exports = { ApiState };

  };
  __modules["modules/game-context.js"] = function (exports, module, __require) {
const { DEFAULT_PLAYER_NAME, GAME_MODES } = __require("constants.js");

class GameContext {
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
  module.exports = { GameContext };

  };
  __modules["main.js"] = function (exports, module, __require) {
const { Renderer } = __require("engine/renderer.js");
const { GameLoop } = __require("engine/game-loop.js");
const { TimeManager } = __require("engine/time-manager.js");
const { FpsMonitor } = __require("fps/fps-monitor.js");
const { TelemetryPanel } = __require("fps/telemetry-panel.js");
const { SceneRunner } = __require("scenes/scene-runner.js");
const { MenuScene } = __require("scenes/menu-scene.js");
const { PlayScene } = __require("scenes/play-scene.js");
const { PauseScene } = __require("scenes/pause-scene.js");
const { GameOverScene } = __require("scenes/game-over-scene.js");
const { KeyInput } = __require("input/key-input.js");
const { TouchInput } = __require("input/touch-input.js");
const { LeaderboardService } = __require("services/leaderboard-service.js");
const { ApiState } = __require("services/api-state.js");
const { GameContext } = __require("modules/game-context.js");
const { getElement } = __require("utils/dom-utils.js");

function bootstrap() {
  const renderer = new Renderer(getElement("game-canvas"));
  const timeManager = new TimeManager();
  const monitor = new FpsMonitor();
  const telemetry = new TelemetryPanel(monitor);
  const keyInput = new KeyInput();
  const touchInput = new TouchInput();
  const apiState = new ApiState();
  const leaderboardService = new LeaderboardService();
  const context = new GameContext();

  const runner = new SceneRunner();
  const menuScene = new MenuScene(runner, keyInput, leaderboardService, telemetry, apiState);
  const playScene = new PlayScene(renderer, runner, keyInput, touchInput, telemetry, monitor, context);
  const pauseScene = new PauseScene(runner, keyInput);
  const gameOverScene = new GameOverScene(runner, keyInput, leaderboardService, telemetry, apiState, context);

  runner.registerScene("menu", menuScene);
  runner.registerScene("play", playScene);
  runner.registerScene("pause", pauseScene);
  runner.registerScene("game-over", gameOverScene);
  runner.changeScene("menu");

  const gameLoop = new GameLoop(runner, monitor, timeManager);
  gameLoop.start();
}

bootstrap();
  module.exports = {  };

  };
  __require("main.js");
})();

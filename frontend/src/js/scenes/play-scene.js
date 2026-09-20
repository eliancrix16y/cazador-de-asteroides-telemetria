import { Player } from "../entities/player.js";
import { Bullet } from "../entities/bullet.js";
import { Particle } from "../entities/particle.js";
import { Vector2 } from "../utils/vector2.js";
import { getElement } from "../utils/dom-utils.js";
import { ShooterInput } from "../input/shooter-input.js";
import { hitAsteroidsByBullets, findShipCollision } from "../engine/collisions.js";
import { createWaveAsteroids, createFragmentAsteroid } from "../modules/wave-spawner.js";
import {
  STARTING_LIVES,
  INVINCIBLE_TIME,
  WORLD_WIDTH,
  WORLD_HEIGHT,
  ASTEROID_SCORE,
  FRAGMENTS_ON_BREAK,
  COLOR_ASTEROID,
  COLOR_HIT,
} from "../constants.js";

export class PlayScene {
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
    this.started = false;
  }

  enter(payload) {
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
    this.lives = STARTING_LIVES;
    this.wave = 1;
    this.asteroids.push(...createWaveAsteroids(this.wave));
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
    this.asteroids.push(...createWaveAsteroids(this.wave));
    this.syncHud();
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
    this.livesEl.textContent = Math.max(this.lives, 0);
    this.waveEl.textContent = this.wave;
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
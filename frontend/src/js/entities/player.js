import { Vector2 } from "../utils/vector2.js";
import { wrapPosition } from "../utils/math-utils.js";
import {
  PLAYER_TURN_RATE,
  PLAYER_ACCELERATION,
  PLAYER_FRICTION,
  PLAYER_MAX_SPEED,
  WORLD_WIDTH,
  WORLD_HEIGHT,
  COLOR_PLAYER,
  COLOR_THRUST,
  COLOR_BULLET,
  BLINK_INTERVAL_MS,
} from "../constants.js";

export class Player {
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
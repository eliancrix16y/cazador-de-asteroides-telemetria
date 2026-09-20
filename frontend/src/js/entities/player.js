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
    context.beginPath();
    context.moveTo(14, 0);
    context.lineTo(-10, 8);
    context.lineTo(-6, 0);
    context.lineTo(-10, -8);
    context.closePath();
    context.strokeStyle = COLOR_PLAYER;
    context.lineWidth = 1.6;
    context.stroke();
    if (this.accelerating) this.renderThrust(context);
    context.restore();
    context.globalAlpha = 1;
  }

  renderThrust(context) {
    context.beginPath();
    context.moveTo(-6, 0);
    context.lineTo(-16 - Math.random() * 6, 0);
    context.strokeStyle = COLOR_THRUST;
    context.stroke();
  }

  getAlpha() {
    if (this.invincibleTime <= 0) return 1;
    return Math.sin(performance.now() / BLINK_INTERVAL_MS) > 0 ? 0.35 : 1;
  }
}
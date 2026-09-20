import { Vector2 } from "../utils/vector2.js";
import { wrapPosition } from "../utils/math-utils.js";
import { BULLET_SPEED, BULLET_RADIUS, BULLET_LIFETIME, PLAYER_RADIUS, COLOR_BULLET } from "../constants.js";

export class Bullet {
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
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = COLOR_BULLET;
    context.fill();
  }
}
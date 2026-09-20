import { Vector2 } from "../utils/vector2.js";
import { randomAngle, randomRange } from "../utils/math-utils.js";
import { PARTICLE_LIFETIME, PARTICLE_MIN_SPEED, PARTICLE_MAX_SPEED } from "../constants.js";

export class Particle {
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
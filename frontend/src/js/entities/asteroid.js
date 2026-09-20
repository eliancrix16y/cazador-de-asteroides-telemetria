import { wrapPosition } from "../utils/math-utils.js";
import { randomAngle, randomRange } from "../utils/math-utils.js";
import { ASTEROID_RADIUS, ASTEROID_SIDES, COLOR_ASTEROID } from "../constants.js";

const MAX_SPIN = 0.7;
const SHAPE_MIN = 0.75;
const SHAPE_MAX = 1.25;

export class Asteroid {
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
    context.strokeStyle = COLOR_ASTEROID;
    context.lineWidth = 1.4;
    context.stroke();
    context.restore();
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
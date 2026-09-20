export class Vector2 {
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
export class ShooterInput {
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
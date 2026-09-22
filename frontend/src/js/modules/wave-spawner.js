import { Asteroid } from "../entities/asteroid.js";
import { Vector2 } from "../utils/vector2.js";
import { randomAngle, randomRange } from "../utils/math-utils.js";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  SPAWN_MARGIN,
  BASE_WAVE_SIZE,
  WAVE_MIN_SPEED,
  WAVE_SPEED_RANDOM,
  WAVE_SPEED_PER_LEVEL,
  FRAGMENT_MIN_SPEED,
  FRAGMENT_MAX_SPEED,
} from "../constants.js";

export function createWaveAsteroids(waveNumber, speedBonus = 0) {
  const count = BASE_WAVE_SIZE + waveNumber;
  const asteroids = [];
  for (let index = 0; index < count; index++) {
    asteroids.push(createEdgeAsteroid(waveNumber, speedBonus));
  }
  return asteroids;
}

export function createFragmentAsteroid(position, size) {
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
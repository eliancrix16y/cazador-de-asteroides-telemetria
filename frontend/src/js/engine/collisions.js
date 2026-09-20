import { distanceBetween } from "../utils/math-utils.js";
import { PLAYER_RADIUS } from "../constants.js";

export function hitAsteroidsByBullets(asteroids, bullets, onHit) {
  for (let bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex--) {
    const bullet = bullets[bulletIndex];
    const asteroidIndex = findAsteroidIndex(asteroids, bullet);
    if (asteroidIndex === -1) continue;
    onHit(asteroidIndex);
    bullets.splice(bulletIndex, 1);
  }
}

export function findShipCollision(asteroids, ship) {
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
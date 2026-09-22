export const WORLD_WIDTH = 620;
export const WORLD_HEIGHT = 460;

export const PLAYER_TURN_RATE = 3.4;
export const PLAYER_ACCELERATION = 220;
export const PLAYER_FRICTION = 0.992;
export const PLAYER_MAX_SPEED = 260;
export const PLAYER_RADIUS = 12;
export const SHOOT_COOLDOWN = 0.22;

export const BULLET_SPEED = 380;
export const BULLET_RADIUS = 2.2;
export const BULLET_LIFETIME = 1.1;

export const ASTEROID_SIDES = 9;
export const ASTEROID_RADIUS = Object.freeze({ large: 32, medium: 19, small: 10 });
export const ASTEROID_SCORE = Object.freeze({ large: 20, medium: 50, small: 100 });
export const FRAGMENTS_ON_BREAK = 2;
export const FRAGMENT_MIN_SPEED = 50;
export const FRAGMENT_MAX_SPEED = 110;

export const STARTING_LIVES = 3;
export const GAME_MODES = Object.freeze({
  classic: {
    label: "Clasico",
    lives: 3,
    timeout: null,
    speedBonus: 0,
    description: "Oleadas progresivas · 3 naves",
  },
  blitz: {
    label: "Velocidad",
    lives: Infinity,
    timeout: 45,
    speedBonus: 0,
    description: "45 segundos para el maximo puntaje",
  },
  survival: {
    label: "Supervivencia",
    lives: 1,
    timeout: null,
    speedBonus: 25,
    description: "Oleadas rapidas e infinitas · 1 nave",
  },
});
export const INVINCIBLE_TIME = 2.2;
export const BASE_WAVE_SIZE = 3;
export const WAVE_MIN_SPEED = 30;
export const WAVE_SPEED_RANDOM = 30;
export const WAVE_SPEED_PER_LEVEL = 4;
export const SPAWN_MARGIN = 20;

export const PARTICLE_LIFETIME = 1;
export const PARTICLE_MIN_SPEED = 40;
export const PARTICLE_MAX_SPEED = 140;

export const MAX_DELTA_SECONDS = 0.05;
export const BLINK_INTERVAL_MS = 60;

export const FPS_GRAPH_CAP = 90;
export const FPS_SMOOTH_THRESHOLD = 50;
export const FPS_REGULAR_THRESHOLD = 30;
export const FPS_HISTORY_LIMIT = 90;

export const DEFAULT_PLAYER_NAME = "Jugador";

export const COLOR_BACKGROUND = "#05060a";
export const COLOR_ASTEROID = "#8b8f99";
export const COLOR_BULLET = "#2bb7a9";
export const COLOR_PLAYER = "#edeae4";
export const COLOR_THRUST = "#e8a33d";
export const COLOR_HIT = "#d9524f";
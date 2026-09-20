import { Renderer } from "./engine/renderer.js";
import { GameLoop } from "./engine/game-loop.js";
import { TimeManager } from "./engine/time-manager.js";
import { FpsMonitor } from "./fps/fps-monitor.js";
import { TelemetryPanel } from "./fps/telemetry-panel.js";
import { SceneRunner } from "./scenes/scene-runner.js";
import { MenuScene } from "./scenes/menu-scene.js";
import { PlayScene } from "./scenes/play-scene.js";
import { PauseScene } from "./scenes/pause-scene.js";
import { GameOverScene } from "./scenes/game-over-scene.js";
import { KeyInput } from "./input/key-input.js";
import { TouchInput } from "./input/touch-input.js";
import { LeaderboardService } from "./services/leaderboard-service.js";
import { ApiState } from "./services/api-state.js";
import { GameContext } from "./modules/game-context.js";
import { getElement } from "./utils/dom-utils.js";

function bootstrap() {
  const renderer = new Renderer(getElement("game-canvas"));
  const timeManager = new TimeManager();
  const monitor = new FpsMonitor();
  const telemetry = new TelemetryPanel(monitor);
  const keyInput = new KeyInput();
  const touchInput = new TouchInput();
  const apiState = new ApiState();
  const leaderboardService = new LeaderboardService();
  const context = new GameContext();

  const runner = new SceneRunner();
  const menuScene = new MenuScene(runner, keyInput, leaderboardService, telemetry, apiState);
  const playScene = new PlayScene(renderer, runner, keyInput, touchInput, telemetry, monitor, context);
  const pauseScene = new PauseScene(runner, keyInput);
  const gameOverScene = new GameOverScene(runner, keyInput, leaderboardService, telemetry, apiState, context);

  runner.registerScene("menu", menuScene);
  runner.registerScene("play", playScene);
  runner.registerScene("pause", pauseScene);
  runner.registerScene("game-over", gameOverScene);
  runner.changeScene("menu");

  const gameLoop = new GameLoop(runner, monitor, timeManager);
  gameLoop.start();
}

bootstrap();
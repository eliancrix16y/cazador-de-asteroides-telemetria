export class SceneRunner {
  constructor() {
    this.scenes = new Map();
    this.currentScene = null;
    this.payload = null;
  }

  registerScene(name, scene) {
    this.scenes.set(name, scene);
  }

  changeScene(name, payload = null) {
    const nextScene = this.scenes.get(name);
    if (!nextScene) return;
    if (this.currentScene && typeof this.currentScene.exit === "function") {
      this.currentScene.exit();
    }
    this.payload = payload;
    nextScene.enter(payload);
    this.currentScene = nextScene;
  }

  update(deltaSeconds, fps) {
    if (this.currentScene) this.currentScene.update(deltaSeconds, fps);
  }

  render() {
    if (this.currentScene && typeof this.currentScene.render === "function") {
      this.currentScene.render();
    }
  }
}
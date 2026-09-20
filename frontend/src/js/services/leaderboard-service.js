import { ApiClient } from "./api-client.js";

export class LeaderboardService {
  constructor() {
    this.client = new ApiClient();
  }

  async getTopScores() {
    return this.client.request("/api/scores");
  }

  async submitScore(payload) {
    return this.client.request("/api/scores", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}
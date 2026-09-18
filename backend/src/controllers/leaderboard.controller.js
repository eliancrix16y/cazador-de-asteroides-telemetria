import { sendSuccess, sendCreated } from "../utils/response.js";

export function createLeaderboardController(service) {
  return {
    getLeaderboard: (response) => sendSuccess(response, service.getTopScores()),
    createScore: (request, response) => sendCreated(response, service.addScore(request.body)),
  };
}
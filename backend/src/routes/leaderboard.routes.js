import { createLeaderboardRepository } from "../repositories/leaderboard.repository.js";
import { createLeaderboardService } from "../services/leaderboard.service.js";
import { createLeaderboardController } from "../controllers/leaderboard.controller.js";
import { validateScorePayload } from "../middlewares/validation.js";
import { sendBadRequest } from "../utils/response.js";

export function createLeaderboardRoutes(database) {
  const controller = createLeaderboardController(
    createLeaderboardService(createLeaderboardRepository(database)),
  );

  return [
    {
      method: "GET",
      path: "/api/scores",
      handler: (request, response) => controller.getLeaderboard(response),
    },
    {
      method: "POST",
      path: "/api/scores",
      handler: (request, response) => {
        const errors = validateScorePayload(request.body);
        if (errors.length > 0) return sendBadRequest(response, errors.join(" | "));
        controller.createScore(request, response);
      },
    },
  ];
}
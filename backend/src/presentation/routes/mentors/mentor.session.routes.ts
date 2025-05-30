import { Router } from "express";
import { getSessionHistoryController, getSessionsRequestsController, getUpcomingSessionMentorController, updateSessionStatusController } from "../../controllers/mentors/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";

export const mentorSessionRouter = Router();

mentorSessionRouter.get("/:mentorId/requests", async (req, res) => getSessionsRequestsController.handle(req, res));

mentorSessionRouter.put("/:requestId/status", (req, res) => updateSessionStatusController.handle(req, res));

mentorSessionRouter.get("/:mentorId/upcoming", (req, res) => getUpcomingSessionMentorController.handle(req, res));

mentorSessionRouter.get("/session-history/:mentorId", (req, res) => getSessionHistoryController.handle(req, res));

import { Router } from "express";
import { getSessionHistoryController, getSessionsRequestsController, getUpcomingSessionMentorController, updateSessionStatusController } from "../../controllers/mentors/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";

export const mentorSessionRouter = Router();

mentorSessionRouter.get("/:mentorId/requests", verifyAccessToken, requireRole("mentor"), async (req, res) => getSessionsRequestsController.handle(req, res));

mentorSessionRouter.put("/:requestId/status", verifyAccessToken, requireRole("mentor"), (req, res) => updateSessionStatusController.handle(req, res));

mentorSessionRouter.get("/:mentorId/upcoming", verifyAccessToken, requireRole("mentor"), (req, res) => getUpcomingSessionMentorController.handle(req, res));

mentorSessionRouter.get("/:mentorId/session-history", verifyAccessToken, requireRole("mentor"), (req, res) => getSessionHistoryController.handle(req, res));

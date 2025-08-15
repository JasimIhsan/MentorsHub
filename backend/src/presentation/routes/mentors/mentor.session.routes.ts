import { Router } from "express";
import { cancelSessionByMentorController, getSessionHistoryController, getSessionsRequestsController, getUpcomingSessionMentorController, updateSessionStatusController } from "../../controllers/mentors/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";

export const mentorSessionRouter = Router();

mentorSessionRouter.get("/:mentorId/requests", verifyAccessToken, requireRole(RoleEnum.MENTOR), async (req, res, next) => getSessionsRequestsController.handle(req, res, next));

mentorSessionRouter.put("/:requestId/status", verifyAccessToken, requireRole(RoleEnum.MENTOR), (req, res, next) => updateSessionStatusController.handle(req, res, next));

mentorSessionRouter.get("/:mentorId/upcoming", verifyAccessToken, requireRole(RoleEnum.MENTOR), (req, res, next) => getUpcomingSessionMentorController.handle(req, res, next));

mentorSessionRouter.get("/:mentorId/session-history", verifyAccessToken, requireRole(RoleEnum.MENTOR), (req, res, next) => getSessionHistoryController.handle(req, res, next));

mentorSessionRouter.put("/cancel-session/:userId/:sessionId", verifyAccessToken, requireRole(RoleEnum.MENTOR), (req, res, next) => cancelSessionByMentorController.handle(req, res, next));

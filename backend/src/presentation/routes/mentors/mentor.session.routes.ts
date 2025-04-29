import { Router } from "express";
import { fetchSessionHistoryController, fetchSessionsRequestsController, fetchUpcomingSessionMentorController, updateRequestStatusController } from "../../controllers/mentors/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";

export const mentorSessionRouter = Router();

mentorSessionRouter.get("/:mentorId/requests", async (req, res) => fetchSessionsRequestsController.handle(req, res));

mentorSessionRouter.put("/:requestId/status", (req, res) => updateRequestStatusController.handle(req, res));

mentorSessionRouter.get("/upcoming/:mentorId", (req, res) => fetchUpcomingSessionMentorController.handle(req, res));

mentorSessionRouter.get("/session-history/:mentorId", (req, res) => fetchSessionHistoryController.handle(req, res));

// mentorSessionRouter.put("/start/:sessionId", async (req, res, next) => {
// 	try {
// 		await mentorSessionController.startSession(req.params.sessionId);
// 		res.status(200).json({ success: true, message: "Session started successfully" });
// 	} catch (error: any) {
// 		next(error);
// 	}
// });

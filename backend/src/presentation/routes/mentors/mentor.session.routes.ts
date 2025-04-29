import { Router } from "express";
import { fetchAllMentorsController, fetchMentorController, fetchSessionMentorController, fetchSessionsRequestsController, updateRequestStatusController } from "../../controllers/mentors/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";

export const mentorSessionRouter = Router();

mentorSessionRouter.get("/:mentorId/requests", async (req, res) => fetchSessionsRequestsController.handle(req, res));

mentorSessionRouter.put("/:requestId/status", (req, res) => updateRequestStatusController.handle(req, res));

mentorSessionRouter.get("/all/:mentorId", (req, res) => fetchSessionMentorController.handle(req, res));

// mentorSessionRouter.put("/start/:sessionId", async (req, res, next) => {
// 	try {
// 		await mentorSessionController.startSession(req.params.sessionId);
// 		res.status(200).json({ success: true, message: "Session started successfully" });
// 	} catch (error: any) {
// 		next(error);
// 	}
// });

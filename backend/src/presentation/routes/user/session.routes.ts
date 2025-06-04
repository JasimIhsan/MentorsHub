import { Request, Response, Router } from "express";
import { cancelSessionController, createSessionController, getAvailabilityController, getSessionsByUserController, paySessionController } from "../../controllers/user/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { SessionModel } from "../../../infrastructure/database/models/session/session.model";
import { requireRole } from "../../middlewares/require.role.middleware";
export const sessionRouter = Router();

sessionRouter.post("/create-session", verifyAccessToken, requireRole("mentor", "user"), (req, res) => createSessionController.handle(req, res));

sessionRouter.get("/all/:userId", verifyAccessToken, requireRole("mentor", "user"), (req, res) => getSessionsByUserController.handle(req, res));

sessionRouter.put("/pay", verifyAccessToken, requireRole("mentor", "user"), (req, res) => paySessionController.handle(req, res));

sessionRouter.put("/cancel-session", verifyAccessToken, requireRole("user"), (req: Request, res: Response) => cancelSessionController.handle(req, res));

// In mentorSessionRouter
sessionRouter.get("/:sessionId", verifyAccessToken, requireRole("mentor", "user"), async (req, res) => {
	try {
		const session = await SessionModel.findById(req.params.sessionId).populate("mentorId");
		if (!session) {
			res.status(404).json({ message: "Session not found" });
			return;
		}
		res.json({ session });
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch session" });
	}
});

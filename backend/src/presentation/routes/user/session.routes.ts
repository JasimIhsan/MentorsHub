import { Request, Response, Router } from "express";
import { cancelSessionController, createSessionController, getCreateSessionPaymentOrderController, getAvailabilityController, getSessionsByUserController, paySessionWithGatewayController, paySessionWithWalletController, verifySessionPaymentController } from "../../controllers/user/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { SessionModel } from "../../../infrastructure/database/models/session/session.model";
import { requireRole } from "../../middlewares/require.role.middleware";
import { CommonStringMessage } from "../../../shared/constants/string.messages";
export const sessionRouter = Router();

sessionRouter.post("/create-session", verifyAccessToken, requireRole("mentor", "user"), (req, res, next) => createSessionController.handle(req, res, next));

sessionRouter.get("/all/:userId", verifyAccessToken, requireRole("mentor", "user"), (req, res, next) => getSessionsByUserController.handle(req, res, next));

sessionRouter.get("/verify-payment", verifyAccessToken, requireRole("mentor", "user"), (req, res, next) => verifySessionPaymentController.handle(req, res, next));

sessionRouter.post("/create-payment-order", verifyAccessToken, requireRole("mentor", "user"), (req, res, next) => getCreateSessionPaymentOrderController().handle(req, res, next));

sessionRouter.post("/pay/wallet", verifyAccessToken, requireRole("mentor", "user"), (req, res, next) => paySessionWithWalletController.handle(req, res, next));

sessionRouter.post("/pay/gateway", verifyAccessToken, requireRole("mentor", "user"), (req, res, next) => paySessionWithGatewayController.handle(req, res, next));

sessionRouter.put("/cancel-session", verifyAccessToken, requireRole("user", "mentor"), (req, res, next) => cancelSessionController.handle(req, res, next));

// In mentorSessionRouter
sessionRouter.get("/:sessionId", verifyAccessToken, requireRole("mentor", "user"), async (req, res, next) => {
	try {
		const session = await SessionModel.findById(req.params.sessionId).populate("mentorId");
		if (!session) {
			res.status(404).json({ message: CommonStringMessage.SESSION_NOT_FOUND });
			return;
		}
		res.json({ session });
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch session" });
	}
});

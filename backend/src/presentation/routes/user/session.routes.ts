import { Router } from "express";
import {
	cancelSessionController,
	createSessionController,
	getCreateSessionPaymentOrderController,
	getSessionByUserController,
	getSessionsByUserController,
	paySessionWithGatewayController,
	paySessionWithWalletController,
	verifySessionPaymentController,
} from "../../controllers/user/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { SessionModel } from "../../../infrastructure/database/models/session/session.model";
import { requireRole } from "../../middlewares/require.role.middleware";
import { CommonStringMessage } from "../../../shared/constants/string.messages";
import { logger } from "../../../infrastructure/utils/logger";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
export const sessionRouter = Router();

sessionRouter.post("/create-session", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), (req, res, next) => createSessionController.handle(req, res, next));

sessionRouter.get("/:userId/:sessionId", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), (req, res, next) => getSessionByUserController.handle(req, res, next));

sessionRouter.get("/:userId", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), (req, res, next) => getSessionsByUserController.handle(req, res, next));

sessionRouter.get("/verify-payment", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), (req, res, next) => verifySessionPaymentController.handle(req, res, next));

sessionRouter.post("/create-payment-order", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), (req, res, next) => getCreateSessionPaymentOrderController().handle(req, res, next));

sessionRouter.post("/pay/wallet", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), (req, res, next) => paySessionWithWalletController.handle(req, res, next));

sessionRouter.post("/pay/gateway", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), (req, res, next) => paySessionWithGatewayController.handle(req, res, next));

sessionRouter.put("/cancel-session", verifyAccessToken, requireRole(RoleEnum.USER, RoleEnum.MENTOR), (req, res, next) => cancelSessionController.handle(req, res, next));

// In mentorSessionRouter
sessionRouter.get("/session/:sessionId", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), async (req, res, next) => {
	try {
		const session = await SessionModel.findById(req.params.sessionId).populate("mentorId");
		if (!session) {
			res.status(HttpStatusCode.NOT_FOUND).json({ message: CommonStringMessage.SESSION_NOT_FOUND });
			return;
		}
		res.json({ session });
	} catch (error) {
		logger.error(`❌ Error in sessionRouter: ${error}`);
		next(error);
	}
});

import { Router } from "express";
import { signupController, signinController, refreshController, forgotPasswordController, verifyResetTokenController, resetPasswordController, logoutController, sendOtpController } from "../../controllers/user/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { verifyRefreshToken } from "../../middlewares/auth.refresh.token.middleware";
import { checkUserStatusInLogin } from "../../middlewares/auth.user.status.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";

const authRouter = Router();

// Authentication Routes
authRouter.post("/register", (req, res, next) => signupController.handle(req, res, next));

authRouter.post("/login", checkUserStatusInLogin, (req, res, next) => signinController.handle(req, res, next));

authRouter.post("/refresh-token", verifyRefreshToken, (req, res, next) => refreshController.handle(req, res, next));

authRouter.post("/forgot-password", checkUserStatusInLogin, (req, res, next) => forgotPasswordController.handle(req, res, next));

authRouter.get("/verify-reset-token/:token", (req, res, next) => verifyResetTokenController.handle(req, res, next));

authRouter.post("/reset-password", (req, res, next) => resetPasswordController.handle(req, res, next));

authRouter.post("/logout", (req, res, next) => logoutController.handle(req, res, next));

authRouter.post("/send-otp", (req, res, next) => sendOtpController.handle(req, res, next));

authRouter.post("/resend-otp", (req, res, next) => sendOtpController.handle(req, res, next));

// Test Route
authRouter.get("/test", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), (req, res) => {
	res.json({ success: true, message: "Hello, authenticated user!" });
});

export default authRouter;

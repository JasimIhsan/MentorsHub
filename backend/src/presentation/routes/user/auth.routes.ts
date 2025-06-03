import { Router } from "express";
import { signupController, signinController, refreshController, forgotPasswordController, verifyResetTokenController, resetPasswordController, logoutController, sendOtpController } from "../../controllers/user/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { verifyRefreshToken } from "../../middlewares/auth.refresh.token.middleware";
import { checkUserStatus, checkUserStatusInLogin } from "../../middlewares/auth.user.status.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";

const authRouter = Router();

// Authentication Routes
authRouter.post("/register", (req, res) => signupController.handle(req, res));

authRouter.post("/login", checkUserStatusInLogin, (req, res) => signinController.handle(req, res));

authRouter.post("/refresh-token", verifyRefreshToken, (req, res) => refreshController.handle(req, res));

authRouter.post("/forgot-password", checkUserStatusInLogin, (req, res) => forgotPasswordController.handle(req, res));

authRouter.get("/verify-reset-token/:token", (req, res) => verifyResetTokenController.handle(req, res));

authRouter.post("/reset-password", (req, res) => resetPasswordController.handle(req, res));

authRouter.post("/logout", (req, res) => logoutController.handle(req, res));

authRouter.post("/send-otp", (req, res) => sendOtpController.handle(req, res));

authRouter.post("/resend-otp", (req, res) => sendOtpController.handle(req, res));

// Test Route
authRouter.get("/test", verifyAccessToken, requireRole("mentor", "user"), (req, res) => {
	res.json({ success: true, message: "Hello, authenticated user!" });
});

export default authRouter;

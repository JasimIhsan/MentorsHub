import { Router } from "express";
import { signupController, signinController, refreshController, forgotPasswordController, verifyResetTokenController, resetPasswordController, logoutController, sendOtpController } from "../../controllers/user/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { verifyRefreshToken } from "../../middlewares/auth.refresh.token.middleware";

const authRouter = Router();

// Authentication Routes
authRouter.post("/register", (req, res) => signupController.handle(req, res));
authRouter.post("/login", (req, res) => signinController.handle(req, res));
authRouter.post("/refresh-token", verifyRefreshToken, (req, res) => refreshController.handle(req, res));
authRouter.post("/forgot-password", (req, res) => forgotPasswordController.handle(req, res));
authRouter.get("/verify-reset-token/:token", (req, res) => verifyResetTokenController.handle(req, res));
authRouter.post("/reset-password", (req, res) => resetPasswordController.handle(req, res));
authRouter.post("/logout", verifyAccessToken, (req, res) => logoutController.handle(req, res));
authRouter.post("/send-otp", (req, res) => sendOtpController.handle(req, res));
authRouter.post("/resend-otp", (req, res) => sendOtpController.handle(req, res));

// Test Route
authRouter.get("/test", verifyAccessToken, (req, res) => {
	res.json({ success: true, message: "Hello, authenticated user!" });
});


export default authRouter;

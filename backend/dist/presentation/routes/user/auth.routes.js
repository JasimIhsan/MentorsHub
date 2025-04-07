"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const composer_1 = require("../../controllers/user/composer");
const auth_access_token_middleware_1 = require("../../middlewares/auth.access.token.middleware");
const auth_refresh_token_middleware_1 = require("../../middlewares/auth.refresh.token.middleware");
const auth_user_status_middleware_1 = require("../../middlewares/auth.user.status.middleware");
const authRouter = (0, express_1.Router)();
// Authentication Routes
authRouter.post("/register", (req, res) => composer_1.signupController.handle(req, res));
authRouter.post("/login", auth_user_status_middleware_1.checkUserStatusInLogin, (req, res) => composer_1.signinController.handle(req, res));
authRouter.post("/refresh-token", auth_refresh_token_middleware_1.verifyRefreshToken, (req, res) => composer_1.refreshController.handle(req, res));
authRouter.post("/forgot-password", auth_user_status_middleware_1.checkUserStatus, (req, res) => composer_1.forgotPasswordController.handle(req, res));
authRouter.get("/verify-reset-token/:token", auth_user_status_middleware_1.checkUserStatus, (req, res) => composer_1.verifyResetTokenController.handle(req, res));
authRouter.post("/reset-password", auth_user_status_middleware_1.checkUserStatus, (req, res) => composer_1.resetPasswordController.handle(req, res));
authRouter.post("/logout", auth_access_token_middleware_1.verifyAccessToken, (req, res) => composer_1.logoutController.handle(req, res));
authRouter.post("/send-otp", auth_user_status_middleware_1.checkUserStatus, (req, res) => composer_1.sendOtpController.handle(req, res));
authRouter.post("/resend-otp", auth_user_status_middleware_1.checkUserStatus, (req, res) => composer_1.sendOtpController.handle(req, res));
// Test Route
authRouter.get("/test", auth_access_token_middleware_1.verifyAccessToken, auth_user_status_middleware_1.checkUserStatus, (req, res) => {
    res.json({ success: true, message: "Hello, authenticated user!" });
});
exports.default = authRouter;

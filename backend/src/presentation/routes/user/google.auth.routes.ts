import { Request, Response, Router } from "express";
import { configurePassport } from "../../../infrastructure/auth/passport/passport.config";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { googleAuthController } from "../../controllers/user/composer";
import { checkUserStatus } from "../../middlewares/auth.user.status.middleware";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export const googleAuthRouter = Router();

// Redirect to Google
googleAuthRouter.post("/google", (req, res) => googleAuthController.handle(req, res));

// Google OAuth callback
googleAuthRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login", session: false }), (req, res) => {
	if (!req.user) {
		res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Authentication failed" });
		return;
	}
	const { user, accessToken, refreshToken } = req.user as any;
	res.redirect(`http://localhost:3000?token=${accessToken}&refresh=${refreshToken}`);
});

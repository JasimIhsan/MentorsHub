import { Request, Response, Router } from "express";
import { configurePassport } from "../../infrastructure/services/passport/passport.config";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { googleAuthController } from "../controllers";

export const googleAuthRouter = Router();

// Define user structure expected from Passport
interface CustomUser {
	user: any;
	accessToken: string;
	refreshToken: string;
}

interface AuthenticatedRequest extends Request {
	user?: CustomUser | string | JwtPayload;
}

// Redirect to Google
googleAuthRouter.post("/google", (req, res) => googleAuthController.handle(req, res));

// Google OAuth callback
googleAuthRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login", session: false }), (req, res) => {
	if (!req.user) {
		res.status(401).json({ message: "Authentication failed" });
		return;
	}
	const { user, accessToken, refreshToken } = req.user as any;
	res.redirect(`http://localhost:3000?token=${accessToken}&refresh=${refreshToken}`);
});

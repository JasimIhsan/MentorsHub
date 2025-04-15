import { Router } from "express";
import { adminLoginController } from "../../controllers/admin/composer";
import { logoutController } from "../../controllers/user/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", (req, res) => adminLoginController.handle(req, res));

adminAuthRouter.post("/logout", verifyAccessToken, (req, res) => logoutController.handle(req, res));

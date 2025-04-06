import { Router } from "express";
import { AdminLoginController } from "../../controllers/admin/admin.login.controller";
import { adminLoginController } from "../../controllers/admin/composer";
import { logoutController } from "../../controllers/user/composer";

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", (req, res) => adminLoginController.handle(req, res));
adminAuthRouter.post("/logout", (req, res) => logoutController.handle(req, res));

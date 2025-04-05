import { Router } from "express";
import { AdminLoginController } from "../../controllers/admin/admin.login.controller";
import { adminLoginController } from "../../controllers/admin/composer";

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", (req, res) => adminLoginController.handle(req, res));

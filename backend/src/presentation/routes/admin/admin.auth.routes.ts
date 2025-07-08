import { Router } from "express";
import { adminLoginController } from "../../controllers/admin/composer";
import { logoutController } from "../../controllers/user/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", (req, res, next) => adminLoginController.handle(req, res, next));

adminAuthRouter.post("/logout", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => logoutController.handle(req, res, next));

import { Router } from "express";
import { createReportController } from "../../controllers/reports/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";

export const userReportRouter = Router();

userReportRouter.post("/create", verifyAccessToken, requireRole(RoleEnum.USER, RoleEnum.MENTOR), (req, res, next) => createReportController.handle(req, res, next));

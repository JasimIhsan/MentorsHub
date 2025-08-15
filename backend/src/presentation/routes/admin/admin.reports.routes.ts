import { Router } from "express";
import { getReportsController } from "../../controllers/admin/reports/composer";
import { updateReportStatusController } from "../../controllers/reports/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";

export const adminReportRouter = Router();

adminReportRouter.get("/",verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => getReportsController.handle(req, res, next));

adminReportRouter.put("/:reportId/status",verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => updateReportStatusController.handle(req, res, next));

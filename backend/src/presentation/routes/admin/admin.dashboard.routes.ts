import { Router } from "express";
import { getAdminStatsController, getPlatformRevenueChartDataController, getTopMentorsChartDataController, getUsersGrowthChartDataController } from "../../controllers/admin/dashboard/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";

export const adminDashboardRouter = Router();

adminDashboardRouter.get("/stats/:adminId", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => getAdminStatsController.handle(req, res, next));

adminDashboardRouter.get("/revenue/:adminId",verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => getPlatformRevenueChartDataController.handle(req, res, next));

adminDashboardRouter.get("/growth/:adminId",verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => getUsersGrowthChartDataController.handle(req, res, next));

adminDashboardRouter.get("/top-mentors", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => getTopMentorsChartDataController.handle(req, res, next));

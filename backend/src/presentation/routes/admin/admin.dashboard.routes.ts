import { Router } from "express";
import { getAdminStatsController, getPlatformRevenueChartDataController } from "../../controllers/admin/dashboard/composer";

export const adminDashboardRouter = Router();

adminDashboardRouter.get("/stats/:adminId", (req, res, next) => getAdminStatsController.handle(req, res, next));

adminDashboardRouter.get("/revenue/:adminId", (req, res, next) => getPlatformRevenueChartDataController.handle(req, res, next));

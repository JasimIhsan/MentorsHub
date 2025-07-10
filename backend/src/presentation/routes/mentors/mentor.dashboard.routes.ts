import { Router } from "express";
import { getMentorStatsController, getMentorWeeklyPerformanceController, getMentorWeeklyRatingsController } from "../../controllers/mentors/dashboard/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";

export const mentorDashboardRoutes = Router();

mentorDashboardRoutes.get("/stats/:mentorId", verifyAccessToken, requireRole(RoleEnum.MENTOR), (req, res, next) => getMentorStatsController.handle(req, res, next));

mentorDashboardRoutes.get("/performance/:mentorId", verifyAccessToken, requireRole(RoleEnum.MENTOR), (req, res, next) => getMentorWeeklyPerformanceController.handle(req, res, next));

mentorDashboardRoutes.get("/ratings/:mentorId", verifyAccessToken, requireRole(RoleEnum.MENTOR), (req, res, next) => getMentorWeeklyRatingsController.handle(req, res, next));

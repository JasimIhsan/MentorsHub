import { Router } from "express";
import { getMentorStatsController, getMentorWeeklyPerformanceController } from "../../controllers/mentors/dashboard/composer";

export const mentorDashboardRoutes = Router();

mentorDashboardRoutes.get("/stats/:mentorId", (req, res, next) => getMentorStatsController.handle(req, res, next));

mentorDashboardRoutes.get("/performance/:mentorId", (req, res, next) => getMentorWeeklyPerformanceController.handle(req, res, next));

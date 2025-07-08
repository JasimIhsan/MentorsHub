import { Router } from "express";
import { getMentorStatsController, getMentorWeeklyPerformanceController, getMentorWeeklyRatingsController } from "../../controllers/mentors/dashboard/composer";
import { get } from "axios";

export const mentorDashboardRoutes = Router();

mentorDashboardRoutes.get("/stats/:mentorId", (req, res, next) => getMentorStatsController.handle(req, res, next));

mentorDashboardRoutes.get("/performance/:mentorId", (req, res, next) => getMentorWeeklyPerformanceController.handle(req, res, next));

mentorDashboardRoutes.get("/ratings/:mentorId", (req, res, next) => getMentorWeeklyRatingsController.handle(req, res, next));

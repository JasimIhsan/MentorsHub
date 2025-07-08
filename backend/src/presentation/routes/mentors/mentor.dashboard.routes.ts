import { Router } from "express";
import { getMentorStatsController } from "../../controllers/mentors/dashboard/composer";

export const mentorDashboardRoutes = Router();

mentorDashboardRoutes.get("/stats/:mentorId", (req, res, next) => getMentorStatsController.handle(req, res, next));

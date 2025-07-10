import { Router } from "express";
import { createReportController } from "../../controllers/reports/composer";

export const userReportRouter = Router();

userReportRouter.post("/create",  (req, res, next) => createReportController.handle(req, res, next));

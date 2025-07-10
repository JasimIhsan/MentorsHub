import { Router } from "express";
import { getReportsController } from "../../controllers/admin/reports/composer";

export const adminReportRouter = Router();

adminReportRouter.get("/", (req, res, next) => getReportsController.handle(req, res, next));

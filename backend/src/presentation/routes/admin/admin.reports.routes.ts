import { Router } from "express";
import { getReportsController } from "../../controllers/admin/reports/composer";
import { updateReportStatusController } from "../../controllers/reports/composer";

export const adminReportRouter = Router();

adminReportRouter.get("/", (req, res, next) => getReportsController.handle(req, res, next));

adminReportRouter.put("/:reportId/status", (req, res, next) => updateReportStatusController.handle(req, res, next));

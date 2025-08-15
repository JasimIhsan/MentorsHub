import { Router } from "express";
import { acceptRescheduleRequestController, counterRescheduleRequestController, rescheduleSessionController } from "../../controllers/reschedule-request/composer";

export const rescheduleRouter = Router();

rescheduleRouter.post("/create/:sessionId", (req, res, next) => rescheduleSessionController.handle(req, res, next));

rescheduleRouter.put("/counter/:userId/:sessionId", (req, res, next) => counterRescheduleRequestController.handle(req, res, next));

rescheduleRouter.put("/accept/:userId/:sessionId", (req, res, next) => acceptRescheduleRequestController.handle(req, res, next));
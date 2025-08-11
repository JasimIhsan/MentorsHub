import { Router } from "express";
import { getRescheduleRequestsByMentorController } from "../../controllers/mentors/composer";

export const mentorRescheduleRouter = Router();

mentorRescheduleRouter.get("/:mentorId/reschedule-requests", (req, res, next) => getRescheduleRequestsByMentorController.handle(req, res, next));

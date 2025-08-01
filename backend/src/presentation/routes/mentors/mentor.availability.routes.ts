import {Router} from "express";
import { addWeeklySlotController } from "../../controllers/mentors/availabilty/composer";


export const mentorAvailabilityRouter = Router();

mentorAvailabilityRouter.post("/create/:mentorId", (req, res, next) => addWeeklySlotController.handle(req, res, next));
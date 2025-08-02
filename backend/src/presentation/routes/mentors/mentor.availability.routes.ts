import {Router} from "express";
import { addWeeklySlotController, deleteWeeklySlotController, getAllWeeklyAvailabilityController, toggleActiveWeeklyAvailabilityController, updateWeeklySlotController } from "../../controllers/mentors/availabilty/composer";


export const mentorAvailabilityRouter = Router();

mentorAvailabilityRouter.post("/create/:mentorId", (req, res, next) => addWeeklySlotController.handle(req, res, next));

mentorAvailabilityRouter.get("/weekly/:mentorId", (req, res, next) => getAllWeeklyAvailabilityController.handle(req, res, next));

mentorAvailabilityRouter.delete("/:mentorId/:slotId", (req, res, next) => deleteWeeklySlotController.handle(req, res, next));

mentorAvailabilityRouter.put("/update/:mentorId/:slotId", (req, res, next) => updateWeeklySlotController.handle(req, res, next));

mentorAvailabilityRouter.patch("/toggle-active/:mentorId/:slotId", (req, res, next) => toggleActiveWeeklyAvailabilityController.handle(req, res, next));
import { Router } from "express";
import {
	addWeeklySlotController,
	deleteWeeklySlotController,
	getAllWeeklyAvailabilityController,
	toggleActiveWeeklyAvailabilityController,
	toggleAvailabilityByWeekDayController,
	updateWeeklySlotController,
} from "../../controllers/mentors/availabilty/weekly-slots/composer";

export const mentorAvailabilityRouter = Router();

//================= Availability by Week ================= //

mentorAvailabilityRouter.post("/create/:mentorId", (req, res, next) => addWeeklySlotController.handle(req, res, next));

mentorAvailabilityRouter.get("/weekly/:mentorId", (req, res, next) => getAllWeeklyAvailabilityController.handle(req, res, next));

mentorAvailabilityRouter.delete("/:mentorId/:slotId", (req, res, next) => deleteWeeklySlotController.handle(req, res, next));

mentorAvailabilityRouter.put("/update/:mentorId/:slotId", (req, res, next) => updateWeeklySlotController.handle(req, res, next));

mentorAvailabilityRouter.patch("/toggle-active/:mentorId/:slotId", (req, res, next) => toggleActiveWeeklyAvailabilityController.handle(req, res, next));

mentorAvailabilityRouter.patch("/toggle-weekday/:mentorId", (req, res, next) => toggleAvailabilityByWeekDayController.handle(req, res, next));

//================= Availability by Date ================= //




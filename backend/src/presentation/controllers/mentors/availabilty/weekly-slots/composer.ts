import {
	createAvailabilityToWeekUseCase,
	deleteWeeklyAvailabilityUseCase,
	getAllWeeklyAvailabilityUseCase,
	toggleActiveWeeklyAvailabilityUseCase,
	toggleAvailabilityByWeekDayUseCase,
	updateWeeklyAvailabilityUseCase,
} from "../../../../../application/usecases/mentors/availabality/weekly-slots/composer";
import { AddWeeklySlotController } from "./add.weekly.slot.controller";
import { DeleteWeeklySlotController } from "./delete.weekly.slot.controller";
import { GetAllWeeklyAvailabilityController } from "./get.all.weekly.slots.controller";
import { ToggleActiveWeeklyAvailabilityController } from "./toggle.active.weekly.slot.controller";
import { ToggleAvailabilityByWeekDayController } from "./toggle.availability.by.week.day.controller";
import { UpdateWeeklySlotController } from "./update.weekly.slot.controller";

export const addWeeklySlotController = new AddWeeklySlotController(createAvailabilityToWeekUseCase);
export const getAllWeeklyAvailabilityController = new GetAllWeeklyAvailabilityController(getAllWeeklyAvailabilityUseCase);
export const deleteWeeklySlotController = new DeleteWeeklySlotController(deleteWeeklyAvailabilityUseCase);
export const updateWeeklySlotController = new UpdateWeeklySlotController(updateWeeklyAvailabilityUseCase);
export const toggleActiveWeeklyAvailabilityController = new ToggleActiveWeeklyAvailabilityController(toggleActiveWeeklyAvailabilityUseCase);
export const toggleAvailabilityByWeekDayController = new ToggleAvailabilityByWeekDayController(toggleAvailabilityByWeekDayUseCase);
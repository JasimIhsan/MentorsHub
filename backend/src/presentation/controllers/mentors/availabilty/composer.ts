import { createAvailabilityToWeekUseCase, deleteWeeklyAvailabilityUseCase, getAllWeeklyAvailabilityUseCase, updateWeeklyAvailabilityUseCase } from "../../../../application/usecases/mentors/availabality/composer";
import { AddWeeklySlotController } from "./add.weekly.slot.controller";
import { DeleteWeeklySlotController } from "./delete.weekly.slot.controller";
import { GetAllWeeklyAvailabilityController } from "./get.all.weekly.slots.controller";
import { UpdateWeeklySlotController } from "./update.weekly.slot.controller";

export const addWeeklySlotController = new AddWeeklySlotController(createAvailabilityToWeekUseCase);
export const getAllWeeklyAvailabilityController = new GetAllWeeklyAvailabilityController(getAllWeeklyAvailabilityUseCase);
export const deleteWeeklySlotController = new DeleteWeeklySlotController(deleteWeeklyAvailabilityUseCase);
export const updateWeeklySlotController = new UpdateWeeklySlotController(updateWeeklyAvailabilityUseCase);

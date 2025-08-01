import { createAvailabilityToWeekUseCase } from "../../../../application/usecases/mentors/availabality/composer";
import { AddWeeklySlotController } from "./add.weekly.slot.controller";

export const addWeeklySlotController = new AddWeeklySlotController(createAvailabilityToWeekUseCase);

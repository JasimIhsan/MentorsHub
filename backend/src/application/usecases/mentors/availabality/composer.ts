import { WeeklyAvailabilityRepository } from "../../../../infrastructure/composer";
import { AddSlotAvailabilityToWeekUseCase } from "./add.slot.to.week.usecase";

export const createAvailabilityToWeekUseCase = new AddSlotAvailabilityToWeekUseCase(WeeklyAvailabilityRepository);

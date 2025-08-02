import { sessionRepository, weeklyAvailabilityRepository } from "../../../../infrastructure/composer";
import { AddSlotAvailabilityToWeekUseCase } from "./add.slot.to.week.usecase";
import { DeleteWeeklySlotUsecase } from "./delete.weekly.slot.usecase";
import { GetAllWeeklyAvailabilityUseCase } from "./get.available.weekly.slot.usecase";
import { ToggleAvailabilityByWeekDayUseCase } from "./toggle.availability.by.week.day.usecase";
import { ToggleAvailabilityWeeklySlotUseCase } from "./toggle.availability.weekly.slot.usecase";
import { UpdateWeeklySlotUseCase } from "./update.weekly.slot.usecase";

export const createAvailabilityToWeekUseCase = new AddSlotAvailabilityToWeekUseCase(weeklyAvailabilityRepository);
export const getAllWeeklyAvailabilityUseCase = new GetAllWeeklyAvailabilityUseCase(weeklyAvailabilityRepository);
export const deleteWeeklyAvailabilityUseCase = new DeleteWeeklySlotUsecase(weeklyAvailabilityRepository);
export const updateWeeklyAvailabilityUseCase = new UpdateWeeklySlotUseCase(weeklyAvailabilityRepository, sessionRepository);
export const toggleActiveWeeklyAvailabilityUseCase = new ToggleAvailabilityWeeklySlotUseCase(weeklyAvailabilityRepository);
export const toggleAvailabilityByWeekDayUseCase = new ToggleAvailabilityByWeekDayUseCase(weeklyAvailabilityRepository);

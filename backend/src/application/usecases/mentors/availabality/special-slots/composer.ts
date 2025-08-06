import { specialAvailabilityRepository, weeklyAvailabilityRepository } from "../../../../../infrastructure/composer";
import { AddSpecialSlotUseCase } from "./add.special.slot.usecase";
import { DeleteSpecialSlotUseCase } from "./delete.special.slot.usecase";
import { GetSpecialSlotByMentorUseCase } from "./get.special.slot.by.mentor.usecase";
import { UpdateSpecialSlotUseCase } from "./update.special.slot.usecase";

export const addSpecialSlotUseCase = new AddSpecialSlotUseCase(specialAvailabilityRepository, weeklyAvailabilityRepository);
export const getSpecialSlotByMentorUseCase = new GetSpecialSlotByMentorUseCase(specialAvailabilityRepository);
export const updateSpecialSlotUseCase = new UpdateSpecialSlotUseCase(specialAvailabilityRepository, weeklyAvailabilityRepository);
export const deleteSpecialSlotUseCase = new DeleteSpecialSlotUseCase(specialAvailabilityRepository);

import { addSpecialSlotUseCase, deleteSpecialSlotUseCase, getSpecialSlotByMentorUseCase, updateSpecialSlotUseCase } from "../../../../../application/usecases/mentors/availabality/special-slots/composer";
import { AddSpecialSlotController } from "./add.special.slot.controller";
import { DeleteSpecialSlotController } from "./delete.special.slot.controller";
import { GetSpecialSlotByMentorController } from "./get.special.slot.by.mentor.controller";
import { UpdateSpecialSlotController } from "./update.special.slot.controller";

export const addSpecialSlotController = new AddSpecialSlotController(addSpecialSlotUseCase);
export const getSpecialSlotByMentorController = new GetSpecialSlotByMentorController(getSpecialSlotByMentorUseCase);
export const updateSpecialSlotController = new UpdateSpecialSlotController(updateSpecialSlotUseCase);
export const deleteSpecialSlotController = new DeleteSpecialSlotController(deleteSpecialSlotUseCase);

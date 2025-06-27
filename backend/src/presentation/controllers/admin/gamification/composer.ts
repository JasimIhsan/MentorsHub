import { createActionTypeUseCase, getAllActionTypesUseCase } from "../../../../application/usecases/gamification/action-type/composer";
import { createGamificationTaskUseCase, deleteGamificationTaskUseCase, editGamificationTaskUseCase, getAllGamificationTasksUseCase, updateGamificationTaskStatusUseCase } from "../../../../application/usecases/gamification/composer";
import { ActionTypeController } from "./action.type.controller";
import { CreateGamificationTaskController } from "./create.gamification.task.controller";
import { DeleteGamificationTaskController } from "./delete.gamification.task.controller";
import { EditGamificationTaskController } from "./edit.gamification.task.controller";
import { GetAllGamificationTasksController } from "./get.all.gamification.task.controller";
import { UpdateGamificationTaskStatusController } from "./update.gamification.task.controller";

export const createGamificationTaskController = new CreateGamificationTaskController(createGamificationTaskUseCase);
export const getAllGamificationTasksController = new GetAllGamificationTasksController(getAllGamificationTasksUseCase);
export const actionTypeController = new ActionTypeController(getAllActionTypesUseCase, createActionTypeUseCase);
export const updateGamificationTaskStatusController = new UpdateGamificationTaskStatusController(updateGamificationTaskStatusUseCase);
export const deleteGamificationTaskController = new DeleteGamificationTaskController(deleteGamificationTaskUseCase);
export const editGamificationTaskController = new EditGamificationTaskController(editGamificationTaskUseCase);
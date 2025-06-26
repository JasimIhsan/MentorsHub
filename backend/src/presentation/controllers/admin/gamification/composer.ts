import { createActionTypeUseCase, getAllActionTypesUseCase } from "../../../../application/usecases/gamification/action-type/composer";
import { createGamificationTaskUseCase, getAllGamificationTasksUseCase } from "../../../../application/usecases/gamification/composer";
import { ActionTypeController } from "./action.type.controller";
import { CreateGamificationTaskController } from "./create.gamification.task.controller";
import { GetAllGamificationTasksController } from "./get.all.gamification.task.controller";

export const createGamificationTaskController = new CreateGamificationTaskController(createGamificationTaskUseCase);
export const getAllGamificationTasksController = new GetAllGamificationTasksController(getAllGamificationTasksUseCase);
export const actionTypeController = new ActionTypeController(getAllActionTypesUseCase, createActionTypeUseCase);

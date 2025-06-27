import { actionTypeRepository, gamificationTaskRepository } from "../../../infrastructure/composer";
import { UpdateGamificationTaskStatusUseCase } from "./action-type/update.task.status.usecase";
import { CreateGamificationTaskUseCase } from "./create.gamification.task.usecase";
import { GetAllGamificationTasksUseCase } from "./get.all.gamification.task.usecase";

export const createGamificationTaskUseCase = new CreateGamificationTaskUseCase(gamificationTaskRepository, actionTypeRepository);
export const getAllGamificationTasksUseCase = new GetAllGamificationTasksUseCase(gamificationTaskRepository);
export const updateGamificationTaskStatusUseCase = new UpdateGamificationTaskStatusUseCase(gamificationTaskRepository);

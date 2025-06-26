import { actionTypeRepository, gamificationTaskRepository } from "../../../infrastructure/composer";
import { CreateGamificationTaskUseCase } from "./create.gamification.task.usecase";
import { GetAllGamificationTasksUseCase } from "./get.all.gamification.task.usecase";

export const createGamificationTaskUseCase = new CreateGamificationTaskUseCase(gamificationTaskRepository, actionTypeRepository);
export const getAllGamificationTasksUseCase = new GetAllGamificationTasksUseCase(gamificationTaskRepository);
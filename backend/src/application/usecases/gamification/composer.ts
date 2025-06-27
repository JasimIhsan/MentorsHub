import { actionTypeRepository, gamificationTaskRepository, userProgressRepository, userTaskprogressRepository } from "../../../infrastructure/composer";
import { UpdateGamificationTaskStatusUseCase } from "./update.gamification.task.status.usecase";
import { CreateGamificationTaskUseCase } from "./create.gamification.task.usecase";
import { GetAllGamificationTasksUseCase } from "./get.all.gamification.task.usecase";
import { DeleteGamificationTaskUseCase } from "./delete.gamification.task.usecase";
import { EditGamificationTaskUseCase } from "./edit.gamification.task.usecase";
import { GetAllListedGamificationTasksUseCase } from "./get.all.listed.gamification.task.usecase";

export const createGamificationTaskUseCase = new CreateGamificationTaskUseCase(gamificationTaskRepository, actionTypeRepository);
export const getAllGamificationTasksUseCase = new GetAllGamificationTasksUseCase(gamificationTaskRepository);
export const updateGamificationTaskStatusUseCase = new UpdateGamificationTaskStatusUseCase(gamificationTaskRepository);
export const deleteGamificationTaskUseCase = new DeleteGamificationTaskUseCase(gamificationTaskRepository);
export const editGamificationTaskUseCase = new EditGamificationTaskUseCase(gamificationTaskRepository, actionTypeRepository);
export const getAllListedGamificationTasksUseCase = new GetAllListedGamificationTasksUseCase(gamificationTaskRepository, userTaskprogressRepository);

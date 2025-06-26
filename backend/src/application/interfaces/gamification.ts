import { GamificationTaskEntity } from "../../domain/entities/gamification/gamification.task.entity";
import { IGamificationTaskDTO } from "../dtos/gamification.dto";

export interface ICreateGamificationTaskUseCase {
	execute(input: { title: string; xpReward: number; targetCount: number; actionType: string }): Promise<GamificationTaskEntity>;
}

export interface IGetAllGamificationTasksUseCase {
	execute(params: { page?: number; limit?: number; actionType?: string }): Promise<IGamificationTaskDTO[]>;
}

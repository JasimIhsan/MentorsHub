import { GamificationTaskEntity } from "../../domain/entities/gamification/gamification.task.entity";
import { IGamificationTaskDTO, IUserProgressDTO, IUserTaskWithProgressDTO } from "../dtos/gamification.dto";

export interface ICreateGamificationTaskUseCase {
	execute(input: { title: string; xpReward: number; targetCount: number; actionType: string }): Promise<GamificationTaskEntity>;
}

export interface IGetAllGamificationTasksUseCase {
	execute(params: { page?: number; limit?: number; actionType?: string }): Promise<IGamificationTaskDTO[]>;
}

export interface IUpdateGamificationTaskStatusUseCase {
	execute(taskId: string, status: boolean): Promise<IGamificationTaskDTO>;
}

export interface IDeleteGamificationTaskUseCase {
	execute(taskId: string): Promise<void>;
}

export interface IEditGamificationTaskUseCase {
	execute(input: { taskId: string; title: string; xpReward: number; targetCount: number; actionType: string }): Promise<IGamificationTaskDTO>;
}

export interface IGetAllListedGamificationTasksUseCase {
	execute(userId: string, params: { page?: number; limit?: number; searchTerm?: string }): Promise<{ tasks: IUserTaskWithProgressDTO[]; totalCount: number }>;
}

export interface IGetUserProgressUseCase {
	execute(userId: string): Promise<IUserProgressDTO>;
}

export interface ICreateUserProgressUseCase {
	execute(userId: string): Promise<void>;
}

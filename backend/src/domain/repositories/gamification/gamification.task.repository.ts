import { GamificationTaskEntity } from "../../entities/gamification/gamification.task.entity";

export interface IGamificationTaskRepository {
	save(task: GamificationTaskEntity): Promise<GamificationTaskEntity>;
	findById(taskId: string): Promise<GamificationTaskEntity | null>;
	findAll(params: { page?: number; limit?: number; actionType?: string }): Promise<GamificationTaskEntity[]>;
	findAllListed(params: { page?: number; limit?: number; searchTerm?: string }): Promise<{ tasks: GamificationTaskEntity[]; totalCount: number }>;
	findByActionType(actionType: string): Promise<GamificationTaskEntity[]>;
	deleteById(taskId: string): Promise<void>;
	update(task: GamificationTaskEntity): Promise<GamificationTaskEntity | null>;
}

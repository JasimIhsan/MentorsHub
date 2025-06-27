import { GamificationTaskEntity } from "../../entities/gamification/gamification.task.entity";

export interface IGamificationTaskRepository {
	save(task: GamificationTaskEntity): Promise<GamificationTaskEntity>;
	findById(taskId: string): Promise<GamificationTaskEntity | null>;
	findAll(params: { page?: number; limit?: number; actionType?: string }): Promise<GamificationTaskEntity[]>;
	findByActionType(actionType: string): Promise<GamificationTaskEntity[]>;
	deleteById(taskId: string): Promise<void>;
}

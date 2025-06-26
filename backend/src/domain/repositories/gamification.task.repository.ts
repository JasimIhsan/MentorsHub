import { GamificationTaskEntity } from "../entities/gamification.task.entity";

export interface IGamificationTaskRepository {
	save(task: GamificationTaskEntity): Promise<void>;
	findById(taskId: string): Promise<GamificationTaskEntity | null>;
	findAll(): Promise<GamificationTaskEntity[]>;
	findByActionType(actionType: string): Promise<GamificationTaskEntity[]>;
}

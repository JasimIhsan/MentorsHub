import { UserTaskProgressEntity } from "../../entities/gamification/user.task.progress.entity";

export interface IUserTaskProgressRepository {
	find(userId: string, taskId: string): Promise<UserTaskProgressEntity | null>;
	save(progress: UserTaskProgressEntity): Promise<void>;
	findAllByUser(userId: string): Promise<UserTaskProgressEntity[]>;
}

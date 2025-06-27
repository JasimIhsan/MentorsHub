import { UserTaskProgressEntity } from "../../entities/gamification/user.task.progress.entity";

export interface IUserTaskProgressRepository {
	findByUserAndTask(userId: string, taskId: string): Promise<UserTaskProgressEntity | null>;
	save(progress: UserTaskProgressEntity): Promise<void>;
}

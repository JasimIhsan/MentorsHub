import { UserTaskProgressEntity } from "../../../../domain/entities/gamification/user.task.progress.entity";
import { IUserTaskProgressRepository } from "../../../../domain/repositories/gamification/user.task.progress.repository";
import { UserTaskProgressModel } from "../../models/gamification/user.task.progress.model";


export class UserTaskProgressRepositoryImpl implements IUserTaskProgressRepository {
	async find(userId: string, taskId: string): Promise<UserTaskProgressEntity | null> {
		const progress = await UserTaskProgressModel.findOne({ userId, taskId });
		if (!progress) return null;

		return new UserTaskProgressEntity(progress.userId, progress.taskId, progress.currentCount, progress.completed);
	}

	async save(progress: UserTaskProgressEntity): Promise<void> {
		await UserTaskProgressModel.updateOne(
			{ userId: progress.userId, taskId: progress.taskId },
			{
				currentCount: progress.currentCount,
				completed: progress.completed,
			},
			{ upsert: true }
		);
	}

	async findAllByUser(userId: string): Promise<UserTaskProgressEntity[]> {
		const progresses = await UserTaskProgressModel.find({ userId });
		return progresses.map((p) => new UserTaskProgressEntity(p.userId, p.taskId, p.currentCount, p.completed));
	}
}

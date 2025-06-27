import { UserProgressEntity } from "../../../../domain/entities/gamification/user.progress.entity";
import { IUserProgressRepository } from "../../../../domain/repositories/gamification/user.progress.repository";
import { UserProgressModel } from "../../models/gamification/user.progress.model";

export class UserProgressRepositoryImpl implements IUserProgressRepository {
	async findByUserId(userId: string): Promise<UserProgressEntity | null> {
		try {
			const doc = await UserProgressModel.findOne({ userId });
			if (!doc) return null;

			return new UserProgressEntity(doc.userId.toString(), doc.totalXP, doc.level, doc.tasksCompleted, doc.xpToNextLevel);
		} catch (error) {
			throw new Error(`Error in findByUserId(): ${error}`);
		}
	}

	async save(progress: UserProgressEntity): Promise<void> {
		try {
			await UserProgressModel.updateOne(
				{ userId: progress.userId },
				{
					totalXP: progress.totalXP,
					level: progress.level,
					tasksCompleted: progress.tasksCompleted,
					xpToNextLevel: progress.xpToNextLevel,
				},
				{ upsert: true }
			);
		} catch (error) {
			throw new Error(`Error in save(): ${error}`);
		}
	}
}

// application/use-cases/gamification/update.task.progress.usecase.ts
import { IGamificationTaskRepository } from "../../../domain/repositories/gamification/gamification.task.repository";
import { IUserTaskProgressRepository } from "../../../domain/repositories/gamification/user.task.progress.repository";
import { IUserProgressRepository } from "../../../domain/repositories/gamification/user.progress.repository";
import { IUpdateUserTaskProgressUseCase } from "../../interfaces/gamification";
import { UserProgressEntity } from "../../../domain/entities/gamification/user.progress.entity";
import { UserTaskProgressEntity } from "../../../domain/entities/gamification/user.task.progress.entity";
import { ActionTypeEnum } from "aws-sdk/clients/elbv2";

export class UpdateUserTaskProgressUseCase implements IUpdateUserTaskProgressUseCase {
	constructor(private taskRepo: IGamificationTaskRepository, private taskProgressRepo: IUserTaskProgressRepository, private userProgressRepo: IUserProgressRepository) {}

	async execute(userId: string, actionType: ActionTypeEnum): Promise<void> {
		const tasks = await this.taskRepo.findByActionType(actionType);

		for (const task of tasks) {
			if (!task.id) continue;

			const progress = await this.taskProgressRepo.findByUserAndTask(userId, task.id);

			if (progress && progress.isCompleted) continue;

			const currentCount = progress?.currentCount ?? 0;
			const newCount = currentCount + 1;
			const isCompleted = newCount >= task.targetCount;

			const progressEntity = new UserTaskProgressEntity(userId, task.id, newCount, isCompleted, isCompleted ? new Date() : undefined);
			// Update or create progress record
			await this.taskProgressRepo.save(progressEntity);

			// If task is completed now, update user progress (XP, level, etc.)
			if (isCompleted) {
				let userProgress = await this.userProgressRepo.findByUserId(userId);
				if (!userProgress) {
					userProgress = new UserProgressEntity(userId);
				}
				userProgress.awardXP(task.xpReward);
				await this.userProgressRepo.save(userProgress);
			}
		}
	}
}

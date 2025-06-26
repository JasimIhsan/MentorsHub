import { GamificationTaskEntity } from "../../../../domain/entities/gamification/gamification.task.entity";
import { IGamificationTaskRepository } from "../../../../domain/repositories/gamification/gamification.task.repository";
import { GamificationTaskModel } from "../../models/gamification/gamification.task.model";

export class GamificationTaskRepositoryImpl implements IGamificationTaskRepository {
	async save(task: GamificationTaskEntity): Promise<GamificationTaskEntity> {
		if (!task.id) {
			const created = await GamificationTaskModel.create({
				title: task.title,
				xpReward: task.xpReward,
				targetCount: task.targetCount,
				actionType: task.actionType,
			});
			return new GamificationTaskEntity(created._id.toString(), created.title, created.xpReward, created.targetCount, created.actionType);
		} else {
			await GamificationTaskModel.findByIdAndUpdate(
				task.id,
				{
					title: task.title,
					xpReward: task.xpReward,
					targetCount: task.targetCount,
					actionType: task.actionType,
				},
				{ upsert: true }
			);
			return task;
		}
	}

	async findById(taskId: string): Promise<GamificationTaskEntity | null> {
		const task = await GamificationTaskModel.findById(taskId);
		if (!task) return null;
		return new GamificationTaskEntity(task._id, task.title, task.xpReward, task.targetCount, task.actionType);
	}

	async findAll(params: { page?: number; limit?: number; actionType?: string }): Promise<GamificationTaskEntity[]> {
		const { page = 1, limit = 10, actionType } = params;

		const filter: any = {};
		if (actionType) {
			filter.actionType = actionType;
		}

		const tasks = await GamificationTaskModel.find(filter)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		return tasks.map((t) => new GamificationTaskEntity(t._id, t.title, t.xpReward, t.targetCount, t.actionType));
	}
	async findByActionType(actionType: string): Promise<GamificationTaskEntity[]> {
		const tasks = await GamificationTaskModel.find({ actionType });
		return tasks.map((t) => new GamificationTaskEntity(t._id, t.title, t.xpReward, t.targetCount, t.actionType));
	}
}

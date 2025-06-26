// infrastructure/database/implementation/GamificationTaskRepositoryImpl.ts

import { GamificationTaskEntity } from "../../../domain/entities/gamification.task.entity";
import { IGamificationTaskRepository } from "../../../domain/repositories/gamification.task.repository";
import { GamificationTaskModel } from "../models/gamification/gamification.task.model";

export class GamificationTaskRepositoryImpl implements IGamificationTaskRepository {
	async save(task: GamificationTaskEntity): Promise<void> {
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
	}

	async findById(taskId: string): Promise<GamificationTaskEntity | null> {
		const task = await GamificationTaskModel.findById(taskId);
		if (!task) return null;
		return new GamificationTaskEntity(task._id, task.title, task.xpReward, task.targetCount, task.actionType);
	}

	async findAll(): Promise<GamificationTaskEntity[]> {
		const tasks = await GamificationTaskModel.find();
		return tasks.map((t) => new GamificationTaskEntity(t._id, t.title, t.xpReward, t.targetCount, t.actionType));
	}

	async findByActionType(actionType: string): Promise<GamificationTaskEntity[]> {
		const tasks = await GamificationTaskModel.find({ actionType });
		return tasks.map((t) => new GamificationTaskEntity(t._id, t.title, t.xpReward, t.targetCount, t.actionType));
	}
}

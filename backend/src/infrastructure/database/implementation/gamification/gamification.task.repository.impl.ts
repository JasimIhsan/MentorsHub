import { GamificationTaskEntity } from "../../../../domain/entities/gamification/gamification.task.entity";
import { IGamificationTaskRepository } from "../../../../domain/repositories/gamification/gamification.task.repository";
import { GamificationTaskModel } from "../../models/gamification/gamification.task.model";

export class GamificationTaskRepositoryImpl implements IGamificationTaskRepository {
	async save(task: GamificationTaskEntity): Promise<GamificationTaskEntity> {
		try {
			if (!task.id) {
				const created = await GamificationTaskModel.create({
					title: task.title,
					xpReward: task.xpReward,
					targetCount: task.targetCount,
					actionType: task.actionType,
					isListed: task.isListed,
				});
				return new GamificationTaskEntity(created._id.toString(), created.title, created.xpReward, created.targetCount, created.actionType, created.isListed, created.createdAt);
			} else {
				await GamificationTaskModel.findByIdAndUpdate(
					task.id,
					{
						title: task.title,
						xpReward: task.xpReward,
						targetCount: task.targetCount,
						actionType: task.actionType,
						isListed: task.isListed,
					},
					{ upsert: true }
				);
				return task;
			}
		} catch (error) {
			throw new Error(`Error in save(): ${error}`);
		}
	}

	async findById(taskId: string): Promise<GamificationTaskEntity | null> {
		try {
			const task = await GamificationTaskModel.findById(taskId);
			if (!task) return null;
			return new GamificationTaskEntity(task._id.toString(), task.title, task.xpReward, task.targetCount, task.actionType, task.isListed, task.createdAt);
		} catch (error) {
			throw new Error(`Error in findById(): ${error}`);
		}
	}

	async findAll(params: { page?: number; limit?: number; actionType?: string }): Promise<GamificationTaskEntity[]> {
		try {
			const { page = 1, limit = 10, actionType } = params;
			const filter: any = {};
			if (actionType) filter.actionType = actionType;

			const tasks = await GamificationTaskModel.find(filter)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit);

			return tasks.map((t) => new GamificationTaskEntity(t._id.toString(), t.title, t.xpReward, t.targetCount, t.actionType, t.isListed, t.createdAt));
		} catch (error) {
			throw new Error(`Error in findAll(): ${error}`);
		}
	}

	async findAllListed(params: { page?: number; limit?: number; searchTerm?: string }): Promise<{ tasks: GamificationTaskEntity[]; totalCount: number }> {
		try {
			const { page = 1, limit = 10, searchTerm } = params;

			const filter: any = { isListed: true };

			if (searchTerm) {
				const regex = new RegExp(searchTerm, "i"); // case-insensitive
				filter.$or = [{ title: regex }, { actionType: regex }];
			}

			const tasks = await GamificationTaskModel.find(filter)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit);
				
			const totalCount = await GamificationTaskModel.countDocuments(filter);
			const result = tasks.map((t) => new GamificationTaskEntity(t._id.toString(), t.title, t.xpReward, t.targetCount, t.actionType, t.isListed, t.createdAt));
			return { tasks: result, totalCount };
		} catch (error) {
			throw new Error(`Error in findAllListed(): ${error}`);
		}
	}

	async findByActionType(actionType: string): Promise<GamificationTaskEntity[]> {
		try {
			const tasks = await GamificationTaskModel.find({ actionType });
			return tasks.map((t) => new GamificationTaskEntity(t._id.toString(), t.title, t.xpReward, t.targetCount, t.actionType, t.isListed, t.createdAt));
		} catch (error) {
			throw new Error(`Error in findByActionType(): ${error}`);
		}
	}

	async deleteById(taskId: string): Promise<void> {
		try {
			await GamificationTaskModel.findByIdAndDelete(taskId);
		} catch (error) {
			throw new Error(`Error in deleteById(): ${error}`);
		}
	}

	async update(task: GamificationTaskEntity): Promise<GamificationTaskEntity | null> {
		try {
			await GamificationTaskModel.findByIdAndUpdate(task.id, {
				title: task.title,
				xpReward: task.xpReward,
				targetCount: task.targetCount,
				actionType: task.actionType,
				isListed: task.isListed,
			});
			return task;
		} catch (error) {
			throw new Error(`Error in update(): ${error}`);
		}
	}
}

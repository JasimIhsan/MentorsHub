import { FilterQuery } from "mongoose";
import { GamificationTaskEntity } from "../../../../domain/entities/gamification/gamification.task.entity";
import { IGamificationTaskRepository } from "../../../../domain/repositories/gamification/gamification.task.repository";
import { GamificationTaskModel, IGamificationTaskDocument } from "../../models/gamification/gamification.task.model";

/**
 * Utility type – A shorthand for Mongoose filters on our task documents.
 */
type TaskFilter = FilterQuery<IGamificationTaskDocument>;

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
			}

			await GamificationTaskModel.findByIdAndUpdate(
				task.id,
				{
					title: task.title,
					xpReward: task.xpReward,
					targetCount: task.targetCount,
					actionType: task.actionType,
					isListed: task.isListed,
				},
				{ upsert: true },
			);

			return task;
		} catch (error) {
			throw new Error(`Error in save(): ${String(error)}`);
		}
	}

	async findById(taskId: string): Promise<GamificationTaskEntity | null> {
		try {
			const task = await GamificationTaskModel.findById(taskId);
			if (!task) return null;

			return new GamificationTaskEntity(task._id.toString(), task.title, task.xpReward, task.targetCount, task.actionType, task.isListed, task.createdAt);
		} catch (error) {
			throw new Error(`Error in findById(): ${String(error)}`);
		}
	}

	async findAll(params: { page?: number; limit?: number; actionType?: string; searchTerm?: string }): Promise<GamificationTaskEntity[]> {
		try {
			const { page = 1, limit = 10, actionType, searchTerm } = params;

			const filter: TaskFilter = {};

			if (actionType && actionType.toLowerCase() !== "all") {
				filter.actionType = actionType;
			}
			if (searchTerm) {
				const regex = new RegExp(searchTerm, "i");
				filter.$or = [{ title: regex }, { actionType: regex }];
			}

			const tasks = await GamificationTaskModel.find(filter)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit);

			return tasks.map((t) => new GamificationTaskEntity(t._id.toString(), t.title, t.xpReward, t.targetCount, t.actionType, t.isListed, t.createdAt));
		} catch (error) {
			throw new Error(`Error in findAll(): ${String(error)}`);
		}
	}

	async findAllListed(params: { page?: number; limit?: number; searchTerm?: string }): Promise<{ tasks: GamificationTaskEntity[]; totalCount: number }> {
		try {
			const { page = 1, limit = 10, searchTerm } = params;

			const filter: TaskFilter = { isListed: true };

			if (searchTerm) {
				const regex = new RegExp(searchTerm, "i");
				filter.$or = [{ title: regex }, { actionType: regex }];
			}

			const tasks = await GamificationTaskModel.find(filter)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit);

			const totalCount = await GamificationTaskModel.countDocuments(filter);

			return {
				tasks: tasks.map((t) => new GamificationTaskEntity(t._id.toString(), t.title, t.xpReward, t.targetCount, t.actionType, t.isListed, t.createdAt)),
				totalCount,
			};
		} catch (error) {
			throw new Error(`Error in findAllListed(): ${String(error)}`);
		}
	}

	async findByActionType(actionType: string): Promise<GamificationTaskEntity[]> {
		try {
			const tasks = await GamificationTaskModel.find({ actionType });

			return tasks.map((t) => new GamificationTaskEntity(t._id.toString(), t.title, t.xpReward, t.targetCount, t.actionType, t.isListed, t.createdAt));
		} catch (error) {
			throw new Error(`Error in findByActionType(): ${String(error)}`);
		}
	}

	async deleteById(taskId: string): Promise<void> {
		try {
			await GamificationTaskModel.findByIdAndDelete(taskId);
		} catch (error) {
			throw new Error(`Error in deleteById(): ${String(error)}`);
		}
	}

	async update(task: GamificationTaskEntity): Promise<GamificationTaskEntity> {
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
			throw new Error(`Error in update(): ${String(error)}`);
		}
	}
}

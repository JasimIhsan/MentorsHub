import { GamificationTaskEntity } from "../../domain/entities/gamification/gamification.task.entity";
import { UserTaskProgressEntity } from "../../domain/entities/gamification/user.task.progress.entity";

export interface IGamificationTaskDTO {
	id: string;
	title: string;
	xpReward: number;
	targetCount: number;
	actionType: string;
	isListed: boolean;
	createdAt: Date | null;
}

export const mapToGamificationTaskDTO = (entity: GamificationTaskEntity): IGamificationTaskDTO => {
	return {
		id: entity.id ?? "",
		title: entity.title,
		xpReward: entity.xpReward,
		targetCount: entity.targetCount,
		actionType: entity.actionType,
		isListed: entity.isListed,
		createdAt: entity.createdAt,
	};
};

export interface IUserTaskWithProgressDTO {
	id: string;
	title: string;
	xpReward: number;
	targetCount: number;
	actionType: string;
	progress: number;
	isCompleted: boolean;
}

export function mapToUserTaskWithProgressDTO(task: GamificationTaskEntity, progress: UserTaskProgressEntity | null): IUserTaskWithProgressDTO {
	return {
		id: task.id!,
		title: task.title,
		xpReward: task.xpReward,
		targetCount: task.targetCount,
		actionType: task.actionType,
		progress: progress?.currentCount ?? 0,
		isCompleted: progress?.isCompleted ?? false,
	};
}

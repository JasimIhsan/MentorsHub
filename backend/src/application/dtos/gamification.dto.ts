import { GamificationTaskEntity } from "../../domain/entities/gamification/gamification.task.entity";

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

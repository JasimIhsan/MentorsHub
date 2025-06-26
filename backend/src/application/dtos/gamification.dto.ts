import { GamificationTaskEntity } from "../../domain/entities/gamification/gamification.task.entity";

export interface IGamificationTaskDTO {
	id: string;
	title: string;
	xpReward: number;
	targetCount: number;
	actionType: string;
}

export const mapToGamificationTaskDTO = (entity: GamificationTaskEntity): IGamificationTaskDTO => {
	return {
		id: entity.id ?? "",
		title: entity.title,
		xpReward: entity.xpReward,
		targetCount: entity.targetCount,
		actionType: entity.actionType,
	};
};

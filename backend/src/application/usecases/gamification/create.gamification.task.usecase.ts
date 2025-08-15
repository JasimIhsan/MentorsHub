import { GamificationTaskEntity } from "../../../domain/entities/gamification/gamification.task.entity";
import { IActionTypeRepository } from "../../../domain/repositories/gamification/action.type.repository";
import { IGamificationTaskRepository } from "../../../domain/repositories/gamification/gamification.task.repository";
import { ICreateGamificationTaskUseCase } from "../../interfaces/usecases/gamification";

export class CreateGamificationTaskUseCase implements ICreateGamificationTaskUseCase {
	constructor(private taskRepo: IGamificationTaskRepository, private actionTypeRepo: IActionTypeRepository) {}

	async execute(input: { title: string; xpReward: number; targetCount: number; actionType: string }): Promise<GamificationTaskEntity> {
		const isValidActionType = await this.actionTypeRepo.existsById(input.actionType);
		if (!isValidActionType) {
			throw new Error(`Invalid action type: ${input.actionType}`);
		}
		
		const task = new GamificationTaskEntity(undefined, input.title, input.xpReward, input.targetCount, input.actionType);
		await this.taskRepo.save(task);
		return task;
	}
}

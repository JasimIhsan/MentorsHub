// application/usecases/gamification/EditGamificationTaskUseCase.ts
import { IGamificationTaskRepository } from "../../../domain/repositories/gamification/gamification.task.repository";
import { IActionTypeRepository } from "../../../domain/repositories/gamification/action.type.repository";
import { IEditGamificationTaskUseCase } from "../../interfaces/gamification";
import { IGamificationTaskDTO, mapToGamificationTaskDTO } from "../../dtos/gamification.dto";

export class EditGamificationTaskUseCase implements IEditGamificationTaskUseCase {
	constructor(private taskRepo: IGamificationTaskRepository, private actionTypeRepo: IActionTypeRepository) {}

	async execute(input: { taskId: string; title: string; xpReward: number; targetCount: number; actionType: string }): Promise<IGamificationTaskDTO> {
		// 1. Validate task exists
		const existingTask = await this.taskRepo.findById(input.taskId);
		if (!existingTask) throw new Error("Task not found");

		// 2. Validate actionType exists
		const isValidType = await this.actionTypeRepo.existsById(input.actionType);
		if (!isValidType) throw new Error("Invalid action type");

		// 3. Update fields
		existingTask.title = input.title;
		existingTask.xpReward = input.xpReward;
		existingTask.targetCount = input.targetCount;
		existingTask.actionType = input.actionType;

		// 4. Save
		await this.taskRepo.update(existingTask);

		return mapToGamificationTaskDTO(existingTask)
	}
}

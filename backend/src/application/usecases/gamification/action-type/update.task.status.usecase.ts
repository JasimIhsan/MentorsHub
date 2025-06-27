import { IGamificationTaskRepository } from "../../../../domain/repositories/gamification/gamification.task.repository";
import { IGamificationTaskDTO, mapToGamificationTaskDTO } from "../../../dtos/gamification.dto";
import { IUpdateGamificationTaskStatusUseCase } from "../../../interfaces/gamification";

export class UpdateGamificationTaskStatusUseCase implements IUpdateGamificationTaskStatusUseCase {
	constructor(private taskRepo: IGamificationTaskRepository) {}

	async execute(taskId: string, status: boolean): Promise<IGamificationTaskDTO> {
		const task = await this.taskRepo.findById(taskId);
		if (!task) throw new Error("Task not found");

		task.isListed = status;

		await this.taskRepo.save(task);
		return mapToGamificationTaskDTO(task);
	}
}

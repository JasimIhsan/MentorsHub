import { IGamificationTaskRepository } from "../../../domain/repositories/gamification/gamification.task.repository";
import { IDeleteGamificationTaskUseCase } from "../../interfaces/usecases/gamification";

export class DeleteGamificationTaskUseCase implements IDeleteGamificationTaskUseCase {
	constructor(private taskRepo: IGamificationTaskRepository) {}

	async execute(taskId: string): Promise<void> {
		const task = await this.taskRepo.findById(taskId);
		if (!task) throw new Error("Task not found");
		return await this.taskRepo.deleteById(taskId);
	}
}

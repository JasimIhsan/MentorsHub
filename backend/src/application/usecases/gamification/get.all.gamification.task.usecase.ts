import { GamificationTaskEntity } from "../../../domain/entities/gamification/gamification.task.entity";
import { IGamificationTaskRepository } from "../../../domain/repositories/gamification/gamification.task.repository";
import { IGamificationTaskDTO, mapToGamificationTaskDTO } from "../../dtos/gamification.dto";
import { IGetAllGamificationTasksUseCase } from "../../interfaces/gamification";

export class GetAllGamificationTasksUseCase implements IGetAllGamificationTasksUseCase {
	constructor(private taskRepo: IGamificationTaskRepository) {}

	async execute(params: { page?: number; limit?: number; actionType?: string }): Promise<IGamificationTaskDTO[]> {
		const tasks = await this.taskRepo.findAll(params);

		return tasks.map((t) => mapToGamificationTaskDTO(t));
	}
}

import { IGamificationTaskRepository } from "../../../domain/repositories/gamification/gamification.task.repository";
import { IUserTaskProgressRepository } from "../../../domain/repositories/gamification/user.task.progress.repository";
import { IUserTaskWithProgressDTO, mapToUserTaskWithProgressDTO } from "../../dtos/gamification.dto";
import { IGetAllListedGamificationTasksUseCase } from "../../interfaces/usecases/gamification";

export class GetAllListedGamificationTasksUseCase implements IGetAllListedGamificationTasksUseCase {
	constructor(private taskRepo: IGamificationTaskRepository, private userTaskProgressRepo: IUserTaskProgressRepository) {}

	async execute(userId: string, params: { page?: number; limit?: number; searchTerm?: string }): Promise<{ tasks: IUserTaskWithProgressDTO[]; totalCount: number }> {
		const { tasks, totalCount } = await this.taskRepo.findAllListed(params);
		const result = [];

		for (const task of tasks) {
			const progress = await this.userTaskProgressRepo.findByUserAndTask(userId, task.id!);
			result.push(mapToUserTaskWithProgressDTO(task, progress));
		}
		return { tasks: result, totalCount };
	}
}

import { UserProgressEntity } from "../../../domain/entities/gamification/user.progress.entity";
import { IUserProgressRepository } from "../../../domain/repositories/gamification/user.progress.repository";
import { IUserProgressDTO, mapToUserProgressDTO } from "../../dtos/gamification.dto";
import { IGetUserProgressUseCase } from "../../interfaces/gamification";

export class GetUserProgressUseCase implements IGetUserProgressUseCase {
	constructor(private userProgressRepo: IUserProgressRepository) {}

	async execute(userId: string): Promise<IUserProgressDTO> {
		const progress = await this.userProgressRepo.findByUserId(userId);
		if (!progress) throw new Error("User progress not found");
		return mapToUserProgressDTO(progress);
	}
}

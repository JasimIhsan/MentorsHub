import { IUserProgressRepository } from "../../../domain/repositories/gamification/user.progress.repository";
import { IUserProgressDTO, mapToUserProgressDTO } from "../../dtos/gamification.dto";
import { IGetUserProgressUseCase } from "../../interfaces/usecases/gamification";

export class GetUserProgressUseCase implements IGetUserProgressUseCase {
	constructor(private userProgressRepo: IUserProgressRepository) {}

	async execute(userId: string): Promise<IUserProgressDTO> {
		const progress = await this.userProgressRepo.findByUserId(userId);
		if (!progress) throw new Error("User progress not found");
		return mapToUserProgressDTO(progress);
	}
}

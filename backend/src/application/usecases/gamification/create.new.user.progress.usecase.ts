// application/use-cases/gamification/create.user.progress.usecase.ts
import { IUserProgressRepository } from "../../../domain/repositories/gamification/user.progress.repository";
import { UserProgressEntity } from "../../../domain/entities/gamification/user.progress.entity";
import { ICreateUserProgressUseCase } from "../../interfaces/usecases/gamification";

export class CreateUserProgressUseCase implements ICreateUserProgressUseCase {
	constructor(private userProgressRepo: IUserProgressRepository) {}

	async execute(userId: string): Promise<void> {
		const existing = await this.userProgressRepo.findByUserId(userId);
		if (existing) return;

		const entity = new UserProgressEntity(userId);
		await this.userProgressRepo.save(entity);
	}
}

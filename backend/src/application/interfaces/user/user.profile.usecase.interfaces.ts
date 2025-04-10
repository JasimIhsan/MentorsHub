import { UserEntity, UserInterface } from "../../../domain/entities/user.entity";

export interface IUpdateUserProfileUseCase {
	execute(userId: string, data: Partial<UserInterface>): Promise<UserEntity>;
}

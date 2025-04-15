import { UserEntity } from "../../../domain/entities/user.entity";

export interface IVerifyMentorApplicationUsecase {
	execute(userId: string, status: "approved" | "rejected", reason?: string): Promise<UserEntity>;
}

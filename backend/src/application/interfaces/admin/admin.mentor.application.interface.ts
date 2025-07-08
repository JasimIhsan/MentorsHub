import { UserEntity } from "../../../domain/entities/user.entity";
import { MentorRequestStatusEnum } from "../enums/mentor.request.status.enum";

export interface IVerifyMentorApplicationUsecase {
	execute(userId: string, status: MentorRequestStatusEnum, reason?: string): Promise<UserEntity>;
}

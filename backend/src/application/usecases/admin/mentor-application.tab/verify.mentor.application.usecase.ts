import { IMentorProfileRepository } from "../../../../domain/repositories/mentor.details.repository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IVerifyMentorApplicationUsecase } from "../../../interfaces/admin/admin.mentor.application.interface";
import { INotifyUserUseCase } from "../../../interfaces/notification/notification.usecase";
import { RoleEnum } from "../../../interfaces/enums/role.enum";
import { MentorRequestStatusEnum } from "../../../interfaces/enums/mentor.request.status.enum";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";

export class VerifyMentorApplicationUseCase implements IVerifyMentorApplicationUsecase {
	constructor(private mentorRepo: IMentorProfileRepository, private userRepo: IUserRepository, private notifyUserUseCase: INotifyUserUseCase) {}

	async execute(userId: string, status: MentorRequestStatusEnum, reason?: string): Promise<UserEntity> {
		const user = await this.userRepo.findUserById(userId);
		if (!user) throw new Error(CommonStringMessage.USER_NOT_FOUND);

		const profile = await this.mentorRepo.findByUserId(userId);
		if (!profile) throw new Error("Mentor profile not found");

		if (status === MentorRequestStatusEnum.APPROVED) {
			user.updateUserDetails({ role: RoleEnum.MENTOR, mentorRequestStatus: status });
		} else if (status === MentorRequestStatusEnum.REJECTED) {
			user.updateUserDetails({ mentorRequestStatus: status });
		}

		await this.notifyUserUseCase.execute({
			title: status === MentorRequestStatusEnum.APPROVED ? "🎓 Mentor Application Approved" : "🎓 Mentor Application Rejected",
			message: reason || "Your mentor application has been " + (status === MentorRequestStatusEnum.APPROVED ? "approved" : "rejected"),
			isRead: false,
			recipientId: userId,
			type: NotificationTypeEnum.SUCCESS,
			link: "/mentor/dashboard",
		});

		return await this.userRepo.updateUser(userId, user);
	}
}

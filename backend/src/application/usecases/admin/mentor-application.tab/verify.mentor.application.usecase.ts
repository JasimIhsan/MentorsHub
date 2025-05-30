import { IMentorProfileRepository } from "../../../../domain/repositories/mentor.details.repository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IVerifyMentorApplicationUsecase } from "../../../interfaces/admin/admin.mentor.application.interface";

export class VerifyMentorApplicationUseCase implements IVerifyMentorApplicationUsecase {
	constructor(private mentorRepo: IMentorProfileRepository, private userRepo: IUserRepository) {}

	async execute(userId: string, status: "approved" | "rejected", reason?: string): Promise<UserEntity> {
		const user = await this.userRepo.findUserById(userId);
		if (!user) throw new Error(CommonStringMessage.USER_NOT_FOUND);

		const profile = await this.mentorRepo.findByUserId(userId);
		if (!profile) throw new Error("Mentor profile not found");

		if (status === "approved") {
			user.updateUserDetails({ role: "mentor", mentorRequestStatus: status });
		} else if (status === "rejected") {
			user.updateUserDetails({ mentorRequestStatus: status });
		}

		// if(reason){
		// 	profile.updateMentorDetails({ approvalReason: reason });
		// }

		return await this.userRepo.updateUser(userId, user);
	}
}

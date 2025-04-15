import { IMentorProfileRepository } from "../../../../domain/dbrepository/mentor.details.repository";
import { IUserRepository } from "../../../../domain/dbrepository/user.repository";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { IVerifyMentorApplicationUsecase } from "../../../interfaces/admin/admin.mentor.application.interface";

export class VerifyMentorApplicationUseCase implements IVerifyMentorApplicationUsecase {
	constructor(private mentorRepo: IMentorProfileRepository, private userRepo: IUserRepository) {}

	async execute(userId: string, status: "approved" | "rejected", reason?: string): Promise<UserEntity> {
		console.log("userId: ", userId);
		console.log("status: ", status);

		const user = await this.userRepo.findUserById(userId);
		if (!user) throw new Error("User not found");

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

import { IUserRepository } from "../../../domain/dbrepository/user.repository";
import { UserEntity } from "../../../domain/entities/user.entity";

export class ResetPasswordUseCase {
	constructor(private userRepo: IUserRepository) {}

	async execute(token: string, newPassword: string): Promise<void> {
		const user = await this.userRepo.findUserByResetToken(token);
		const userDetails = user?.getProfile();
		if (!user || !userDetails?.resetPasswordToken || !userDetails.resetPasswordExpires || userDetails.resetPasswordExpires < Date.now()) {
			throw new Error("Invalid or expired reset token");
		}

		const isSamePassword = await user.isPasswordValid(newPassword);
		if (isSamePassword) {
			throw new Error("Password cannot be the same as the old password");
		}

		const hashedPassword = await UserEntity.hashPassword(newPassword);
		user.updateUserDetails({ password: hashedPassword });

		await this.userRepo.save(user);
	}
}

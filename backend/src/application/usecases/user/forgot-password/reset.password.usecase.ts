import { IForgotPasswordTokensRepository } from "../../../../domain/repositories/forgot.password.token.respository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { UserEntity } from "../../../../domain/entities/user.entity";

export class ResetPasswordUseCase {
	constructor(private restRepo: IForgotPasswordTokensRepository, private userRepo: IUserRepository) {}

	async execute(token: string, newPassword: string): Promise<void> {
		const user = await this.restRepo.findUserByResetToken(token);
		const tokenDetails = await this.restRepo.findAllTokenDetails(token);
		if (!user || !tokenDetails?.token || !tokenDetails.expiresAt || tokenDetails.expiresAt.getTime() < Date.now()) {
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

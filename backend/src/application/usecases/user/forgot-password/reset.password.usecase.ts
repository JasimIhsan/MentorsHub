import { IForgotPasswordTokensRepository } from "../../../../domain/repositories/forgot.password.token.respository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { IHashService } from "../../../interfaces/services/hash.service";

export class ResetPasswordUseCase {
	constructor(private restRepo: IForgotPasswordTokensRepository, private userRepo: IUserRepository, private hashService: IHashService) {}

	async execute(token: string, newPassword: string): Promise<void> {
		const tokenEntity = await this.restRepo.findToken(token);
		if (!tokenEntity) throw new Error("Invalid reset token");

		const user = await this.userRepo.findUserById(tokenEntity.userId);
		const tokenDetails = await this.restRepo.findAllTokenDetails(token);
		if (!user || !tokenDetails?.token || !tokenDetails.expiresAt || tokenDetails.expiresAt.getTime() < Date.now()) {
			throw new Error("Invalid or expired reset token");
		}

		const isSamePassword = await this.hashService.comparePassword(user.password, newPassword);
		if (isSamePassword) {
			throw new Error("Password cannot be the same as the old password");
		}

		const hashedPassword = await this.hashService.hashPassword(newPassword);
		user.updateUserDetails({ password: hashedPassword });

		await this.userRepo.save(user);
	}
}

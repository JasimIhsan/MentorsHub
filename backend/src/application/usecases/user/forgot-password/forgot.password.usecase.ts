import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { IEmailService } from "../../../interfaces/user/email.service.interface";
import crypto from "crypto";
import { IForgotPasswordUseCase } from "../../../interfaces/user/auth.usecases.interfaces";
import { IForgotPasswordTokensRepository } from "../../../../domain/repositories/forgot.password.token.respository";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
	constructor(private userRepo: IUserRepository, private emailService: IEmailService, private tokenRepo: IForgotPasswordTokensRepository) {}

	async execute(email: string): Promise<void> {
		const user = await this.userRepo.findUserByEmail(email);
		if (!user) throw new Error(CommonStringMessage.USER_NOT_FOUND);
		const userId = user.id;
		if (!userId) throw new Error(CommonStringMessage.USER_NOT_FOUND);
		const token = crypto.randomBytes(32).toString("hex");
		await this.tokenRepo.createToken(userId, token, 10);

		let username = user.getFullName();
		await this.emailService.sendPasswordResetEmail(email, token, username);
	}
}

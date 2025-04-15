import { IUserRepository } from "../../../../domain/dbrepository/user.repository";
import { IEmailService } from "../../../interfaces/user/email.service.interface";
import crypto from "crypto";
import { IForgotPasswordUseCase } from "../../../interfaces/user/auth.usecases.interfaces";
import { IForgotPasswordTokensRepository } from "../../../../domain/dbrepository/forgot.password.token.respository";

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
	constructor(private userRepo: IUserRepository, private emailService: IEmailService, private tokenRepo: IForgotPasswordTokensRepository) {}

	async execute(email: string): Promise<void> {
		const user = await this.userRepo.findUserByEmail(email);
		if (!user) throw new Error("User not found: ");
		const userId = user.getId();
		if(!userId) throw new Error("User not found");
		const token = crypto.randomBytes(32).toString("hex");
		await this.tokenRepo.createToken(userId, token, 10);

		let username = user.getFullName();
		await this.emailService.sendPasswordResetEmail(email, token, username);
	}
}

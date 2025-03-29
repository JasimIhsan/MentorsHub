import { IUserRepository } from "../../../domain/dbrepository/user.repository";
import { IEmailService } from "../../../domain/interfaces/email.service.interface";
import crypto from "crypto";
import { IForgotPasswordUseCase } from "../../../domain/interfaces/auth.usecases";

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
	constructor(private userRepo: IUserRepository, private emailService: IEmailService) {}

	async execute(email: string): Promise<void> {
		const user = await this.userRepo.findUserByEmail(email);
		if (!user) {
			throw new Error("User not found: ");
		}

		const token = crypto.randomBytes(32).toString("hex");
		const expiresAt = Date.now() + 3600000;

		user.updateUserDetails({ resetPasswordToken: token, resetPasswordExpires: expiresAt });
		await this.userRepo.save(user);
		let username = user.getName();
		await this.emailService.sendPasswordResetEmail(email, token, username);
	}
}

import { ICacheRepository } from "../../../../domain/repositories/cache.respository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { generateOtp } from "../../../../infrastructure/utils/generate.otp";
import { ISendOtpUsecase } from "../../../interfaces/usecases/user/auth.usecases.interfaces";
import { IEmailService } from "../../../interfaces/usecases/user/email.service.interface";

export class SendOtpUsecase implements ISendOtpUsecase {
	constructor(private emailService: IEmailService, private userRepo: IUserRepository, private redisService: ICacheRepository) {}

	async execute(email: string) {
		const isExists = await this.userRepo.findUserByEmail(email);
		if (isExists) throw new Error("User already exists");
		const otp = generateOtp();
  
		console.log("\n\nOTP : ", otp);

		await this.redisService.setCachedData(`otp:${email}`, otp, 600);

		await this.emailService.sendOtpEmail(email, otp);
	}
}

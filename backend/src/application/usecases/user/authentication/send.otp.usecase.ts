import { ICacheRepository } from "../../../../domain/dbrepository/cache.respository";
import { IUserRepository } from "../../../../domain/dbrepository/user.repository";
import { generateOtp } from "../../../../infrastructure/services/utils/generate.otp";
import { ISendOtpUsecase } from "../../../interfaces/user/auth.usecases.interfaces";
import { IEmailService } from "../../../interfaces/user/email.service.interface";

export class SendOtpUsecase implements ISendOtpUsecase {
	constructor(private emailService: IEmailService, private userRepo: IUserRepository, private redisService: ICacheRepository) {}

	async execute(email: string) {
		const isExists = await this.userRepo.findUserByEmail(email);
		if (isExists) throw new Error("User already exists");
		const otp = generateOtp();

		await this.redisService.setCachedData(`otp:${email}`, otp, 600);

		await this.emailService.sendOtpEmail(email, otp);
	}
}

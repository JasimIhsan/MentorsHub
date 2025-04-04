import { ICacheRepository } from "../../../domain/dbrepository/cache.respository";
import { IVerifyOtpUsecase } from "../../interfaces/auth.usecases";

export class VerifyOtpUsecase implements IVerifyOtpUsecase {
	constructor(private redisService: ICacheRepository) {}

	async execute(email: string, enteredOtp: string): Promise<boolean> {
		console.log('email in verify otp: ', email);
		
		const cachedOtp = await this.redisService.getCachedData(`otp:${email}`);
		console.log("cachedOtp: ", cachedOtp);
		if (!cachedOtp) {
			throw new Error("OTP not found");
		}
		if (cachedOtp === enteredOtp) {
			await this.redisService.removeCachedData(`otp:${email}`);
			return true;
		}
		return false;
	}
}

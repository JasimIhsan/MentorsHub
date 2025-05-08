import { ICacheRepository } from "../../../../domain/dbrepository/cache.respository";
import { IVerifyOtpUsecase } from "../../../interfaces/user/auth.usecases.interfaces";

export class VerifyOtpUsecase implements IVerifyOtpUsecase {
	constructor(private redisService: ICacheRepository) {}

	async execute(email: string, enteredOtp: string): Promise<boolean> {
		const cachedOtp = await this.redisService.getCachedData(`otp:${email}`);
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

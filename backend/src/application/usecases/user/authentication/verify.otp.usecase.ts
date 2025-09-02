import { ICacheRepository } from "../../../../domain/repositories/cache.respository";
import { IVerifyOtpUsecase } from "../../../interfaces/usecases/user/auth.usecases.interfaces";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { INotifyUserUseCase } from "../../../interfaces/usecases/notification/notification.usecase";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";

export class VerifyOtpUsecase implements IVerifyOtpUsecase {
	constructor(
		private redisService: ICacheRepository,
		private userRepository: IUserRepository,
		private notifyUserUseCase: INotifyUserUseCase, // ✅ injected
	) {}

	async execute(email: string, enteredOtp: string): Promise<boolean> {
		const cachedOtp = await this.redisService.getCachedData(`otp:${email}`);
		if (!cachedOtp) throw new Error("OTP not found");

		if (cachedOtp === enteredOtp) {
			await this.redisService.removeCachedData(`otp:${email}`);

			// Get user info to send notification
			const user = await this.userRepository.findUserByEmail(email);
			if (user && user.id && user.firstName) {
				// Send welcome notification
				await this.notifyUserUseCase.execute({
					title: "👋 Welcome to MentorHub!",
					message: `Hi ${user.fullName}, we're excited to have you here. Start exploring sessions and leveling up!`,
					isRead: false,
					recipientId: user.id,
					type: NotificationTypeEnum.WELCOME,
				});
			}

			return true;
		}

		return false;
	}
}

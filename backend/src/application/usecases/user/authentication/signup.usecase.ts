import { UserEntity } from "../../../../domain/entities/user.entity";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { ITokenService } from "../../../interfaces/usecases/user/token.service.interface";
import { IVerifyOtpUsecase, ISignupUseCase } from "../../../interfaces/usecases/user/auth.usecases.interfaces";
import { ICreateUserProgressUseCase } from "../../../interfaces/usecases/gamification";
import { IHashService } from "../../../interfaces/services/hash.service";
import { RoleEnum } from "../../../interfaces/enums/role.enum";
import { MentorRequestStatusEnum } from "../../../interfaces/enums/mentor.request.status.enum";
import { UserStatusEnums } from "../../../interfaces/enums/user.status.enums";
import { mapToUserDTO } from "../../../dtos/user.dtos";
import { INotifyUserUseCase } from "../../../interfaces/usecases/notification/notification.usecase";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";

export class SignupUseCase implements ISignupUseCase {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly tokenService: ITokenService,
		private readonly verifyOtp: IVerifyOtpUsecase,
		private readonly createUserProgress: ICreateUserProgressUseCase,
		private readonly hashService: IHashService,
		private readonly notifyUserUseCase: INotifyUserUseCase
	) {}

	async execute(otp: string, firstName: string, lastName: string, email: string, password: string) {
		// 1️⃣ Verify OTP
		const isOTPValid = await this.verifyOtp.execute(email, otp);
		if (!isOTPValid) throw new Error("Invalid or expired OTP");

		// 2️⃣ Check for existing user
		if (await this.userRepository.findUserByEmail(email)) {
			throw new Error("User already exists");
		}

		// 3️⃣ Hash the password inside the use case
		const hashedPassword = await this.hashService.hashPassword(password);

		// 4️⃣ Create UserEntity with hashed password
		const newUser = new UserEntity({
			email,
			password: hashedPassword,
			firstName,
			lastName,
			status: UserStatusEnums.UNBLOCKED,
			role: RoleEnum.USER,
			mentorRequestStatus: MentorRequestStatusEnum.NOT_REQUESTED,
			sessionCompleted: 0,
			averageRating: 0,
			totalReviews: 0,
			createdAt: new Date(),
		});

		// 5️⃣ Persist user
		const savedUser = await this.userRepository.createUser(newUser);

		// 6️⃣ Gamification: create progress record
		const userId = savedUser.id;
		if (!userId) throw new Error("User ID is undefined after saving");
		await this.createUserProgress.execute(userId);

		// 7️⃣ Issue tokens
		const accessToken = this.tokenService.generateAccessToken(userId);
		const refreshToken = this.tokenService.generateRefreshToken(userId);

		await this.notifyUserUseCase.execute({
			title: "👋 Welcome to MentorsHub!",
			message: `Hi ${firstName} ${lastName}, glad to see you here. Start exploring sessions and leveling up!`,
			isRead: false,
			recipientId: userId,
			type: NotificationTypeEnum.WELCOME,
		});

		return { user: mapToUserDTO(savedUser), accessToken, refreshToken };
	}
}

import { UserInterface, UserEntity } from "../../../../domain/entities/user.entity";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import bcrypt from "bcrypt";
import { ITokenService } from "../../../interfaces/user/token.service.interface";
import { ICacheRepository } from "../../../../domain/repositories/cache.respository";
import { ISignupUseCase, IVerifyOtpUsecase } from "../../../interfaces/user/auth.usecases.interfaces";
import { emit } from "process";
import { ICreateUserProgressUseCase } from "../../../interfaces/gamification";

export class SignupUseCase implements ISignupUseCase {
	constructor(private userRepository: IUserRepository, private tokenSerivice: ITokenService, private verifyOtp: IVerifyOtpUsecase, private createUserProgress: ICreateUserProgressUseCase) {}

	async execute(otp: string, firstName: string, lastName: string, email: string, password: string) {
		const isOTPValid = await this.verifyOtp.execute(email, otp);
		if (!isOTPValid) throw new Error("Invalid or expired OTP");

		const existingUser = await this.userRepository.findUserByEmail(email);
		if (existingUser) throw new Error("User already exists");

		//create new user entity without id
		const newUser = await UserEntity.create(email, password, firstName, lastName);

		// save new user (database will genreate id)
		const savedUser = await this.userRepository.createUser(newUser);
		const userId = savedUser.getId();
		if (!userId) throw new Error("User ID is undefined after saving");

		// Create gamification progress record
		await this.createUserProgress.execute(userId);

		const accessToken = this.tokenSerivice.generateAccessToken(userId);
		const refreshToken = this.tokenSerivice.generateRefreshToken(userId);
		return { user: savedUser, refreshToken, accessToken };
	}
}

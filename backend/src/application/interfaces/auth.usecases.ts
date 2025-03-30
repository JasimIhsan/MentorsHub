import { UserEntity } from "../../domain/entities/user.entity";

export interface IForgotPasswordUseCase {
	execute(email: string): Promise<void>;
}

export interface IVerifyResetTokenUseCase {
	execute(token: string): Promise<boolean>;
}

export interface IResetPasswordUseCase {
	execute(token: string, newPassword: string): Promise<void>;
}

export interface ISignInUseCase {
	execute(email: string, password: string): Promise<{ user: UserEntity; refreshToken: string; accessToken: string }>;
}

export interface ISignupUseCase {
	execute(otp: string, firstName: string, lastName: string, email: string, password: string): Promise<{ user: UserEntity; refreshToken: string; accessToken: string }>;
}

export interface ISendOtpUsecase {
	execute(email: string): Promise<void>;
}

export interface IVerifyOtpUsecase {
	execute(email: string, otp: string): Promise<boolean>;
}
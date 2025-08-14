import { IUserDTO } from "../../../dtos/user.dtos";

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
	execute(email: string, password: string): Promise<{ user: IUserDTO; refreshToken: string; accessToken: string }>;
}

export interface ISignupUseCase {
	execute(otp: string, firstName: string, lastName: string, email: string, password: string): Promise<{ user: IUserDTO; refreshToken: string; accessToken: string }>;
}

export interface ISendOtpUsecase {
	execute(email: string): Promise<void>;
}

export interface IVerifyOtpUsecase {
	execute(email: string, otp: string): Promise<boolean>;
}

export interface IGoogleAuthUsecase {
	execute(googleToken: string): Promise<{ user: IUserDTO; refreshToken: string; accessToken: string }>;
}

export interface IRefreshTokenUsecase {
	execute(userId: string, isAdmin: boolean): string;
}

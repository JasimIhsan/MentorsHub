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
	execute(email: string, password: string): Promise<string>;
}

export interface ISignupUseCase {
	execute(email: string, password: string): Promise<string>;
}

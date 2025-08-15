import { ForgotPasswordTokenEntity } from "../entities/forgot.password.token.entity";

export interface IForgotPasswordTokensRepository {
	createToken(userId: string, token: string, expiresInMinutes: number): Promise<ForgotPasswordTokenEntity>;
	isTokenValid(token: string): Promise<boolean>;
	findAllTokenDetails(token: string): Promise<ForgotPasswordTokenEntity | null>;
	findToken(token: string): Promise<ForgotPasswordTokenEntity | null>;
}

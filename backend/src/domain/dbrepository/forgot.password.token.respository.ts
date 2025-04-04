import { ForgotPasswordTokenEntity, IForgotPasswordTokens } from "../entities/forgot.password.token.entity";
import { UserEntity } from "../entities/user.entity";
import { ForgotPasswordTokenDTO } from "../../application/dtos/forgot.token.dto";

export interface IForgotPasswordTokensRepository {
	createToken(userId: string, token: string, expiresInMinutes: number): Promise<IForgotPasswordTokens>;
	findUserByResetToken(token: string): Promise<UserEntity | null>;
	findAllTokenDetails(token: string): Promise<ForgotPasswordTokenDTO | null>;
	findToken(token: string): Promise<ForgotPasswordTokenEntity | null>;
}

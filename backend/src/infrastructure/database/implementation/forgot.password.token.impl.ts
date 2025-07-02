import { IForgotPasswordTokensRepository } from "../../../domain/repositories/forgot.password.token.respository";
import { ForgotPasswordTokenEntity } from "../../../domain/entities/forgot.password.token.entity";
import { ForgotTokenModel } from "../models/user/forgot.password.reset.token.model";
import { handleExceptionError } from "../../utils/handle.exception.error";

export class ForgotPasswordResetTokenImpl implements IForgotPasswordTokensRepository {
	async createToken(userId: string, token: string, expiresInMinutes: number): Promise<ForgotPasswordTokenEntity> {
		try {
			const tokenEntity = ForgotPasswordTokenEntity.create(userId, token, expiresInMinutes);
			console.log("tokenEntity: ", tokenEntity);
			const createdToken = new ForgotTokenModel({ token: tokenEntity.token, userId: tokenEntity.userId, expiresAt: tokenEntity.expiresAt });
			await createdToken.save();

			return tokenEntity;
		} catch (error) {
			return handleExceptionError(error, "Error creating forgot password token");
		}
	}

	async findAllTokenDetails(token: string): Promise<ForgotPasswordTokenEntity | null> {
		try {
			const tokenDoc = await ForgotTokenModel.findOne({ token });
			if (!tokenDoc) return null;

			return ForgotPasswordTokenEntity.restore({
				token: tokenDoc.token,
				userId: tokenDoc.userId.toString(),
				expiresAt: tokenDoc.expiresAt,
			});
		} catch (error) {
			return handleExceptionError(error, "Error finding forgot password token");
		}
	}

	async findToken(token: string): Promise<ForgotPasswordTokenEntity | null> {
		try {
			const tokenDoc = await ForgotTokenModel.findOne({ token });
			if (!tokenDoc) return null;

			return ForgotPasswordTokenEntity.restore({
				token: tokenDoc.token,
				userId: tokenDoc.userId.toString(),
				expiresAt: tokenDoc.expiresAt,
			});
		} catch (error) {
			return handleExceptionError(error, "Error finding forgot password token");
		}
	}

	async isTokenValid(token: string): Promise<boolean> {
		try {
			const tokenDoc = await ForgotTokenModel.findOne({ token });
			return !!tokenDoc;
		} catch (error) {
			return handleExceptionError(error, "Error checking token validity");
		}
	}
}

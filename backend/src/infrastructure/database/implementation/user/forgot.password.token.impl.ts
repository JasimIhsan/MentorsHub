import { ForgotPasswordTokenDTO } from "../../../../application/dtos/forgot.token.dto";
import { IForgotPasswordTokensRepository } from "../../../../domain/dbrepository/forgot.password.token.respository";
import { ForgotPasswordTokenEntity, IForgotPasswordTokens } from "../../../../domain/entities/forgot.password.token.entity";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { ForgotTokenModel } from "../../models/user/forgot.password.reset.token.model";
import { handleError } from "../../implementation/user/user.repository.impl";

export class ForgotPasswordResetTokenImpl implements IForgotPasswordTokensRepository {
	async createToken(userId: string, token: string, expiresInMinutes: number): Promise<IForgotPasswordTokens> {
		try {
			const tokenEntity = ForgotPasswordTokenEntity.create(userId, token, expiresInMinutes);
			const createdToken = new ForgotTokenModel({
				token: tokenEntity.getToken(),
				expiresAt: tokenEntity.getExpires(),
				userId: tokenEntity.getUserId(),
			});
			await createdToken.save();
			return tokenEntity.toDBDocument();
		} catch (error) {
			return handleError(error, "Error creating forgot password token");
		}
	}

	async findAllTokenDetails(token: string): Promise<ForgotPasswordTokenDTO | null> {
		try {
			const tokenDoc = await ForgotTokenModel.findOne({ token }).populate("userId");
			if (!tokenDoc || !tokenDoc.userId) return null;
			return ForgotPasswordTokenDTO.fromEntity(tokenDoc);
		} catch (error) {
			return handleError(error, "Error finding forgot password token");
		}
	}

	async findToken(token: string): Promise<ForgotPasswordTokenEntity | null> {
		try {
			const tokenDoc = await ForgotTokenModel.findOne({ token }).populate("userId");
			if (!tokenDoc) return null;
			return ForgotPasswordTokenEntity.fromDBDocument({ token: tokenDoc.token, userId: tokenDoc.userId.toString(), expiresAt: tokenDoc.expires });
		} catch (error) {
			return handleError(error, "Error finding forgot password token");
		}
	}

	async findUserByResetToken(token: string): Promise<UserEntity | null> {
		try {
			const tokenDoc = await ForgotTokenModel.findOne({ token }).populate("userId");
			// console.log("Token Document: ", tokenDoc);

			if (!tokenDoc || !tokenDoc.userId) return null;

			return UserEntity.fromDBDocument(tokenDoc.userId);
		} catch (error) {
			return handleError(error, "Error finding user by forgot password token");
		}
	}
}

import { IForgotPasswordTokensRepository } from "../../../domain/dbrepository/forgot.password.token.respository";
import { ForgotPasswordTokenEntity } from "../../../domain/entities/forgot.password.token.entity";
import { IVerifyResetTokenUseCase } from "../../interfaces/auth.usecases";

export class VerifyResetTokenUseCase implements IVerifyResetTokenUseCase {
	constructor(private resetRepo: IForgotPasswordTokensRepository) {}

	async execute(token: string) {
		// const user = await this.resetRepo.findUserByResetToken(token);
		// const userDetails = user?.getProfile();
		const tokenDoc = await this.resetRepo.findToken(token);
		console.log('tokenDoc: ', tokenDoc);

		if (!tokenDoc ||!tokenDoc.getToken() || tokenDoc.isExpired()) {
			return false;
		}
		return true;
	}
}

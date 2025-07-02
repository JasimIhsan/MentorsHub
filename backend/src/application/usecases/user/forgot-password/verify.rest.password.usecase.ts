import { IForgotPasswordTokensRepository } from "../../../../domain/repositories/forgot.password.token.respository";
import { IVerifyResetTokenUseCase } from "../../../interfaces/user/auth.usecases.interfaces";

export class VerifyResetTokenUseCase implements IVerifyResetTokenUseCase {
	constructor(private resetRepo: IForgotPasswordTokensRepository) {}

	async execute(token: string) {
		// const user = await this.resetRepo.findUserByResetToken(token);
		// const userDetails = user?.getProfile();
		const tokenDoc = await this.resetRepo.findToken(token);

		if (!tokenDoc ||!tokenDoc.token || tokenDoc.isExpired()) {
			return false;
		}
		return true;
	}
}

import { IUserRepository } from "../../../domain/dbrepository/user.repository";
import { IVerifyResetTokenUseCase } from "../../../domain/interfaces/auth.usecases";

export class VerifyResetTokenUseCase implements IVerifyResetTokenUseCase{
	constructor(private userRepo: IUserRepository) {}

	async execute(token: string) {
		const user = await this.userRepo.findUserByResetToken(token);
		const userDetails = user?.getProfile();
		if (!user || !userDetails?.resetPasswordExpires || userDetails?.resetPasswordExpires < Date.now()) {
			return false;
		}
		return true;
	}
}

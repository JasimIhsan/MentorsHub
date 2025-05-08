import { IUserRepository } from "../../../../domain/dbrepository/user.repository";
import { ITokenService } from "../../../interfaces/user/token.service.interface";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { ISignInUseCase } from "../../../interfaces/user/auth.usecases.interfaces";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";

export class SigninUseCase implements ISignInUseCase {
	constructor(private userRepo: IUserRepository, private tokenService: ITokenService) {}

	async execute(email: string, password: string) {
		const user = await this.userRepo.findUserByEmail(email);
		if (!user) throw new Error(CommonStringMessage.USER_NOT_FOUND);

		const isPasswordValid = await user.isPasswordValid(password);
		if (!isPasswordValid) throw new Error("Invalid user credentials");
		const userId = user.getId() as string;
		const accessToken = this.tokenService.generateAccessToken(userId);
		const refreshToken = this.tokenService.generateRefreshToken(userId);

		console.log(`\n\nAccess token : `, accessToken);
		return { user, accessToken, refreshToken };
	}
}

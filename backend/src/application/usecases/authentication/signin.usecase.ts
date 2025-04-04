import { IUserRepository } from "../../../domain/dbrepository/user.repository";
import { ITokenService } from "../../interfaces/token.service.interface";
import { UserEntity } from "../../../domain/entities/user.entity";
import { ISignInUseCase } from "../../interfaces/auth.usecases";

export class SigninUseCase implements ISignInUseCase{
	constructor(private userRepo: IUserRepository, private tokenService: ITokenService) {}

	async execute(email: string, password: string) {
		const user = await this.userRepo.findUserByEmail(email);
		console.log(`user in login controller  : `, user);
		if (!user) throw new Error("User not found");

		const isPasswordValid = await user.isPasswordValid(password);
		if (!isPasswordValid) throw new Error("Invalid user credentials");
		const userId = user.getId() as string;
		const accessToken = this.tokenService.generateAccessToken(userId);
		const refreshToken = this.tokenService.generateRefreshToken(userId);
		return { user, accessToken, refreshToken };
	}
}

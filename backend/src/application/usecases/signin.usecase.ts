import { TokenServices } from "../../infrastructure/jwt/jwt.services";
import { IUserRepository } from "../../domain/repository/user.repository";
import bcrypt from "bcrypt";
import { ITokenService } from "../providers/token.service.interface";
import { UserEntity } from "../../domain/entities/user.entity";

export class SigninUseCase {
	constructor(private userRepo: IUserRepository, private tokenService: ITokenService) {}

	async execute(email: string, password: string) {
		const userData = await this.userRepo.findUserByEmail(email);
		if (!userData) throw new Error("User not found");

		const user = new UserEntity(userData);
		const isPasswordValid = await user.isPasswordValid(password);
		if (!isPasswordValid) throw new Error("Invalid password");
		const userId = user.getId() as string;
		const accessToken = this.tokenService.generateAccessToken(userId);
		const refreshToken = this.tokenService.generateRefreshToken(userId);
		return { user, accessToken, refreshToken };
	}
}

import axios from "axios";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { ITokenService } from "../../../interfaces/user/token.service.interface";
import { IGoogleAuthUsecase } from "../../../interfaces/user/auth.usecases.interfaces";

interface GoogleUserData {
	email: string;
	given_name: string;
	family_name: string;
	sub: string;
	picture: string;
}

export class GoogleAuthUsecase implements IGoogleAuthUsecase {
	constructor(private userRepo: IUserRepository, private tokenService: ITokenService) {}

	private async getGoogleUserData(token: string) {
		if (!token) {
			throw new Error("Google token is required");
		}
		const response = await axios.get<GoogleUserData>(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
		return response.data;
	}

	async execute(googleToken: string) {
		try {
			const data = await this.getGoogleUserData(googleToken);
			const userEntity = await UserEntity.createWithGoogle(data.email, "", data.given_name, data.family_name, data.sub, data.picture);

			const user = await this.userRepo.findUserByEmail(data.email);

			if (!user) {
				const newUser = await this.userRepo.createUser(userEntity);
				if (!newUser) {
					throw new Error("User creation failed");
				}
				const accessToken = this.tokenService.generateAccessToken(newUser.getId() as string);
				const refreshToken = this.tokenService.generateRefreshToken(newUser.getId() as string);
				return { user: newUser, accessToken, refreshToken };
			} else {
				const accessToken = this.tokenService.generateAccessToken(user.getId() as string);
				const refreshToken = this.tokenService.generateRefreshToken(user.getId() as string);
				return { user, accessToken, refreshToken };
			}
		} catch (error: any) {
			console.error("Google authentication error: ", error.message);
			throw new Error(error.message || "An error occurred during Google authentication");
		}
	}
}

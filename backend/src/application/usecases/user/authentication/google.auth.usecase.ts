import axios from "axios";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { ITokenService } from "../../../interfaces/usecases/user/token.service.interface";
import { IGoogleAuthUsecase } from "../../../interfaces/usecases/user/auth.usecases.interfaces";
import { IHashService } from "../../../interfaces/services/hash.service";
import { RoleEnum } from "../../../interfaces/enums/role.enum";
import { MentorRequestStatusEnum } from "../../../interfaces/enums/mentor.request.status.enum";
import { UserStatusEnums } from "../../../interfaces/enums/user.status.enums";
import { mapToUserDTO } from "../../../dtos/user.dtos";

interface GoogleUserData {
	email: string;
	given_name: string;
	family_name: string;
	sub: string;
	picture: string;
}

export class GoogleAuthUsecase implements IGoogleAuthUsecase {
	constructor(private readonly userRepo: IUserRepository, private readonly tokenService: ITokenService, private readonly hashService: IHashService) {}

	private async getGoogleUserData(idToken: string): Promise<GoogleUserData> {
		if (!idToken) throw new Error("Google token is required");
		const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`;
		const { data } = await axios.get<GoogleUserData>(url);
		return data;
	}

	async execute(googleToken: string) {
		try {
			const gUser = await this.getGoogleUserData(googleToken);

			let user = await this.userRepo.findUserByEmail(gUser.email);

			if (!user) {
				const randomPassword = this.hashService.generatePassword(); // plain random
				const hashedPassword = await this.hashService.hashPassword(randomPassword);

				const newUser = new UserEntity({
					email: gUser.email,
					password: hashedPassword,
					firstName: gUser.given_name,
					lastName: gUser.family_name,
					avatar: gUser.picture,
					role: RoleEnum.USER,
					status: UserStatusEnums.UNBLOCKED,
					mentorRequestStatus: MentorRequestStatusEnum.NOT_REQUESTED,
					googleId: gUser.sub,
					sessionCompleted: 0,
					averageRating: 0,
					totalReviews: 0,
					createdAt: new Date(),
				});

				user = await this.userRepo.createUser(newUser);
			}

			const accessToken = this.tokenService.generateAccessToken(user.id!);
			const refreshToken = this.tokenService.generateRefreshToken(user.id!);

			return { user: mapToUserDTO(user), accessToken, refreshToken };
		} catch (err) {
			console.error("Google authentication error:", err);
			throw new Error(err instanceof Error ? err.message : "An error occurred during Google authentication");
		}
	}
}

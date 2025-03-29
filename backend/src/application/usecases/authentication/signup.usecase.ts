import { UserInterface, UserEntity } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/dbrepository/user.repository";
import bcrypt from "bcrypt";
import { ITokenService } from "../../interfaces/token.service.interface";

export class SignupUseCase {
	constructor(private userRepository: IUserRepository, private tokenSerivice: ITokenService) {}

	async execute(email: string, password: string, firstName: string, lastName: string) {
		const existingUser = await this.userRepository.findUserByEmail(email);
		if (existingUser) throw new Error("User already exists");

		//create new user entity without id
		const newUser = await UserEntity.create(email, password, firstName, lastName);

		// save new user (database will genreate id)
		const savedUser = await this.userRepository.createUser(newUser);
		const userId = savedUser.getId();
		if (!userId) throw new Error("User ID is undefined after saving");
		const accessToken = this.tokenSerivice.generateAccessToken(userId);
		const refreshToken = this.tokenSerivice.generateRefreshToken(userId);
		return { user: newUser, refreshToken, accessToken };
	}
}

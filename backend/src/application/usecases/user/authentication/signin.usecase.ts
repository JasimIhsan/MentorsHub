import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { ITokenService } from "../../../interfaces/user/token.service.interface";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { ISignInUseCase } from "../../../interfaces/user/auth.usecases.interfaces";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IHashService } from "../../../interfaces/services/hash.service";
import { IUserDTO, mapToUserDTO } from "../../../dtos/user.dtos";

export class SigninUseCase implements ISignInUseCase {
	constructor(private userRepo: IUserRepository, private tokenService: ITokenService, private hashService: IHashService) {}

	async execute(email: string, password: string): Promise<{ user: IUserDTO; refreshToken: string; accessToken: string }> {
		const userEntity = await this.userRepo.findUserByEmail(email);
		if (!userEntity) throw new Error(CommonStringMessage.USER_NOT_FOUND);

		const isPasswordValid = await this.hashService.comparePassword(password, userEntity.password);
		if (!isPasswordValid) throw new Error(CommonStringMessage.USER_INVALID_CREDENTIALS);
		const userId = userEntity.id!;
		const accessToken = this.tokenService.generateAccessToken(userId);
		const refreshToken = this.tokenService.generateRefreshToken(userId);

		const user = mapToUserDTO(userEntity);

		return { user, accessToken, refreshToken };
	}
}

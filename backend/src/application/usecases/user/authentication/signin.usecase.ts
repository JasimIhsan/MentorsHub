import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { ITokenService } from "../../../interfaces/usecases/user/token.service.interface";
import { ISignInUseCase } from "../../../interfaces/usecases/user/auth.usecases.interfaces";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { IHashService } from "../../../interfaces/services/hash.service";
import { IUserDTO, mapToUserDTO } from "../../../dtos/user.dtos";
import { INotifyUserUseCase } from "../../../interfaces/usecases/notification/notification.usecase";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";

export class SigninUseCase implements ISignInUseCase {
	constructor(private userRepo: IUserRepository, private tokenService: ITokenService, private hashService: IHashService, private notifyUserUseCase: INotifyUserUseCase) {}

	async execute(email: string, password: string): Promise<{ user: IUserDTO; refreshToken: string; accessToken: string }> {
		const userEntity = await this.userRepo.findUserByEmail(email);
		if (!userEntity) throw new Error(CommonStringMessage.USER_NOT_FOUND);

		const isPasswordValid = await this.hashService.comparePassword(password, userEntity.password);
		if (!isPasswordValid) throw new Error(CommonStringMessage.USER_INVALID_CREDENTIALS);

		const userId = userEntity.id!;
		const accessToken = this.tokenService.generateAccessToken(userId);
		const refreshToken = this.tokenService.generateRefreshToken(userId);
		const user = mapToUserDTO(userEntity);

		await this.notifyUserUseCase.execute({
			title: "👋 Welcome Back!",
			message: `Hi ${user.firstName}, glad to see you again!`,
			isRead: false,
			recipientId: userId,
			type: NotificationTypeEnum.WELCOME,
		});

		return { user, accessToken, refreshToken };
	}
}

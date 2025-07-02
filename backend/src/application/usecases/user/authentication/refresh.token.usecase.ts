import { ITokenService } from "../../../interfaces/user/token.service.interface";
import { IRefreshTokenUsecase } from "../../../interfaces/user/auth.usecases.interfaces";

export class RefreshTokenUseCase implements IRefreshTokenUsecase {
	constructor(private tokenServices: ITokenService) {}

	execute(userId: string, isAdmin: boolean): string {
		const newAccessToken = this.tokenServices.generateAccessToken(userId, isAdmin);
		return newAccessToken;
	}
}

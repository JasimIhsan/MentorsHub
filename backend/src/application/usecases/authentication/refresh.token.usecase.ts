import { JwtPayload } from "jsonwebtoken";
import { UserInterface } from "../../../domain/entities/user.entity";
import { ITokenService } from "../../providers/token.service.interface";

export class RefreshTokenUseCase {
	constructor(private tokenServices: ITokenService) {}

	execute(userId: string) {
		const newAccessToken =  this.tokenServices.generateAccessToken(userId);
		return newAccessToken;
	}
}

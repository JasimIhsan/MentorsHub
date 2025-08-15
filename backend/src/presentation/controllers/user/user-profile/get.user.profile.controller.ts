import { NextFunction, Request, Response } from "express";
import { IGetUserProfileUseCase } from "../../../../application/interfaces/usecases/user/user.profile.usecase.interfaces";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";
export interface CustomRequest extends Request {
	user: UserEntity;
}
export class GetUserProfileController {
	constructor(private getUserProfileUsecase: IGetUserProfileUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId } = req.params;
			const user = await this.getUserProfileUsecase.execute(userId as string);
			res.status(HttpStatusCode.OK).json({ success: true, user });
		} catch (error) {
			logger.error(`❌ Error in GetUserProfileController: ${error}`);
			next(error);
		}
	}
}

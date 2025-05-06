import { Request, Response } from "express";
import { IGetUserProfileUseCase } from "../../../../application/interfaces/user/user.profile.usecase.interfaces";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
export interface CustomRequest extends Request {
	user: UserEntity;
}
export class GetUserProfileController {
	constructor(private getUserProfileUsecase: IGetUserProfileUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const customReq = req as CustomRequest;
			const userId = customReq.user.getId();
			const user = await this.getUserProfileUsecase.execute(userId as string);
			res.status(HttpStatusCode.OK).json(user);
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

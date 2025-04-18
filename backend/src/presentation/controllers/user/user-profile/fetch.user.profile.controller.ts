import { Request, Response } from "express";
import { IFetchUserProfileUseCase } from "../../../../application/interfaces/user/user.profile.usecase.interfaces";
import { UserEntity } from "../../../../domain/entities/user.entity";
export interface CustomRequest extends Request {
	user: UserEntity;
}
export class FetchUserProfileController {
	constructor(private fetchUserProfileUsecase: IFetchUserProfileUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const customReq = req as CustomRequest;
			console.log("user id : ", customReq.user.getId());
			const userId = customReq.user.getId();
			const user = await this.fetchUserProfileUsecase.execute(userId as string);
			res.status(200).json(user);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ success: false, message: error.message });
			}
		}
	}
}

import { Request, Response } from "express";
import { IUpdateUserProfileUseCase } from "../../../application/interfaces/user/user.profile.usecase.interfaces";

export class UpdateUserProfileController {
	constructor(private updateUserProfileUseCase: IUpdateUserProfileUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const { userId, data } = req.body;
			console.log("userId: ", userId);

			const user = await this.updateUserProfileUseCase.execute(userId, data);

			res.status(200).json({ success: true, user });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ error: error.message });
			}
		}
	}
}

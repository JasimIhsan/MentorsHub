import { Request, Response } from "express";
import { IChangePasswordUseCase } from "../../../../application/interfaces/user/user.profile.usecase.interfaces";

export class ChangePasswordController {
	constructor(private changePasswordUsecase: IChangePasswordUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const { userId, oldPassword, newPassword } = req.body;

			const user = await this.changePasswordUsecase.execute(userId, oldPassword, newPassword);

			res.status(200).json({ success: true, user });
		} catch (error) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
				return;
			}
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

}


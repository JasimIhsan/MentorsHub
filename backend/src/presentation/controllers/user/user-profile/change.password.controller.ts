import { Request, Response } from "express";
import { IChangePasswordUseCase } from "../../../../application/interfaces/user/user.profile.usecase.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class ChangePasswordController {
	constructor(private changePasswordUsecase: IChangePasswordUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const { userId, oldPassword, newPassword } = req.body;

			const user = await this.changePasswordUsecase.execute(userId, oldPassword, newPassword);

			res.status(HttpStatusCode.OK).json({ success: true, user });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
				return;
			}
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
		}
	}

}


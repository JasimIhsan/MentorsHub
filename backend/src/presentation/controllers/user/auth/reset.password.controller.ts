import { Request, Response } from "express";
import { IResetPasswordUseCase } from "../../../../application/interfaces/user/auth.usecases.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class ResetPasswordController {
	constructor(private restPasswordUseCase: IResetPasswordUseCase) {}

	async handle(req: Request, res: Response) {
		try {
			const { token, newPassword } = req.body;
			await this.restPasswordUseCase.execute(token, newPassword);
			res.status(HttpStatusCode.OK).json({ success: true, message: "Password reset successfully" });
		} catch (error) {
			if (error instanceof Error) {
				console.log("error from controller: ", error.message);
				res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
				return;
			}
			res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Internal server error" });
		}
	}
}

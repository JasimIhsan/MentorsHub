import { Request, Response } from "express";
import { IResetPasswordUseCase } from "../../application/interfaces/auth.usecases";

export class ResetPasswordController {
	constructor(private restPasswordUseCase: IResetPasswordUseCase) {}

	async handle(req: Request, res: Response) {
		try {
			const { token, newPassword } = req.body;
			await this.restPasswordUseCase.execute(token, newPassword);
			res.status(200).json({ success: true, message: "Password reset successfully" });
		} catch (error) {
			if (error instanceof Error) {
				console.log("error from controller: ", error.message);
				res.status(400).json({ message: error.message });
				return;
			}
			res.status(400).json({ message: "Internal server error" });
		}
	}
}

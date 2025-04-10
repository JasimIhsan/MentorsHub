import { Request, Response } from "express";
import { IVerifyResetTokenUseCase } from "../../../../application/interfaces/user/auth.usecases.interfaces";

export class VerifyResetTokenController {
	constructor(private verifyTokenUseCase: IVerifyResetTokenUseCase) {}

	async handle(req: Request, res: Response) {
		try {
			const { token } = req.params;
			if (!token) {
				res.status(400).json({ success: false, message: "Token is required" });
				return;
			}
			const isValid = await this.verifyTokenUseCase.execute(token);
			console.log('isValid: ', isValid);

			if (isValid) {
				res.status(200).json({ success: true, message: "Token is valid" });
			} else {
				res.status(400).json({ success: false, message: "Token is invalid" });
			}
		} catch (error) {
			res.status(500).json({ success: false, message: "Internal Server Error" });
		}
	}
}

import { Request, Response } from "express";
import { IVerifyResetTokenUseCase } from "../../../../application/interfaces/user/auth.usecases.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";

export class VerifyResetTokenController {
	constructor(private verifyTokenUseCase: IVerifyResetTokenUseCase) {}

	async handle(req: Request, res: Response) {
		try {
			const { token } = req.params;
			if (!token) {
				res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Token is required" });
				return;
			}
			const isValid = await this.verifyTokenUseCase.execute(token);

			if (isValid) {
				res.status(HttpStatusCode.OK).json({ success: true, message: "Token is valid" });
			} else {
				res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Token is invalid" });
			}
		} catch (error) {
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: CommonStringMessage.SERVER_ERROR_MESSAGE });
		}
	}
}

import { Request, Response } from "express";
import { ISendOtpUsecase } from "../../../../application/interfaces/user/auth.usecases.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";

export class SendOtpController {
	constructor(private sendOtpUseCase: ISendOtpUsecase) {}

	async handle(req: Request, res: Response) {
		try {
			console.log(`in send`);
			const { email } = req.body;

			if (!email) {
				res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Email is required" });
				return;
			}
			await this.sendOtpUseCase.execute(email);
			res.status(HttpStatusCode.OK).json({ success: true, message: "OTP sent successfully" });
		} catch (error) {
			if (error instanceof Error) {
				console.error("Send OTP error:", error.message);
				res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: error.message });
				return;
			}
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: CommonStringMessage.SERVER_ERROR_MESSAGE });
		}
	}
}

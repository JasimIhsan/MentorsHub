import { Request, Response } from "express";
import { ISendOtpUsecase } from "../../../application/interfaces/user/auth.usecases.interfaces";

export class SendOtpController {
	constructor(private sendOtpUseCase: ISendOtpUsecase) {}

	async handle(req: Request, res: Response) {
		try {
			console.log(`in send`);
			const { email } = req.body;

			if (!email) {
				res.status(400).json({ success: false, message: "Email is required" });
				return;
			}
			await this.sendOtpUseCase.execute(email);
			res.status(200).json({ success: true, message: "OTP sent successfully" });
		} catch (error) {
			if (error instanceof Error) {
				console.error("Send OTP error:", error.message);
				res.status(400).json({ success: false, message: error.message });
				return;
			}
			res.status(500).json({ success: false, message: "Internal Server Error" });
		}
	}
}

import { Request, Response } from "express";
import { IForgotPasswordUseCase } from "../../../application/interfaces/user/auth.usecases.interfaces";

export class ForgotPasswrodController {
	constructor(private forgotUseCase: IForgotPasswordUseCase) {}

	async handle(req: Request, res: Response) {
		try {
			const { email } = req.body;
			if (!email) {
				res.status(400).json({ success: false, message: "Email is required" });
				return;
			}
			await this.forgotUseCase.execute(email);
			res.status(200).json({ success: true, message: "Password reset link sent to your email" });
		} catch (error) {
			console.error("Forgot password error:", error);
			if (error instanceof Error) res.status(500).json({ success: false, message: error.message || "Failed to send magic link" });
		}
	}
}

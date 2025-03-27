import { Request, Response } from "express";
import { SignupUseCase } from "../../application/usecases/signup.usecase";

export class SignupController {
	constructor(private signupUseCase: SignupUseCase) {}

	async handle(req: Request, res: Response) {
		try {
			const { email, password, firstName, lastName } = req.body;
			const { user, refreshToken, accessToken } = await this.signupUseCase.execute(email, password, firstName, lastName);

			res.cookie("refresh_token", refreshToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 15 * 1000 });
			res.cookie("access_token", accessToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 5 * 1000 });

			res.status(201).json({ success: true, user });
		} catch (error: any) {
			res.status(400).json({ success: false, message: error.message });
		}
	}
}

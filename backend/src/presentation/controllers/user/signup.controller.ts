import { Request, Response } from "express";
import { ISignupUseCase } from "../../../application/interfaces/user/auth.usecases.interfaces";

export class SignupController {
	constructor(private signupUseCase: ISignupUseCase) {}

	async handle(req: Request, res: Response) {
		try {
			console.log(`in signup`);
			const { otp, signupData } = req.body;
			console.log("signupData: ", signupData);

			const { user, refreshToken, accessToken } = await this.signupUseCase.execute(otp, signupData.firstName, signupData.lastName, signupData.email, signupData.password);

			res.cookie("refresh_token", refreshToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 15 * 1000 });
			res.cookie("access_token", accessToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 5 * 1000 });

			res.status(201).json({ success: true, user });
		} catch (error: any) {
			res.status(400).json({ success: false, message: error.message });
		}
	}
}

import { Request, Response } from "express";
import { ISignupUseCase } from "../../../../application/interfaces/user/auth.usecases.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class SignupController {
	constructor(private signupUseCase: ISignupUseCase) {}

	async handle(req: Request, res: Response) {
		try {
			const { otp, signupData } = req.body;

			const { user, refreshToken, accessToken } = await this.signupUseCase.execute(otp, signupData.firstName, signupData.lastName, signupData.email, signupData.password);

			res.cookie("refresh_token", refreshToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 15 * 1000 });
			res.cookie("access_token", accessToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 5 * 1000 });

			res.status(HttpStatusCode.CREATED).json({ success: true, user });
		} catch (error: any) {
			res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: error.message });
		}
	}
}

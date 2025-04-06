import { Request, Response } from "express";
import { ISignInUseCase } from "../../../application/interfaces/user/auth.usecases";

export class SigninController {
	constructor(private signinUseCase: ISignInUseCase) {}

	async handle(req: Request, res: Response) {
		try {
			console.log(`in login controller`);
			const { email, password } = req.body;
			const { user, accessToken, refreshToken } = await this.signinUseCase.execute(email, password);

			res.cookie("refresh_token", refreshToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 15 * 1000, secure: true });
			res.cookie("access_token", accessToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 5 * 1000, secure: true });

			res.status(200).json({ success: true, user });
		} catch (error) {
			console.log(`error in login controller: `, error);
			if (error instanceof Error) {
				console.log(error.message)
				res.status(404).json({ success: false, message: error.message });
				return;
			}
			res.status(500).json({ success: false, message: "Internal Server Error" });
		}
	}
}

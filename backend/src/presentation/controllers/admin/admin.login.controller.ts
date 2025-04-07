import { Request, Response } from "express";
import { IAdminAuthUsecase } from "../../../application/interfaces/admin/admin.auth.interface";

export class AdminLoginController {
	constructor(private adminLoginUsecase: IAdminAuthUsecase) {}

	async handle(req: Request, res: Response) {
		try {
			const { username, password } = req.body;

			const { admin, accessToken, refreshToken } = await this.adminLoginUsecase.execute(username, password);
			res.cookie("refresh_token", refreshToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 15 * 1000, secure: true });
			res.cookie("access_token", accessToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 5 * 1000, secure: true });
			res.status(200).json({ success: true, admin });
		} catch (error) {
			if (error instanceof Error) {
				res.status(400).json({ success: false, message: error.message });
				return;
			}
			res.status(500).json({ success: false, message: "Internal Server Error" });
		}
	}
}

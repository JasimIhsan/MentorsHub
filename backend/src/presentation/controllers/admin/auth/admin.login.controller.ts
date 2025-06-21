import { Request, Response } from "express";
import { IAdminAuthUsecase } from "../../../../application/interfaces/admin/admin.auth.interface";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { CommonStringMessage } from "../../../../shared/constants/string.messages";

export class AdminLoginController {
	constructor(private adminLoginUsecase: IAdminAuthUsecase) {}

	async handle(req: Request, res: Response) {
		try {
			const { username, password } = req.body;

			const { admin, accessToken, refreshToken } = await this.adminLoginUsecase.execute(username, password);

			res.cookie("access_token", accessToken, {
				httpOnly: true,
				sameSite: "strict",
				secure: true,
				maxAge: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES as string), // 5 minutes
			});

			res.cookie("refresh_token", refreshToken, {
				httpOnly: true,
				sameSite: "strict",
				secure: true,
				maxAge: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES as string), // 24 hours
			});

			res.status(HttpStatusCode.OK).json({ success: true, admin });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: error.message });
				return;
			}
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: CommonStringMessage.SERVER_ERROR_MESSAGE });
		}
	}
}

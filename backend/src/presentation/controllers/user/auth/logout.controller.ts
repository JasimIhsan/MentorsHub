import { Request, Response } from "express";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class LogoutController {
	handle(req: Request, res: Response) {
		try {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			res.status(HttpStatusCode.OK).json({ success: true, message: "Logged out successfully" });
		} catch (error) {
			if (error instanceof Error) {
				console.log("error from controller: ", error.message);
				res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
				return;
			}
			console.log("An error occurred while logging out: ", error);
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while logging out" });
			return;
		}
	}
}

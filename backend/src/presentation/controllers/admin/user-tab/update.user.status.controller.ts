import { Request, Response } from "express";
import { IUpdateUserStatusUsecase } from "../../../../application/interfaces/admin/admin.usertab.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class UpdateUserStatusController {
	constructor(private updateUserStatusUsecase: IUpdateUserStatusUsecase) {}

	async handle(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.params;
			const updatedUser = await this.updateUserStatusUsecase.execute(userId);
			res.status(HttpStatusCode.OK).json({ success: true, user: updatedUser });
		} catch (error) {
			if (error instanceof Error) {
				console.log("error : ", error);
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
				return;
			}
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "An unexpected error occurred" });
		}
	}
}

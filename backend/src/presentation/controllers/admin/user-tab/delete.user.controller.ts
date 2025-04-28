import { Request, Response } from "express";
import { IDeleteUserUsecase } from "../../../../application/interfaces/admin/admin.usertab.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class DeleteUserController {
	constructor(private deleteUserUsecase: IDeleteUserUsecase) {}

	async handle(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.params.id;
			await this.deleteUserUsecase.execute(userId);
			res.status(HttpStatusCode.OK).json({ success: true, message: "User deleted successfully" });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: error.message });
				return;
			}
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
		}
	}
}

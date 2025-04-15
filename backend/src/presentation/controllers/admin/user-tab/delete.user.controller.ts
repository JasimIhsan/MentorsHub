import { Request, Response } from "express";
import { IDeleteUserUsecase } from "../../../../application/interfaces/admin/admin.usertab.interfaces";

export class DeleteUserController {
	constructor(private deleteUserUsecase: IDeleteUserUsecase) {}

	async handle(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.params.id;
			await this.deleteUserUsecase.execute(userId);
			res.status(200).json({ success: true, message: "User deleted successfully" });
		} catch (error) {
			if (error instanceof Error) {
				res.status(404).json({ success: false, message: error.message });
				return;
			}
			res.status(500).json({ success: false, message: "Internal Server Error" });
		}
	}
}

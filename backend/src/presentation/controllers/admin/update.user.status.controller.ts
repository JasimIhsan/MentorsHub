import { Request, Response } from "express";
import { IUpdateUserStatusUsecase } from "../../../application/interfaces/admin/admin.usertab.interfaces";

export class UpdateUserStatusController {
	constructor(private updateUserStatusUsecase: IUpdateUserStatusUsecase) {}

	async handle(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.params;
			const updatedUser = await this.updateUserStatusUsecase.execute(userId);
			res.status(200).json({ success: true, user: updatedUser });
		} catch (error) {
			if (error instanceof Error) {
				console.log('error : ', error);
				res.status(500).json({ message: error.message });
				return;
			}
			res.status(500).json({ message: "An unexpected error occurred" });
		}
	}
}

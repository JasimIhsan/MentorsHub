import { Request, Response } from "express";
import { UpdateUserUsecase } from "../../../application/usecases/admin/users.tab.ts/update.user.usecase";
import { IUserDTO } from "../../../application/dtos/user.dtos";

export class UpdateUserController {
	constructor(private updateUserUsecase: UpdateUserUsecase) {}

	async handle(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.params;
			const userData: Partial<IUserDTO> = req.body;

			const updatedUser = await this.updateUserUsecase.execute(userId, userData);
			res.status(200).json({ success: true, user: updatedUser });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message });
			} else {
				res.status(500).json({ message: "An unexpected error occurred" });
			}
		}
	}
}

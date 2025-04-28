import { Request, Response } from "express";
import { IUserDTO } from "../../../../application/dtos/user.dtos";
import { IUpdateUserProfileUseCase } from "../../../../application/interfaces/user/user.profile.usecase.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class UpdateUserController {
	constructor(private updateUserUsecase: IUpdateUserProfileUseCase) {}

	async handle(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.params;
			const userData: Partial<IUserDTO> = req.body;

			const updatedUser = await this.updateUserUsecase.execute(userId, userData);
			res.status(HttpStatusCode.OK).json({ success: true, user: updatedUser });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
			} else {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "An unexpected error occurred" });
			}
		}
	}
}

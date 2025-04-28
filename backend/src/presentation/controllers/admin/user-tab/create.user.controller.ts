import { Request, Response } from "express";
import { ICreateUserUsecase } from "../../../../application/interfaces/admin/admin.usertab.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class CreateUserController {
	constructor(private createUserUsecase: ICreateUserUsecase) {}

	async handle(req: Request, res: Response): Promise<void> {
		try {
			const { firstName, lastName, email, role } = req.body;
			const user = await this.createUserUsecase.execute(firstName, lastName, email, role);
			res.status(201).json({ success: true, user });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
			} else {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "An unexpected error occurred" });
			}
		}
	}
}
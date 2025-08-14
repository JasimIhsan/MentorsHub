import { NextFunction, Request, Response } from "express";
import { ICreateUserUsecase } from "../../../../application/interfaces/usecases/admin/admin.usertab.interfaces";
import { logger } from "../../../../infrastructure/utils/logger";

export class CreateUserController {
	constructor(private createUserUsecase: ICreateUserUsecase) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { firstName, lastName, email, role } = req.body;
			const user = await this.createUserUsecase.execute(firstName, lastName, email, role);
			res.status(201).json({ success: true, user });
		} catch (error) {
			logger.error(`❌ Error in CreateUserController: ${error}`);
			next(error);
		}
	}
}
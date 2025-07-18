// presentation/controllers/admin/action-type.controller.ts
import { Request, Response, NextFunction } from "express";
import { ICreateActionTypeUseCase, IGetAllActionTypeUseCase } from "../../../../application/interfaces/action.type";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class ActionTypeController {
	constructor(private getUseCase: IGetAllActionTypeUseCase, private createUseCase: ICreateActionTypeUseCase) {}

	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const types = await this.getUseCase.execute();
			res.status(HttpStatusCode.OK).json({ success: true, actionTypes: types });
		} catch (err) {
			next(err);
		}
	}

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const { label } = req.body;
			const type = await this.createUseCase.execute(label);
			res.status(HttpStatusCode.CREATED).json({ success: true, message: "Action type created", actionType: type });
		} catch (err) {
			next(err);
		}
	}
}

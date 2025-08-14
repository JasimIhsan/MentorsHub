// src/interfaces/controllers/documents/get.documents.controller.ts
import { NextFunction, Request, Response } from "express";
import { UserEntity } from "../../../domain/entities/user.entity";
import { AdminEntity } from "../../../domain/entities/admin.entity";
import { IGetDocumentsUseCase } from "../../../application/interfaces/usecases/documents";
import { logger } from "../../../infrastructure/utils/logger";

export interface CustomRequest extends Request {
	user: UserEntity | AdminEntity;
}

export class GetDocumentsController {
	constructor(private getDocumentsUseCase: IGetDocumentsUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const customReq = req as CustomRequest;
			const mentorId = req.params.id;
			const user = customReq.user;

			const documents = await this.getDocumentsUseCase.execute({ mentorId, user });

			res.json({ success: true, documents });
		} catch (error) {
			logger.error(`❌ Error in GetDocumentsController: ${error}`);
			next(error);
		}
	}
}

import { Request, Response, NextFunction } from "express";
import { IGetDocumentByKeyUseCase } from "../../../application/interfaces/usecases/documents";
import { AdminEntity } from "../../../domain/entities/admin.entity";
import { UserEntity } from "../../../domain/entities/user.entity";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export interface CustomRequest extends Request {
	user: UserEntity | AdminEntity;
}

export class GetDocumentByKeyController {
	constructor(private readonly _useCase: IGetDocumentByKeyUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		console.log("contoller invoke");
		try {
			const customReq = req as CustomRequest;
			const mentorId = req.params.id;
			const user = customReq.user;
			const documentKey = req.query.documentKey;

			const document = await this._useCase.execute({ mentorId, user, documentKey: documentKey as string });
			console.log("document: ", document);

			// Redirect to S3 URL, user won’t see it in frontend code
			// res.redirect(document);
			res.status(HttpStatusCode.OK).json({ success: true, document });
		} catch (error) {
			next(error);
		}
	}
}

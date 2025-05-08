// src/interfaces/controllers/documents/get.documents.controller.ts
import { Request, Response } from "express";
import { UserEntity } from "../../../domain/entities/user.entity";
import { AdminEntity } from "../../../domain/entities/admin.entity";
import { IGetMentorUsecase } from "../../../application/interfaces/mentors/mentors.interface";
import { IGetDocumentsUseCase } from "../../../application/interfaces/documents";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export interface CustomRequest extends Request {
	user: UserEntity | AdminEntity;
}

// export const getMentorDocumentsController = async (req: Request, res: Response) => {
// 	try {
// 		const customReq = req as CustomRequest;
// 		const mentorId = req.params.id;
// 		const user = customReq.user;

// 		const useCase = new GetMentorDocumentsUseCase(new MentorDetailsRepositoryImpl(), new S3Service());

// 		const documents = await useCase.execute({ mentorId, user });
// 		res.json({ success: true, documents });
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ success: false, message: "Something went wrong" });
// 	}
// };

export class GetDocumentsController {
	constructor(private getDocumentsUseCase: IGetDocumentsUseCase) {}
	async handle(req: Request, res: Response) {
		try {
			const customReq = req as CustomRequest;
			const mentorId = req.params.id;
			const user = customReq.user;

			const documents = await this.getDocumentsUseCase.execute({ mentorId, user });

			res.json({ success: true, documents });
		} catch (error) {
			if(error instanceof Error) res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
		}
	}
}

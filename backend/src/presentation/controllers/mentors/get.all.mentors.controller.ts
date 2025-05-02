import { IGetAllMentorsUsecase } from "../../../application/interfaces/mentors/mentors.interface";
import { Request, Response } from "express";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetAllMentorsController {
	constructor(private getAllMentorsUsecase: IGetAllMentorsUsecase) {}
	async handle(req: Request, res: Response) {
		try {
			const mentors = await this.getAllMentorsUsecase.execute();
			res.status(HttpStatusCode.OK).json({ success: true, mentors });
		} catch (error) {
			if (error instanceof Error) res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
			else res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Unexpected error" });
		}
	}
}

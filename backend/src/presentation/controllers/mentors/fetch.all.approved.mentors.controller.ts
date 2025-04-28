import { Request, Response } from "express";
import { IFetchAllApprovedMentorsUsecase } from "../../../application/interfaces/mentors/mentors.interface";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class FetchAllApprovedMentorsController {
	constructor(private fetchAllApprovedMentorsUsecase: IFetchAllApprovedMentorsUsecase) {}
	async handle(req: Request, res: Response) {
		try {
			const mentors = await this.fetchAllApprovedMentorsUsecase.execute();
			res.status(HttpStatusCode.OK).json({ success: true, mentors });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			}
		}
	}
}

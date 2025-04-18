import { Request, Response } from "express";
import { IFetchAllApprovedMentorsUsecase } from "../../../application/interfaces/mentors/mentors.interface";

export class FetchAllApprovedMentorsController {
	constructor(private fetchAllApprovedMentorsUsecase: IFetchAllApprovedMentorsUsecase) {}
	async handle(req: Request, res: Response) {
		try {
			const mentors = await this.fetchAllApprovedMentorsUsecase.execute();
			res.status(200).json({ success: true, mentors });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ success: false, message: error.message });
			}
		}
	}
}

import { IFetchAllMentorsUsecase } from "../../../application/interfaces/mentors/mentors.interface";
import { Request, Response } from "express";

export class FetchAllMentorsController {
	constructor(private fetchAllMentorsUsecase: IFetchAllMentorsUsecase) {}
	async handle(req: Request, res: Response) {
		try {
			const mentors = await this.fetchAllMentorsUsecase.execute();
			res.status(200).json({ success: true, mentors });
		} catch (error) {
			if (error instanceof Error) res.status(500).json({ message: error.message });
			else res.status(500).json({ message: "Unexpected error" });
		}
	}
}

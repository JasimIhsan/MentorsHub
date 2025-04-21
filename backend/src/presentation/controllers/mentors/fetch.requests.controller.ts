import { Request, Response } from "express";
import { IFetchSessionRequests } from "../../../application/interfaces/mentors/mentors.interface";

export class FetchRequestsController {
  constructor(private fetchAllRequestsByMentorUsecase: IFetchSessionRequests) {}
  async handle(req: Request, res: Response) {
	 try {
		const { mentorId } = req.params;
		const requests = await this.fetchAllRequestsByMentorUsecase.execute(mentorId);
		res.status(200).json({ success : true, requests});
	 } catch (error) {
		if(error instanceof Error){
		  res.status(500).json({ success: false, message: error.message });
		}
	 }
  }
}
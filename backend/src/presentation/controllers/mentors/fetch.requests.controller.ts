import { Request, Response } from "express";
import { IFetchSessionRequests } from "../../../application/interfaces/mentors/mentors.interface";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class FetchRequestsController {
  constructor(private fetchAllRequestsByMentorUsecase: IFetchSessionRequests) {}
  async handle(req: Request, res: Response) {
	 try {
		const { mentorId } = req.params;
		const requests = await this.fetchAllRequestsByMentorUsecase.execute(mentorId);
		res.status(HttpStatusCode.OK).json({ success : true, requests});
	 } catch (error) {
		if(error instanceof Error){
		  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
		}
	 }
  }
}
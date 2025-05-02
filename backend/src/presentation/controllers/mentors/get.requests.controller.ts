import { Request, Response } from "express";
import { IGetSessionRequests } from "../../../application/interfaces/mentors/mentors.interface";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetRequestsController {
  constructor(private getAllRequestsByMentorUsecase: IGetSessionRequests) {}
  async handle(req: Request, res: Response) {
	 try {
		const { mentorId } = req.params;
		const requests = await this.getAllRequestsByMentorUsecase.execute(mentorId);
		res.status(HttpStatusCode.OK).json({ success : true, requests});
	 } catch (error) {
		if(error instanceof Error){
		  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
		}
	 }
  }
}
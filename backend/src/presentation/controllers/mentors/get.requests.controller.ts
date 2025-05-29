import { Request, Response } from "express";
import { IGetSessionRequests } from "../../../application/interfaces/mentors/mentors.interface";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class GetRequestsController {
	constructor(private getAllRequestsByMentorUsecase: IGetSessionRequests) {}

	async handle(req: Request, res: Response) {
		try {
			const { mentorId } = req.params;
			const { status, pricing, dateRange, page = "1", limit = "6" } = req.query;

			const queryParams = {
				status: status as string | undefined,
				pricing: pricing as string | undefined,
				dateRange: dateRange as "today" | "week" | "all" | "free" | "paid",
				page: parseInt(page as string, 10),
				limit: parseInt(limit as string, 10),
			};

			const result = await this.getAllRequestsByMentorUsecase.execute(mentorId, queryParams);

			res.status(HttpStatusCode.OK).json({
				success: true,
				requests: result.requests,
				total: result.total,
			});
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
			} else {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Unknown error" });
			}
		}
	}
}

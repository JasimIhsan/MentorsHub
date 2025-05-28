import { Request, Response } from "express";
import { IGetAllUsersUsecase } from "../../../../application/interfaces/admin/admin.usertab.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetAllUsersController {
	constructor(private getAllUsersUsecase: IGetAllUsersUsecase) {}

	async handle(req: Request, res: Response): Promise<void> {
		try {
			const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
			const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
			const search = typeof req.query.search === "string" ? req.query.search : undefined;
			const role = typeof req.query.role === "string" ? req.query.role : undefined;
			const status = typeof req.query.status === "string" ? req.query.status : undefined;

			if (isNaN(page) || page < 1) {
				res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Invalid page number" });
				return;
			}
			if (isNaN(limit) || limit < 1) {
				res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Invalid limit value" });
				return;
			}

			const result = await this.getAllUsersUsecase.execute({
				page,
				limit,
				search,
				role,
				status,
			});

			res.status(HttpStatusCode.OK).json({
				success: true,
				users: result.users,
				totalUsers: result.totalUsers,
				totalPages: result.totalPages,
				currentPage: result.currentPage,
			});
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
			} else {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "An unexpected error occurred" });
			}
		}
	}
}

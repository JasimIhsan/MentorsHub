import { Request, Response, NextFunction } from "express";
import { IGetUsersGrowthChartDataUseCase } from "../../../../application/interfaces/admin/admin.dashboard.interface";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetUsersGrowthChartDataController {
	constructor(private readonly _useCase: IGetUsersGrowthChartDataUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const adminId = req.params.adminId;
			const { range } = req.query;
			let months = 6;
			if (range === "30days") months = 1;
			else if (range === "1year") months = 12;
			else if (range === "all") months = 0;

			const chartData = await this._useCase.execute(adminId, months);
			res.status(HttpStatusCode.OK).json({ success: true, chartData });
		} catch (error) {
			next(error);
		}
	}
}

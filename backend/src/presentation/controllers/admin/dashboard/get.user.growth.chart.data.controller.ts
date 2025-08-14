import { Request, Response, NextFunction } from "express";
import { IGetUsersGrowthChartDataUseCase } from "../../../../application/interfaces/usecases/admin/admin.dashboard.interface";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetUsersGrowthChartDataController {
	constructor(private readonly _useCase: IGetUsersGrowthChartDataUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const adminId = req.params.adminId;
			const { range } = req.query;
			let months = 0;

			switch (range) {
				case "30days": {
					months = 1;
					break;
				}
				case "6months": {
					months = 6;
					break;
				}
				case "1year": {
					months = 12;
					break;
				}
				case "all": {
					months = 0;
					break;
				}
			}

			const chartData = await this._useCase.execute(adminId, months);
			res.status(HttpStatusCode.OK).json({ success: true, chartData });
		} catch (error) {
			next(error);
		}
	}
}

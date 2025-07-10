import { ReportEntity, ReportProps } from "../../../domain/entities/report.entity";
import { IReportRepository } from "../../../domain/repositories/report.repository";
import { ICreateReportUseCase, ReportInput } from "../../interfaces/reports";


export class CreateReportUseCase implements ICreateReportUseCase {
	constructor(private readonly _reportRepo: IReportRepository) {}

	async execute(report: ReportInput): Promise<void> {
		const reportEntity = ReportEntity.createNew(report);
		await this._reportRepo.create(reportEntity);
	}
}

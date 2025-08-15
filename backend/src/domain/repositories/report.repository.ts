import { ReportEntity } from "../entities/report.entity";

export interface IReportRepository {
	findAll(page: number, limit: number, searchTerm?: string, status?: string): Promise<{ tasks: ReportEntity[]; totalCount: number }>;
	findById(id: string): Promise<ReportEntity | null>;
	create(report: ReportEntity): Promise<ReportEntity>;
	deleteById(id: string): Promise<void>;
	update(report: ReportEntity): Promise<ReportEntity>;
	updateStatus(reportId: string, status: string): Promise<ReportEntity>;
	updateReportsByReportedId(reportedId: string, status: string): Promise<number>;
}

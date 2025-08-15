import { ReportProps } from "../../../domain/entities/report.entity";
import { IReportDTO } from "../../dtos/report.dto";

export type ReportInput = Omit<ReportProps, "id" | "status" | "createdAt" | "updatedAt">;

export interface ICreateReportUseCase {
	execute(input: ReportInput): Promise<void>;
}

export interface IGetReportsUseCase {
	execute(page: number, limit: number, search?: string, status?: string): Promise<{ reports: IReportDTO[]; totalCount: number }>;
}

export interface IUpdateReportStatusUseCase {
	execute(reportId: string, action: "dismiss" | "block", adminNote?: string): Promise<IReportDTO>;
}

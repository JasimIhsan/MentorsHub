import { ReportProps } from "../../domain/entities/report.entity";

export type ReportInput = Omit<ReportProps, "id" | "status" | "adminNote" | "createdAt" | "updatedAt">;


export interface ICreateReportUseCase {
	execute(input: ReportInput): Promise<void>;
}
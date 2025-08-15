import { reportRepository, userRepository } from "../../../infrastructure/composer";
import { CreateReportUseCase } from "./create.report.usecase";
import { GetReportsUseCase } from "./get.reports.usecase";
import { UpdateReportStatusUseCase } from "./update.report.usecase";

export const createReportUseCase = new CreateReportUseCase(reportRepository);
export const getReportsUseCase = new GetReportsUseCase(reportRepository, userRepository);
export const updateReportStatusUseCase = new UpdateReportStatusUseCase(reportRepository, userRepository);

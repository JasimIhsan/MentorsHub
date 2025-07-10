import { reportRepository, userRepository } from "../../../infrastructure/composer";
import { CreateReportUseCase } from "./create.report.usecase";
import { GetReportsUsecase } from "./get.reports.usecase";

export const createReportUseCase = new CreateReportUseCase(reportRepository);
export const getReportsUseCase = new GetReportsUsecase(reportRepository, userRepository);
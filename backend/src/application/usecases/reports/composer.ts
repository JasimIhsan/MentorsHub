import { reportRepository } from "../../../infrastructure/composer";
import { CreateReportUseCase } from "./create.report.usecase";

export const createReportUseCase = new CreateReportUseCase(reportRepository);

import { createReportUseCase } from "../../../application/usecases/reports/composer";
import { CreateReportController } from "./create.report.controller";

export const createReportController = new CreateReportController(createReportUseCase);

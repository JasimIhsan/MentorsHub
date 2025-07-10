import { createReportUseCase, updateReportStatusUseCase } from "../../../application/usecases/reports/composer";
import { CreateReportController } from "./create.report.controller";
import { UpdateReportStatusController } from "./update.report.status.controller";

export const createReportController = new CreateReportController(createReportUseCase);
export const updateReportStatusController = new UpdateReportStatusController(updateReportStatusUseCase);

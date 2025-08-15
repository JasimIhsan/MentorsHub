import { getReportsUseCase } from "../../../../application/usecases/reports/composer";
import { GetReportsController } from "./get.reports.controller";

export const getReportsController = new GetReportsController(getReportsUseCase);

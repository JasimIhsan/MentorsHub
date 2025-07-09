import { getAdminStatsUseCase, getPlatformRevenueChartDataUseCase } from "../../../../application/usecases/admin/dashboard/composer";
import { GetAdminStatsController } from "./get.admin.stats.controller";
import { GetPlatformRevenueChartDataController } from "./get.platform.revenue.chart.controller";

export const getAdminStatsController = new GetAdminStatsController(getAdminStatsUseCase);
export const getPlatformRevenueChartDataController = new GetPlatformRevenueChartDataController(getPlatformRevenueChartDataUseCase);

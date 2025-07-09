import { getAdminStatsUseCase, getPlatformRevenueChartDataUseCase, getUsersGrowthChartDataUseCase } from "../../../../application/usecases/admin/dashboard/composer";
import { GetAdminStatsController } from "./get.admin.stats.controller";
import { GetPlatformRevenueChartDataController } from "./get.platform.revenue.chart.controller";
import { GetUsersGrowthChartDataController } from "./get.user.growth.chart.data.controller";

export const getAdminStatsController = new GetAdminStatsController(getAdminStatsUseCase);
export const getPlatformRevenueChartDataController = new GetPlatformRevenueChartDataController(getPlatformRevenueChartDataUseCase);
export const getUsersGrowthChartDataController = new GetUsersGrowthChartDataController(getUsersGrowthChartDataUseCase);

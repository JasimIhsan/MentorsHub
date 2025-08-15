import { getAdminStatsUseCase, getPlatformRevenueChartDataUseCase, getTopMentorsUseCase, getUsersGrowthChartDataUseCase } from "../../../../application/usecases/admin/dashboard/composer";
import { GetAdminStatsController } from "./get.admin.stats.controller";
import { GetPlatformRevenueChartDataController } from "./get.platform.revenue.chart.controller";
import { GetTopMentorsChartDataController } from "./get.top.mentors.chart.data.controller";
import { GetUsersGrowthChartDataController } from "./get.user.growth.chart.data.controller";

export const getAdminStatsController = new GetAdminStatsController(getAdminStatsUseCase);
export const getPlatformRevenueChartDataController = new GetPlatformRevenueChartDataController(getPlatformRevenueChartDataUseCase);
export const getUsersGrowthChartDataController = new GetUsersGrowthChartDataController(getUsersGrowthChartDataUseCase);
export const getTopMentorsChartDataController = new GetTopMentorsChartDataController(getTopMentorsUseCase);

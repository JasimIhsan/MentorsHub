import { adminRepository, sessionRepository, userRepository, walletRepository } from "../../../../infrastructure/composer";
import { GetAdminStatsUseCase } from "./get.admin.stats.usecase";
import { GetPlatformRevenueChartDataUseCase } from "./platform.revenue.chart.data.usecase";
import { GetUsersGrowthChartDataUseCase } from "./users.growth.chart.data.usecase";

export const getAdminStatsUseCase = new GetAdminStatsUseCase(adminRepository, userRepository, sessionRepository, walletRepository);
export const getPlatformRevenueChartDataUseCase = new GetPlatformRevenueChartDataUseCase(walletRepository, adminRepository);
export const getUsersGrowthChartDataUseCase = new GetUsersGrowthChartDataUseCase(adminRepository, userRepository);

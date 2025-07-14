import { IAdminStatsDTO, IPlatformRevenueChartDataDTO, ITopFiveMentorsDTO, IUsersGrowthChartDataDTO } from "../../dtos/admin.dashboard.dtos";

export interface IGetAdminStatsUseCase {
	execute(adminId: string): Promise<IAdminStatsDTO>;
}

export interface IGetPlatformRevenueChartDataUseCase {
	execute(adminId: string, months?: number): Promise<IPlatformRevenueChartDataDTO[]>;
}

export interface IGetUsersGrowthChartDataUseCase {
	execute(adminId: string, months?: number): Promise<IUsersGrowthChartDataDTO[]>;
}

export interface IGetTopMentorsUseCase {
	execute(): Promise<ITopFiveMentorsDTO[]>;
}

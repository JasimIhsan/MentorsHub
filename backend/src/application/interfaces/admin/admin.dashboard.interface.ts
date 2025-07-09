export interface AdminStatsResponse {
	totalUsers: number;
	totalMentors: number;
	totalSessions: number;
	totalRevenue: number;
}

export interface IGetAdminStatsUseCase {
	execute(adminId: string): Promise<AdminStatsResponse>;
}

export interface IGetPlatformRevenueChartDataUseCase {
	execute(adminId: string): Promise<{ name: string; total: number }[]>;
}

export interface IGetUsersGrowthChartDataUseCase {
	execute(adminId: string, months?: number): Promise<{ users: number; mentors: number; name: string }[]>;
}

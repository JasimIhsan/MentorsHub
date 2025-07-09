export interface IAdminStatsDTO {
	totalUsers: number;
	totalMentors: number;
	totalSessions: number;
	totalRevenue: number;
}

export interface IUsersGrowthChartDataDTO {
	users: number;
	mentors: number;
	name: string;
}

export interface IPlatformRevenueChartDataDTO {
	name: string;
	total: number;
}

export interface ITopFiveMentorsDTO {
	id: string;
	name: string;
	avatar: string;
	rating: number;
	revenue: number;
	sessions: number;
}	

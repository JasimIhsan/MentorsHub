export interface MentorStats {
	upcomingSessions: number;
	pendingRequests: number;
	averageRating: number;
	revenue: number;
}

export interface IGetMentorStatsUseCase {
	execute(mentorId: string): Promise<MentorStats>;
}

export interface IGetMentorWeeklyPerformanceUseCase {
	execute(mentorId: string, period: "all" | "month" | "sixMonths" | "year"): Promise<{ name: string; sessions: number; revenue: number }[]>;
}

export interface IGetMentorWeeklyRatingsUseCase {
	execute(mentorId: string, period: "all" | "month" | "sixMonths" | "year"): Promise<{ name: string; averageRating: number }[]>;
}

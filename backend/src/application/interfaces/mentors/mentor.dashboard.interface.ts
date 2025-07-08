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
	execute(mentorId: string, period: "month" | "sixMonths" | "year"): Promise<{ week: string; sessions: number; revenue: number }[]>;
}

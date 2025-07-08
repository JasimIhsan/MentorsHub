export interface MentorStats {
	upcomingSessions: number;
	pendingRequests: number;
	averageRating: number;
	revenue: number;
}

export interface IGetMentorStatsUseCase {
	execute(mentorId: string): Promise<MentorStats>;
}

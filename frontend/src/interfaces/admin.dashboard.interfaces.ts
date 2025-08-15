export interface AdminDashboardMentor {
	id: string;
	name: string;
	avatar: string;
	rating: number;
	revenue: number;
	sessions: number;
}

export type DashboardFilters = "all" | "30days" | "6months" | "1year";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, DollarSign, Star, TrendingUp } from "lucide-react";

interface SessionOverviewStatsProps {
	stats: {
		upcomingSessions: number;
		pendingRequests: number;
		averageRating: number;
		revenue: number;
	};
	isLoading: boolean;
}

export function SessionOverviewStats({ stats, isLoading }: SessionOverviewStatsProps) {
	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, index) => (
					<Card key={index}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-24 bg-gray-200" />
							<Skeleton className="h-4 w-4 bg-gray-200" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-16 bg-gray-200 mb-2" />
							<Skeleton className="h-3 w-32 bg-gray-200" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
					<Calendar className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.upcomingSessions}</div>
					<p className="text-xs text-muted-foreground">{stats.upcomingSessions > 0 ? `+${stats.upcomingSessions} from last week` : "No new sessions"}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
					<Clock className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.pendingRequests}</div>
					<p className="text-xs text-muted-foreground">{stats.pendingRequests > 0 ? "Respond within 24 hours" : "No pending requests"}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Average Rating</CardTitle>
					<Star className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
					<p className="text-xs text-muted-foreground">{stats.averageRating > 0 ? "Based on recent reviews" : "No reviews yet"}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
					<DollarSign className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</div>
					<div className="flex items-center space-x-1 text-xs text-muted-foreground">
						<TrendingUp className="h-3 w-3 text-green-500" />
						<span className="text-green-500">+12%</span>
						<span>from last month</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

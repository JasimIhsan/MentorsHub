import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionOverviewStats } from "@/components/mentor/dashboard/SessionOverViewStats";
import { SessionRequestsPreview } from "@/components/mentor/dashboard/SessionRequestPreview";
import { UpcomingSessionsList } from "@/components/mentor/dashboard/UpcomingSessionList";
import { RecentReviewsPreview } from "@/components/mentor/dashboard/RecentReviewsPreview";
import { MentorPerformanceChart } from "@/components/mentor/dashboard/MentorPerfomanceChart";
import { useEffect, useState } from "react";
import { ISessionMentorDTO } from "@/interfaces/ISessionDTO";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { fetchMentorDashboardData } from "@/api/mentors.api.service";
import { IReviewDTO } from "@/interfaces/review.dto";
import { MentorReviewRatingChart } from "@/components/mentor/dashboard/AverageRatingChart";

export function MentorDashboardPage() {
	const [sessions, setSessions] = useState<ISessionMentorDTO[]>([]);
	const [requests, setRequests] = useState<ISessionMentorDTO[]>([]);
	const [reviews, setReviews] = useState<IReviewDTO[]>([]);
	const [stats, setStats] = useState<{
		upcomingSessions: number;
		pendingRequests: number;
		averageRating: number;
		revenue: number;
	}>({ upcomingSessions: 0, pendingRequests: 0, averageRating: 0, revenue: 0 });
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const user = useSelector((state: RootState) => state.userAuth.user);

	useEffect(() => {
		const fetchSessions = async () => {
			setIsLoading(true);
			try {
				const response = await fetchMentorDashboardData(user?.id!);
				if (!response) toast.error("Failed to fetch dashboard data");
				setSessions(response.upcoming);
				setRequests(response.requests);
				setReviews(response.reviews);
				setStats(response.stats);
			} catch (error) {
				if (error instanceof Error) toast(error.message);
			} finally {
				setIsLoading(false);
			}
		};
		fetchSessions();
	}, []);

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">Manage your sessions, availability, and premium plans</p>
				</div>
				{/* <div className="flex items-center gap-2">
					<Tabs defaultValue="today" className="w-[300px]">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="today">Today</TabsTrigger>
							<TabsTrigger value="week">This Week</TabsTrigger>
							<TabsTrigger value="month">This Month</TabsTrigger>
						</TabsList>
					</Tabs>
				</div> */}
			</div>

			<SessionOverviewStats isLoading={isLoading} stats={stats} />

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Upcoming Sessions</CardTitle>
						<CardDescription>Your scheduled sessions for the next 7 days</CardDescription>
					</CardHeader>
					<CardContent>
						<UpcomingSessionsList sessions={sessions} isLoading={isLoading} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Pending Requests</CardTitle>
						<CardDescription>Session requests awaiting your response</CardDescription>
					</CardHeader>
					<CardContent>
						<SessionRequestsPreview isLoading={isLoading} requests={requests} />
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Review Rating</CardTitle>
						<CardDescription>Average rating of your reviews</CardDescription>
					</CardHeader>
					<CardContent>
						<MentorReviewRatingChart userId={user?.id!} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Reviews</CardTitle>
						<CardDescription>Feedback from your recent sessions</CardDescription>
					</CardHeader>
					<CardContent>
						<RecentReviewsPreview isLoading={isLoading} reviews={reviews} />
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Plan Performance</CardTitle>
					<CardDescription>Popularity and revenue by premium plan</CardDescription>
				</CardHeader>
				<CardContent>
					<MentorPerformanceChart userId={user?.id!} />
				</CardContent>
			</Card>
		</div>
	);
}

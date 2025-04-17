import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionOverviewStats } from "@/components/mentor/dashboard/SessionOverViewStats";
import { SessionRequestsPreview } from "@/components/mentor/dashboard/SessionRequestPreview";
import { UpcomingSessionsList } from "@/components/mentor/dashboard/UpcomingSessionList";
import { RecentReviewsPreview } from "@/components/mentor/dashboard/RecentReviewsPreview";
import { SessionCalendarPreview } from "@/components/mentor/dashboard/SessionCalendarPreview";
import { PlanPerformanceChart } from "@/components/mentor/dashboard/PlanPerfomanceChart";

export function MentorDashboardPage() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">Manage your sessions, availability, and premium plans</p>
				</div>
				<div className="flex items-center gap-2">
					<Tabs defaultValue="today" className="w-[300px]">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="today">Today</TabsTrigger>
							<TabsTrigger value="week">This Week</TabsTrigger>
							<TabsTrigger value="month">This Month</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</div>

			<SessionOverviewStats />

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Upcoming Sessions</CardTitle>
						<CardDescription>Your scheduled sessions for the next 7 days</CardDescription>
					</CardHeader>
					<CardContent>
						<UpcomingSessionsList />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Pending Requests</CardTitle>
						<CardDescription>Session requests awaiting your response</CardDescription>
					</CardHeader>
					<CardContent>
						<SessionRequestsPreview />
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Calendar Preview</CardTitle>
						<CardDescription>Your upcoming schedule at a glance</CardDescription>
					</CardHeader>
					<CardContent>
						<SessionCalendarPreview />
					</CardContent>
				</Card> 

				<Card>
					<CardHeader>
						<CardTitle>Recent Reviews</CardTitle>
						<CardDescription>Feedback from your recent sessions</CardDescription>
					</CardHeader>
					<CardContent>
						<RecentReviewsPreview />
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Plan Performance</CardTitle>
					<CardDescription>Popularity and revenue by premium plan</CardDescription>
				</CardHeader>
				<CardContent>
					<PlanPerformanceChart />
				</CardContent>
			</Card>
		</div>
	);
}

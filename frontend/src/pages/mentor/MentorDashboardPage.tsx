import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionOverviewStats } from "@/components/mentor/dashboard/SessionOverViewStats";
import { SessionRequestsPreview } from "@/components/mentor/dashboard/SessionRequestPreview";
import { UpcomingSessionsList } from "@/components/mentor/dashboard/UpcomingSessionList";
import { RecentReviewsPreview } from "@/components/mentor/dashboard/RecentReviewsPreview";
import { useEffect, useState, useMemo } from "react";
import { ISessionMentorDTO } from "@/interfaces/ISessionDTO";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { fetchMentorDashboardData, fetchMentorWeeklyRatingChartData } from "@/api/mentors.api.service";
import { IReviewDTO } from "@/interfaces/review.dto";
import { MentorReviewRatingChart } from "@/components/mentor/dashboard/AverageRatingChart";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { MentorReportDocument } from "@/components/mentor/dashboard/MentorReportDocument";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface PerformanceData {
	week: string;
	sessions: number;
	revenue: number;
}

interface ChartData {
	name: string;
	averageRating: number;
}

type PeriodType = "all" | "month" | "sixMonths" | "year";

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
	// const [filterPerformancePeriod, setFilterPerformancePeriod] = useState<PeriodType>("all");
	// const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
	// const [isPerformanceLoading, setIsPerformanceLoading] = useState(true);
	// const [, setPerformanceError] = useState<string | null>(null);
	const user = useSelector((state: RootState) => state.userAuth.user);
	const [filterRatingPeriod, setFilterRatingPeriod] = useState<PeriodType>("all");
	const [ratings, setRatings] = useState<ChartData[]>([]);
	const [isRatingLoading, setIsRatingLoading] = useState(true);
	const [ratingError, setRatingError] = useState<string | null>(null);

	// Track if all data is loaded
	const isAllDataLoaded = useMemo(() => {
		return !isLoading && !isRatingLoading;
	}, [isLoading, isRatingLoading]);

	// Generate a unique key for PDF regeneration based on filters
	const pdfKey = useMemo(() => {
		return `${filterRatingPeriod}-${generatedDate}`;
	}, [filterRatingPeriod]);

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
	}, [user?.id]);

	// Fetch performance data when component mounts or filterPerformancePeriod changes
	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		setIsPerformanceLoading(true);
	// 		setPerformanceError(null);
	// 		try {
	// 			const response = await fetchMetorPerfomanceChartData(user?.id!, filterPerformancePeriod);
	// 			if (response.success) setPerformanceData(response.performance);
	// 		} catch (err) {
	// 			setPerformanceError("Failed to load performance data.");
	// 			console.error(err);
	// 		} finally {
	// 			setIsPerformanceLoading(false);
	// 		}
	// 	};

	// 	fetchData();
	// }, [user?.id, filterPerformancePeriod]);

	// Handle performance filter change
	// const handlePerformanceFilterChange = (value: PeriodType) => {
	// 	setFilterPerformancePeriod(value);
	// };

	// Fetch rating data when component mounts or filterRatingPeriod changes
	useEffect(() => {
		const fetchData = async () => {
			setIsRatingLoading(true);
			setRatingError(null);
			try {
				const response = await fetchMentorWeeklyRatingChartData(user?.id!, filterRatingPeriod);
				if (response.success) {
					const transformedData = response.weeklyRatings.map((item: { name: string; averageRating: string }) => ({
						name: item.name,
						averageRating: parseFloat(item.averageRating),
					}));
					setRatings(transformedData);
				}
			} catch (err) {
				setRatingError("Failed to load rating data.");
				console.error(err);
			} finally {
				setIsRatingLoading(false);
			}
		};

		fetchData();
	}, [user?.id, filterRatingPeriod]);

	// Handle rating filter change
	const handleRatingsFilterChange = (value: PeriodType) => {
		setFilterRatingPeriod(value);
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">Manage your sessions, availability, and premium plans</p>
				</div>
				{isAllDataLoaded && (
					<PDFDownloadLink
						key={pdfKey}
						document={
							<MentorReportDocument
								stats={stats}
								sessions={sessions}
								requests={requests}
								reviews={reviews}
								// filterPerformancePeriod={filterPerformancePeriod}
								// performanceData={performanceData}
								ratingsData={ratings}
								filterRatingsPeriod={filterRatingPeriod}
								generatedDate={generatedDate}
								mentorEmail={user?.email!}
								mentorName={`${user?.firstName} ${user?.lastName}`}
							/>
						}
						fileName="mentor-report.pdf"
						className="flex justify-center items-center h-10 btn px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition">
						{({ loading }) => (loading ? "Generating PDF..." : "Download Report")}
					</PDFDownloadLink>
				)}
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
					<CardHeader className="flex justify-between">
						<div>
							<CardTitle>Review Rating</CardTitle>
							<CardDescription>Average rating of your reviews</CardDescription>
						</div>
						<div>
							<Select value={filterRatingPeriod} onValueChange={handleRatingsFilterChange}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Select period" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Time</SelectItem>
									<SelectItem value="month">Last Month</SelectItem>
									<SelectItem value="sixMonths">Last 6 Months</SelectItem>
									<SelectItem value="year">Last Year</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardHeader>
					<CardContent>
						<MentorReviewRatingChart data={ratings} isLoading={isRatingLoading} error={ratingError} />
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

			{/* <Card>
				<CardHeader className="flex justify-between">
					<div>
						<CardTitle>Session Performance</CardTitle>
						<CardDescription>Performance metrics for your sessions</CardDescription>
					</div>
					<div className="mb-4">
						<Select value={filterPerformancePeriod} onValueChange={handlePerformanceFilterChange}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select period" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Time</SelectItem>
								<SelectItem value="month">Last Month</SelectItem>
								<SelectItem value="sixMonths">Last 6 Months</SelectItem>
								<SelectItem value="year">Last Year</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent>
					<MentorPerformanceChart data={performanceData} isLoading={isPerformanceLoading} error={performanceError} />
				</CardContent>
			</Card> */}
		</div>
	);
}

const generatedDate = new Date().toLocaleDateString("en-IN", {
	day: "numeric",
	month: "long",
	year: "numeric",
});

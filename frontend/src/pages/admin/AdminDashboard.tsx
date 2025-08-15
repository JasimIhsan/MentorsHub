import { Users, UserCog, Calendar, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { fetchAdminDashboardData, fetchPlatformRevenueChartData, fetchTopMentorsData, fetchUsersGrowthChartData } from "@/api/admin/dashboard.api.service";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { AdminDashboardPDF } from "@/components/admin/dashboard/ReportPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { SelectContent, Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminDashboardMentor, DashboardFilters } from "@/interfaces/admin.dashboard.interfaces";
import { RevenueChart } from "@/components/admin/dashboard/charts/RevenueChart";
import { UserGrowthChart } from "@/components/admin/dashboard/charts/UserGrowthChart";
import { PlatformMetrics } from "@/components/admin/dashboard/PlatformMetrics";
import { PlatformMetricsSkeleton } from "@/components/admin/dashboard/PlatformMetricsSkeleton";
import { QuickLinkCard } from "@/components/admin/dashboard/QuickLinkCard";
import { QuickLinkCardSkeleton } from "@/components/admin/dashboard/QuickLinkCardSkeleton";
import { StatsCard } from "@/components/admin/dashboard/StatusCards";
import { StatsCardSkeleton } from "@/components/admin/dashboard/StatusCardSkeleton";
import { TopMentorsTable } from "@/components/admin/dashboard/TopMentorsTable";
import { TopMentorsTableSkeleton } from "@/components/admin/dashboard/TopMentorsTableSkeleton";

// Main AdminDashboardPage component
export default function AdminDashboardPage() {
	const [stats, setStats] = useState<{
		totalUsers: number;
		totalMentors: number;
		totalSessions: number;
		totalRevenue: number;
	}>({ totalMentors: 0, totalSessions: 0, totalUsers: 0, totalRevenue: 0 });
	const [isStatsLoading, setIsStatsLoading] = useState(false);
	const user = useSelector((state: RootState) => state.adminAuth.admin);

	const [revenue, setRevenue] = useState<{ name: string; total: number }[]>([]);
	const [isRevenueLoading, setIsRevenueLoading] = useState(false);
	const [revenueFilter, setRevenueFilter] = useState<DashboardFilters>("all");

	const [userGrowth, setUserGrowth] = useState<{ name: string; users: number; mentors: number }[]>([]);
	const [isUserGrowthLoading, setIsUserGrowthLoading] = useState(false);
	const [userGrowthFilter, setUserGrowthFilter] = useState<DashboardFilters>("all");

	const [topMentors, setTopMentors] = useState<AdminDashboardMentor[]>([]);
	const [isTopMentorsLoading, setIsTopMentorsLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setIsStatsLoading(true);
			try {
				const response = await fetchAdminDashboardData(user?.id!);
				if (response.success) {
					setStats(response.stats);
				}
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			} finally {
				setIsStatsLoading(false);
			}
		};
		fetchData();
	}, [user?.id]);

	useEffect(() => {
		const fetchRevenue = async () => {
			setIsRevenueLoading(true);
			try {
				const response = await fetchPlatformRevenueChartData(user?.id!, revenueFilter);
				if (response.success) {
					setRevenue(response.chartData);
				}
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			} finally {
				setIsRevenueLoading(false);
			}
		};
		fetchRevenue();
	}, [user?.id, revenueFilter]);

	useEffect(() => {
		const fetchUserGrowth = async () => {
			setIsUserGrowthLoading(true);
			try {
				const response = await fetchUsersGrowthChartData(user?.id!, userGrowthFilter);
				if (response.success) {
					setUserGrowth(response.chartData);
				}
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			} finally {
				setIsUserGrowthLoading(false);
			}
		};
		fetchUserGrowth();
	}, [user?.id, userGrowthFilter]);

	useEffect(() => {
		const fetchTopMentors = async () => {
			setIsTopMentorsLoading(true);
			try {
				const response = await fetchTopMentorsData();
				if (response.success) {
					setTopMentors(response.topMentors);
				}
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			} finally {
				setIsTopMentorsLoading(false);
			}
		};
		fetchTopMentors();
	}, [user?.id]);

	const filters = [
		{ label: "All Time", value: "all" },
		{ label: "Last 30 Days", value: "30days" },
		{ label: "Last 6 Months", value: "6months" },
		{ label: "Last 1 Year", value: "1year" },
	];

	return (
		<div className="space-y-6">
			<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">Overview of your platform's performance and activity</p>
				</div>
				<div className="flex items-center gap-2">
					{isRevenueLoading || isUserGrowthLoading || isStatsLoading || isTopMentorsLoading ? (
						<Skeleton className="h-10 w-32 bg-gray-200" />
					) : (
						<PDFDownloadLink
							document={
								<AdminDashboardPDF
									name={user?.username!}
									stats={stats}
									revenue={revenue}
									revenueFilter={revenueFilter}
									userGrowth={userGrowth}
									userGrowthFilter={userGrowthFilter}
									topMentors={topMentors}
									isLoading={isRevenueLoading || isUserGrowthLoading || isStatsLoading || isTopMentorsLoading}
								/>
							}
							fileName="Platform_Analytics_Report.pdf"
							className="flex justify-center items-center h-10 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition">
							{({ loading }) => (loading ? "Generating PDF..." : "Download Report")}
						</PDFDownloadLink>
					)}
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{isStatsLoading ? (
					<>
						<StatsCardSkeleton />
						<StatsCardSkeleton />
						<StatsCardSkeleton />
						<StatsCardSkeleton />
					</>
				) : (
					<>
						<StatsCard title="Total Users" value={stats.totalUsers} description="128 new this month" trend="up" percentage="12%" icon={Users} />
						<StatsCard title="Total Mentors" value={stats.totalMentors} description="24 new this month" trend="down" percentage="8%" icon={UserCog} />
						<StatsCard title="Sessions Conducted" value={stats.totalSessions} description="9 scheduled today" trend="up" percentage="23%" icon={Calendar} />
						<StatsCard title="Total Revenue" value={stats.totalRevenue} description="$5,231 this month" trend="up" percentage="4%" icon={CreditCard} />
					</>
				)}
			</div>

			{/* Charts */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>Revenue Overview</CardTitle>
							<CardDescription>Monthly revenue breakdown</CardDescription>
						</div>
						<Select defaultValue="all" onValueChange={(value) => setRevenueFilter(value as DashboardFilters)}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select timeframe" />
							</SelectTrigger>
							<SelectContent>
								{filters.map((filter, index) => (
									<SelectItem key={index} value={filter.value} className="capitalize">
										{filter.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</CardHeader>
					<CardContent>
						<RevenueChart data={revenue} isLoading={isRevenueLoading} />
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>User Growth</CardTitle>
							<CardDescription>New users over time</CardDescription>
						</div>
						<Select defaultValue="all" onValueChange={(value) => setUserGrowthFilter(value as DashboardFilters)}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select timeframe" />
							</SelectTrigger>
							<SelectContent>
								{filters.map((filter, index) => (
									<SelectItem key={index} value={filter.value} className="capitalize">
										{filter.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</CardHeader>
					<CardContent>
						<UserGrowthChart isLoading={isUserGrowthLoading} userGrowthData={userGrowth} />
					</CardContent>
				</Card>
			</div>

			{/* Top Mentors and Platform Metrics */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				{isStatsLoading ? <PlatformMetricsSkeleton /> : <PlatformMetrics />}
				{isTopMentorsLoading ? <TopMentorsTableSkeleton /> : <TopMentorsTable topMentors={topMentors} />}
			</div>

			{/* Quick Links */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{isStatsLoading ? (
					<>
						<QuickLinkCardSkeleton />
						<QuickLinkCardSkeleton />
						<QuickLinkCardSkeleton />
						<QuickLinkCardSkeleton />
					</>
				) : (
					<>
						<QuickLinkCard title="Manage Users" description="View and manage all platform users" href="/admin/users" icon={Users} />
						<QuickLinkCard title="Manage Mentors" description="Review and verify mentor applications" href="/admin/mentors" icon={UserCog} />
						<QuickLinkCard title="View Sessions" description="Monitor all scheduled and completed sessions" href="/admin/sessions" icon={Calendar} />
						<QuickLinkCard title="View Payments" description="Track all platform transactions" href="/admin/payments" icon={CreditCard} />
					</>
				)}
			</div>
		</div>
	);
}

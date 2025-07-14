import type React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Users, UserCog, Calendar, CreditCard, ArrowUp, ArrowDown, Star, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { fetchAdminDashboardData, fetchPlatformRevenueChartData, fetchTopMentorsData, fetchUsersGrowthChartData } from "@/api/admin/dashboard.api.service";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminDashboardPDF } from "@/components/admin/dashboard/ReportPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { SelectContent, Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// StatsCard component
function StatsCard({ title, value, description, trend, percentage, icon: Icon }: { title: string; value: number; description: string; trend: "up" | "down"; percentage: string; icon: React.ElementType }) {
	return (
		<Card>
			<CardContent className="px-6 py-0">
				<div className="flex items-center justify-between">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<Icon className="h-6 w-6 text-primary" />
					</div>
					<div className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
						{trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
						<span>{percentage}</span>
					</div>
				</div>
				<div className="mt-4">
					<h3 className="text-2xl font-bold">{value}</h3>
					<p className="text-sm text-muted-foreground">{title}</p>
				</div>
				<p className="mt-2 text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}

// StatsCardSkeleton component
function StatsCardSkeleton() {
	return (
		<Card>
			<CardContent className="px-6 py-0 pt-6">
				<div className="flex items-center justify-between">
					<Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
					<Skeleton className="h-4 w-16 bg-gray-200" />
				</div>
				<div className="mt-4">
					<Skeleton className="h-8 w-24 bg-gray-200" />
					<Skeleton className="mt-2 h-4 w-32 bg-gray-200" />
				</div>
				<Skeleton className="mt-2 h-3 w-48 bg-gray-200" />
			</CardContent>
		</Card>
	);
}

// QuickLinkCard component
function QuickLinkCard({ title, description, href, icon: Icon }: { title: string; description: string; href: string; icon: React.ElementType }) {
	return (
		<Card className="overflow-hidden py-0">
			<Link to={href} className="block h-full">
				<CardContent className="px-6 pt-6">
					<div className="flex items-center justify-between">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
							<Icon className="h-6 w-6 text-primary" />
						</div>
						<ArrowUpRight className="h-5 w-5 text-muted-foreground" />
					</div>
					<div className="mt-4">
						<h3 className="font-semibold">{title}</h3>
						<p className="mt-1 text-sm text-muted-foreground">{description}</p>
					</div>
				</CardContent>
			</Link>
		</Card>
	);
}

// QuickLinkCardSkeleton component
function QuickLinkCardSkeleton() {
	return (
		<Card className="overflow-hidden">
			<CardContent className="px-6 pt-6">
				<div className="flex items-center justify-between">
					<Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
					<Skeleton className="h-5 w-5 bg-gray-200" />
				</div>
				<div className="mt-4">
					<Skeleton className="h-5 w-32 bg-gray-200" />
					<Skeleton className="mt-2 h-4 w-48 bg-gray-200" />
				</div>
			</CardContent>
		</Card>
	);
}

// TopMentorsTable component
interface Mentor {
	id: string;
	name: string;
	avatar: string;
	rating: number;
	revenue: number;
	sessions: number;
}

function TopMentorsTable({ topMentors }: { topMentors: Mentor[] }) {
	return (
		<Card className="lg:col-span-4">
			<CardHeader>
				<CardTitle>Top Mentors</CardTitle>
				<CardDescription>Performance metrics for top-performing mentors</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Mentor</TableHead>
							<TableHead>Sessions</TableHead>
							<TableHead>Rating</TableHead>
							<TableHead>Revenue</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{topMentors.map((mentor) => (
							<TableRow key={mentor.id}>
								<TableCell className="font-medium flex items-center gap-2">
									<Avatar>
										<AvatarImage src={mentor.avatar} />
										<AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
									</Avatar>
									{mentor.name}
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										<Clock className="h-4 w-4 text-muted-foreground" />
										{mentor.sessions}
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										<Star className="h-4 w-4 text-yellow-400" />
										{mentor.rating}
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										<DollarSign className="h-4 w-4 text-green-600" />
										{mentor.revenue}
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

// TopMentorsTableSkeleton component
function TopMentorsTableSkeleton() {
	return (
		<Card className="lg:col-span-4">
			<CardHeader>
				<Skeleton className="h-6 w-32 bg-gray-200" />
				<Skeleton className="mt-2 h-4 w-48 bg-gray-200" />
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								<Skeleton className="h-4 w-20 bg-gray-200" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-20 bg-gray-200" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-20 bg-gray-200" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-20 bg-gray-200" />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...Array(5)].map((_, index) => (
							<TableRow key={index}>
								<TableCell>
									<Skeleton className="h-4 w-32 bg-gray-200" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-16 bg-gray-200" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-16 bg-gray-200" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-16 bg-gray-200" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

// PlatformMetrics component
interface Metric {
	id: number;
	title: string;
	value: string;
	icon: React.ElementType;
}

const metrics: Metric[] = [
	{ id: 1, title: "Avg. Session Duration", value: "45 min", icon: Clock },
	{ id: 2, title: "User Retention Rate", value: "78%", icon: Users },
	{ id: 3, title: "Avg. Mentor Rating", value: "4.8", icon: Star },
	{ id: 4, title: "Monthly Active Users", value: "1,892", icon: Calendar },
];

function PlatformMetrics() {
	return (
		<Card className="lg:col-span-3">
			<CardHeader>
				<CardTitle>Platform Metrics</CardTitle>
				<CardDescription>Key performance indicators</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4 sm:grid-cols-2">
					{metrics.map((metric) => (
						<div key={metric.id} className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<metric.icon className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">{metric.title}</p>
								<p className="text-lg font-semibold">{metric.value}</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

// PlatformMetricsSkeleton component
function PlatformMetricsSkeleton() {
	return (
		<Card className="lg:col-span-3">
			<CardHeader>
				<Skeleton className="h-6 w-32 bg-gray-200" />
				<Skeleton className="mt-2 h-4 w-48 bg-gray-200" />
			</CardHeader>
			<CardContent>
				<div className="grid gap-4 sm:grid-cols-2">
					{[...Array(4)].map((_, index) => (
						<div key={index} className="flex items-center gap-3">
							<Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
							<div>
								<Skeleton className="h-4 w-24 bg-gray-200" />
								<Skeleton className="mt-2 h-5 w-16 bg-gray-200" />
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

// RevenueChart component
function RevenueChart({ data, isLoading }: { data: { name: string; total: number }[]; isLoading: boolean }) {
	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-6 w-32 bg-gray-200" />
				<Skeleton className="h-64 w-full bg-gray-200" />
			</div>
		);
	}
	return (
		<ResponsiveContainer width="100%" height={300}>
			<LineChart data={data}>
				<XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
				<YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
				<Tooltip formatter={(value: number) => [`₹${value}`, "Revenue"]} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
				<Line type="monotone" dataKey="total" stroke="currentColor" strokeWidth={2} className="text-primary" dot={false} activeDot={{ r: 6 }} />
			</LineChart>
		</ResponsiveContainer>
	);
}

// UserGrowthChart component
function UserGrowthChart({ userGrowthData, isLoading }: { userGrowthData: { name: string; users: number; mentors: number }[]; isLoading: boolean }) {
	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-6 w-32 bg-gray-200" />
				<Skeleton className="h-64 w-full bg-gray-200" />
			</div>
		);
	}
	return (
		<ResponsiveContainer width="100%" height={300}>
			<LineChart data={userGrowthData}>
				<XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
				<YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
				<Tooltip />
				<Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2} activeDot={{ r: 6 }} />
				<Line type="monotone" dataKey="mentors" stroke="#16a34a" strokeWidth={2} activeDot={{ r: 6 }} />
			</LineChart>
		</ResponsiveContainer>
	);
}

type DashboardFilters = "all" | "30days" | "6months" | "1year";

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

	const [topMentors, setTopMentors] = useState<Mentor[]>([]);
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

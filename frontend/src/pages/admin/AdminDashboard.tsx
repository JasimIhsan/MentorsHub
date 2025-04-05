import type React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Users, UserCog, Calendar, CreditCard, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevenueChart } from "@/components/admin/dashboard/charts/RevenueChart";
import { UserGrowthChart } from "@/components/admin/dashboard/charts/UserGrowthChart";
import { SessionsChart } from "@/components/admin/dashboard/charts/SessionChart";
import { RecentActivityList } from "@/components/admin/dashboard/RecentActivityList";

export default function AdminDashboardPage() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">Overview of your platform's performance and activity</p>
				</div>
				<div className="flex items-center gap-2">
					<Button>Export Reports</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatsCard title="Total Users" value="2,543" description="128 new this month" trend="up" percentage="12%" icon={Users} />
				<StatsCard title="Total Mentors" value="342" description="24 new this month" trend="up" percentage="8%" icon={UserCog} />
				<StatsCard title="Active Sessions" value="1,257" description="89 scheduled today" trend="up" percentage="23%" icon={Calendar} />
				<StatsCard title="Total Revenue" value="$48,395" description="$5,231 this month" trend="down" percentage="4%" icon={CreditCard} />
			</div>

			{/* Charts */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="lg:col-span-4">
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>Revenue Overview</CardTitle>
							<CardDescription>Monthly revenue breakdown</CardDescription>
						</div>
						<Tabs defaultValue="6months">
							<TabsList>
								<TabsTrigger value="30days">30 days</TabsTrigger>
								<TabsTrigger value="6months">6 months</TabsTrigger>
								<TabsTrigger value="1year">1 year</TabsTrigger>
							</TabsList>
						</Tabs>
					</CardHeader>
					<CardContent>
						<RevenueChart />
					</CardContent>
				</Card>
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle>User Growth</CardTitle>
						<CardDescription>New users over time</CardDescription>
					</CardHeader>
					<CardContent>
						<UserGrowthChart />
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle>Sessions Overview</CardTitle>
						<CardDescription>Sessions by category</CardDescription>
					</CardHeader>
					<CardContent>
						<SessionsChart />
					</CardContent>
				</Card>
				<Card className="lg:col-span-4">
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
						<CardDescription>Latest platform activities</CardDescription>
					</CardHeader>
					<CardContent>
						<RecentActivityList />
					</CardContent>
				</Card>
			</div>

			{/* Quick Links */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<QuickLinkCard title="Manage Users" description="View and manage all platform users" href="/admin/users" icon={Users} />
				<QuickLinkCard title="Manage Mentors" description="Review and verify mentor applications" href="/admin/mentors" icon={UserCog} />
				<QuickLinkCard title="View Sessions" description="Monitor all scheduled and completed sessions" href="/admin/sessions" icon={Calendar} />
				<QuickLinkCard title="View Payments" description="Track all platform transactions" href="/admin/payments" icon={CreditCard} />
			</div>
		</div>
	);
}

function StatsCard({ title, value, description, trend, percentage, icon: Icon }: { title: string; value: string; description: string; trend: "up" | "down"; percentage: string; icon: React.ElementType }) {
	return (
		<Card>
			<CardContent className="px-6">
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

function QuickLinkCard({ title, description, href, icon: Icon }: { title: string; description: string; href: string; icon: React.ElementType }) {
	return (
		<Card className="overflow-hidden">
			<Link to={href} className="block h-full">
				<CardContent className="px-6">
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

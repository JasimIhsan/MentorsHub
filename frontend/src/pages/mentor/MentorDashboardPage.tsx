import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CalendarDays, Clock, Users, DollarSign, Star, BookOpen, ArrowUpRight, BarChart3, Calendar, MessageSquare, ArrowLeftRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import React from "react";

// Sidebar Component
function Sidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
	const navigate = useNavigate();

	const navItems = [
		{ value: "upcoming", label: "Upcoming Sessions", icon: Calendar },
		{ value: "requests", label: "Session Requests", icon: MessageSquare },
		{ value: "plans", label: "Premium Plans", icon: BookOpen },
		{ value: "analytics", label: "Analytics", icon: BarChart3 },
	];

	return (
		<div className="w-64 bg-background border-r h-full">
			<div className="p-4">
				<h2 className="text-lg font-semibold tracking-tight">Mentor Dashboard</h2>
				<p className="text-sm text-muted-foreground">Manage your mentoring</p>
			</div>
			<Separator />
			<ScrollArea className="h-[calc(100vh-8rem)]">
				<div className="p-4">
					{navItems.map((item) => (
						<Button key={item.value} variant={activeTab === item.value ? "secondary" : "ghost"} className="w-full justify-start mb-1" onClick={() => setActiveTab(item.value)}>
							<item.icon className="mr-2 h-4 w-4" />
							{item.label}
						</Button>
					))}
					<Separator className="my-4" />
					<Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/dashboard")}>
						<ArrowLeftRight className="mr-2 h-4 w-4" />
						Switch to User Dashboard
					</Button>
				</div>
			</ScrollArea>
		</div>
	);
}

export default function MentorDashboardPage() {
	const [activeTab, setActiveTab] = React.useState("upcoming");

	return (
		<div className="flex min-h-screen">
			{/* Sidebar */}
			<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

			{/* Main Content */}
			<div className="flex-1 container py-8 px-6 md:px-8 xl:px-10">
				<div className="p-4">
					<h2 className="text-lg font-semibold tracking-tight">Mentor Dashboard</h2>
					<p className="text-sm text-muted-foreground">Manage your mentoring</p>
				</div>
				<div className="flex flex-col gap-8">
					{/* Stats Overview */}
					<section className="grid gap-4 md:grid-cols-4">
						<Card>
							<CardContent className="px-6 pt-6">
								<div className="flex flex-col gap-2">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium text-muted-foreground">Total Earnings</span>
										<DollarSign className="h-4 w-4 text-muted-foreground" />
									</div>
									<div className="flex items-end justify-between">
										<div className="text-2xl font-bold">$1,240</div>
										<div className="flex items-center text-sm text-green-500">
											<ArrowUpRight className="mr-1 h-4 w-4" />
											12%
										</div>
									</div>
									<p className="text-xs text-muted-foreground">+$320 from last month</p>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="px-6 pt-6">
								<div className="flex flex-col gap-2">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium text-muted-foreground">Sessions Completed</span>
										<Calendar className="h-4 w-4 text-muted-foreground" />
									</div>
									<div className="flex items-end justify-between">
										<div className="text-2xl font-bold">24</div>
										<div className="flex items-center text-sm text-green-500">
											<ArrowUpRight className="mr-1 h-4 w-4" />
											8%
										</div>
									</div>
									<p className="text-xs text-muted-foreground">+3 from last month</p>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="px-6 pt-6">
								<div className="flex flex-col gap-2">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium text-muted-foreground">Active Mentees</span>
										<Users className="h-4 w-4 text-muted-foreground" />
									</div>
									<div className="flex items-end justify-between">
										<div className="text-2xl font-bold">18</div>
										<div className="flex items-center text-sm text-green-500">
											<ArrowUpRight className="mr-1 h-4 w-4" />
											5%
										</div>
									</div>
									<p className="text-xs text-muted-foreground">+2 new this month</p>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="px-6 pt-6">
								<div className="flex flex-col gap-2">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium text-muted-foreground">Average Rating</span>
										<Star className="h-4 w-4 text-muted-foreground" />
									</div>
									<div className="flex items-end justify-between">
										<div className="text-2xl font-bold">4.8</div>
										<div className="flex items-center text-sm text-green-500">
											<ArrowUpRight className="mr-1 h-4 w-4" />
											0.2
										</div>
									</div>
									<p className="text-xs text-muted-foreground">Based on 42 reviews</p>
								</div>
							</CardContent>
						</Card>
					</section>

					{/* Main Content */}
					<section>
						<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
							<TabsContent value="upcoming" className="mt-6">
								<Card>
									<CardHeader className="pb-3">
										<CardTitle>Upcoming Sessions</CardTitle>
										<CardDescription>Your scheduled mentoring sessions</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{upcomingSessions.map((session) => (
												<div key={session.id} className="flex items-center gap-4 rounded-lg border p-4">
													<Avatar className="h-12 w-12">
														<AvatarImage src={session.menteeAvatar} alt={session.menteeName} />
														<AvatarFallback>{session.menteeName.charAt(0)}</AvatarFallback>
													</Avatar>
													<div className="flex-1">
														<div className="flex items-center justify-between">
															<h3 className="font-semibold">{session.title}</h3>
														</div>
														<p className="text-sm text-muted-foreground">with {session.menteeName}</p>
														<div className="mt-2 flex flex-wrap items-center gap-2">
															<div className="flex items-center gap-1">
																<CalendarDays className="h-4 w-4 text-muted-foreground" />
																<span className="text-sm">{session.date}</span>
															</div>
															<div className="flex items-center gap-1">
																<Clock className="h-4 w-4 text-muted-foreground" />
																<span className="text-sm">{session.time}</span>
															</div>
															<div className="flex items-center gap-1">
																<MessageSquare className="h-4 w-4 text-muted-foreground" />
																<span className="text-sm">{session.type}</span>
															</div>
														</div>
													</div>
													<div className="flex gap-4 items-center">
														<span>{session.isPaid ? <Badge>Paid</Badge> : <Badge variant="outline">Free</Badge>}</span>
														<Button variant="outline" size="sm" asChild>
															<Link to={`/messages?mentee=${session.menteeId}`}>Message</Link>
														</Button>
														<Button size="sm">Join Session</Button>
													</div>
												</div>
											))}
											{upcomingSessions.length === 0 && (
												<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
													<CalendarDays className="mb-2 h-8 w-8 text-muted-foreground" />
													<p className="text-center text-muted-foreground">No upcoming sessions</p>
													<Button className="mt-4" variant="outline" asChild>
														<Link to="/mentor/availability">Update Availability</Link>
													</Button>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="requests" className="mt-6">
								<Card>
									<CardHeader className="pb-3">
										<CardTitle>Session Requests</CardTitle>
										<CardDescription>Pending requests from mentees</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{sessionRequests.map((request) => (
												<div key={request.id} className="flex items-center gap-4 rounded-lg border p-4">
													<Avatar className="h-12 w-12">
														<AvatarImage src={request.menteeAvatar} alt={request.menteeName} />
														<AvatarFallback>{request.menteeName.charAt(0)}</AvatarFallback>
													</Avatar>
													<div className="flex-1">
														<div className="flex items-center justify-between">
															<h3 className="font-semibold">{request.topic}</h3>
														</div>
														<p className="text-sm text-muted-foreground">from {request.menteeName}</p>
														<div className="mt-2 flex flex-wrap items-center gap-2">
															<div className="flex items-center gap-1">
																<CalendarDays className="h-4 w-4 text-muted-foreground" />
																<span className="text-sm">{request.preferredDate}</span>
															</div>
															<div className="flex items-center gap-1">
																<Clock className="h-4 w-4 text-muted-foreground" />
																<span className="text-sm">{request.preferredTime}</span>
															</div>
															<div className="flex items-center gap-1">
																<MessageSquare className="h-4 w-4 text-muted-foreground" />
																<span className="text-sm">{request.type}</span>
															</div>
														</div>
														<p className="mt-2 text-sm">{request.message}</p>
													</div>
													<div className="flex gap-2">
														<span>
															<Badge className="text-xs text-green-500 bg-background">New Request</Badge>
														</span>
														<Button variant="outline" size="sm">
															Decline
														</Button>
														<Button size="sm">Accept</Button>
													</div>
												</div>
											))}
											{sessionRequests.length === 0 && (
												<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
													<MessageSquare className="mb-2 h-8 w-8 text-muted-foreground" />
													<p className="text-center text-muted-foreground">No pending session requests</p>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="plans" className="mt-6">
								<Card>
									<CardHeader className="pb-3">
										<div className="flex items-center justify-between">
											<div>
												<CardTitle>Premium Plans</CardTitle>
												<CardDescription>Manage your premium mentorship plans</CardDescription>
											</div>
											<Button asChild>
												<Link to="/mentor/plans/create">Create New Plan</Link>
											</Button>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{premiumPlans.map((plan) => (
												<div key={plan.id} className="rounded-lg border p-4">
													<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
														<div>
															<div className="flex items-center gap-2">
																<h3 className="font-semibold">{plan.name}</h3>
																{plan.isActive ? <Badge variant="default">Active</Badge> : <Badge variant="outline">Draft</Badge>}
															</div>
															<p className="text-sm text-muted-foreground">
																{plan.duration} • ${plan.price}
															</p>
															<div className="mt-2 flex flex-wrap gap-2">
																{plan.features.map((feature, index) => (
																	<Badge key={index} variant="secondary">
																		{feature}
																	</Badge>
																))}
															</div>
														</div>
														<div className="flex flex-col gap-2">
															<div className="text-sm text-muted-foreground">
																<span className="font-medium">{plan.subscribers}</span> active subscribers
															</div>
															<div className="flex gap-2">
																<Button variant="outline" size="sm" asChild>
																	<Link to={`/mentor/plans/${plan.id}`}>Edit</Link>
																</Button>
																{plan.isActive ? (
																	<Button variant="outline" size="sm">
																		Deactivate
																	</Button>
																) : (
																	<Button size="sm">Activate</Button>
																)}
															</div>
														</div>
													</div>
												</div>
											))}
											{premiumPlans.length === 0 && (
												<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
													<BookOpen className="mb-2 h-8 w-8 text-muted-foreground" />
													<p className="text-center text-muted-foreground">No premium plans created yet</p>
													<Button className="mt-4" asChild>
														<Link to="/mentor/plans/create">Create Your First Plan</Link>
													</Button>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="analytics" className="mt-6">
								<Card>
									<CardHeader>
										<CardTitle>Performance Analytics</CardTitle>
										<CardDescription>Track your mentoring performance and earnings</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-8">
											<div>
												<h3 className="text-lg font-medium mb-4">Monthly Earnings</h3>
												<div className="h-[200px] w-full rounded-lg bg-muted/50 flex items-end justify-between p-4">
													{[40, 65, 45, 80, 75, 90].map((height, i) => (
														<div key={i} className="relative w-12">
															<div className="bg-primary rounded-t-md w-full transition-all duration-500" style={{ height: `${height}%` }}></div>
															<span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">{["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}</span>
														</div>
													))}
												</div>
											</div>
											<div className="grid gap-4 md:grid-cols-3">
												<div className="rounded-lg border p-4">
													<div className="flex items-center gap-2 mb-2">
														<BarChart3 className="h-5 w-5 text-primary" />
														<h3 className="font-medium">Session Completion Rate</h3>
													</div>
													<div className="text-2xl font-bold mb-2">95%</div>
													<Progress value={95} className="h-2" />
												</div>
												<div className="rounded-lg border p-4">
													<div className="flex items-center gap-2 mb-2">
														<Star className="h-5 w-5 text-primary" />
														<h3 className="font-medium">Average Session Rating</h3>
													</div>
													<div className="text-2xl font-bold mb-2">4.8/5.0</div>
													<Progress value={96} className="h-2" />
												</div>
												<div className="rounded-lg border p-4">
													<div className="flex items-center gap-2 mb-2">
														<Users className="h-5 w-5 text-primary" />
														<h3 className="font-medium">Repeat Booking Rate</h3>
													</div>
													<div className="text-2xl font-bold mb-2">78%</div>
													<Progress value={78} className="h-2" />
												</div>
											</div>
											<div>
												<h3 className="text-lg font-medium mb-4">Popular Session Topics</h3>
												<div className="grid gap-2 md:grid-cols-2">
													{[
														{ topic: "Career Development", percentage: 35 },
														{ topic: "Technical Skills", percentage: 25 },
														{ topic: "Leadership", percentage: 20 },
														{ topic: "Interview Preparation", percentage: 15 },
														{ topic: "Resume Review", percentage: 5 },
													].map((item, i) => (
														<div key={i} className="rounded-lg border p-3">
															<div className="flex items-center justify-between mb-2">
																<span className="font-medium">{item.topic}</span>
																<span className="text-sm text-muted-foreground">{item.percentage}%</span>
															</div>
															<Progress value={item.percentage} className="h-2" />
														</div>
													))}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</section>
				</div>
			</div>
		</div>
	);
}

// Sample data remains unchanged
const upcomingSessions = [
	{
		id: 1,
		title: "JavaScript Fundamentals",
		menteeId: 1,
		menteeName: "Alex Johnson",
		menteeAvatar: "/placeholder.svg",
		date: "March 22, 2025",
		time: "3:00 PM - 4:00 PM",
		type: "Video Call",
		isPaid: true,
	},
	{
		id: 2,
		title: "Career Development Strategy",
		menteeId: 2,
		menteeName: "Emma Williams",
		menteeAvatar: "/placeholder.svg",
		date: "March 23, 2025",
		time: "11:00 AM - 12:00 PM",
		type: "Video Call",
		isPaid: true,
	},
];

const sessionRequests = [
	{
		id: 1,
		topic: "React Component Architecture",
		menteeId: 3,
		menteeName: "Ryan Davis",
		menteeAvatar: "/placeholder.svg",
		preferredDate: "March 25, 2025",
		preferredTime: "2:00 PM - 3:00 PM",
		type: "Video Call",
		message: "I'm working on a complex React application and need guidance on structuring components for better maintainability.",
	},
	{
		id: 2,
		topic: "Technical Interview Preparation",
		menteeId: 4,
		menteeName: "Sophia Martinez",
		menteeAvatar: "/placeholder.svg",
		preferredDate: "March 26, 2025",
		preferredTime: "4:00 PM - 5:00 PM",
		type: "Video Call",
		message: "I have an interview with a major tech company next week and would like to practice algorithm problems and system design questions.",
	},
];

const premiumPlans = [
	{
		id: 1,
		name: "Career Accelerator",
		duration: "3 Months",
		price: 499,
		features: ["Weekly 1-on-1 Sessions", "Resume Review", "Interview Preparation", "Career Planning"],
		subscribers: 8,
		isActive: true,
	},
	{
		id: 2,
		name: "Technical Mastery",
		duration: "6 Months",
		price: 899,
		features: ["Bi-weekly 1-on-1 Sessions", "Code Reviews", "Project Guidance", "Custom Learning Path"],
		subscribers: 5,
		isActive: true,
	},
	{
		id: 3,
		name: "Leadership Development",
		duration: "3 Months",
		price: 599,
		features: ["Monthly 1-on-1 Sessions", "Leadership Assessment", "Management Skills", "Team Building"],
		subscribers: 0,
		isActive: false,
	},
];

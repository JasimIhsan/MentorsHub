import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Video, MessageSquare, Users, BookOpen, Bell, Award, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
// import { logout } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import axiosInstance from "@/api/api.config";

export default function DashboardPage() {
	// const dispatch = useDispatch();
	// const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.auth.user);

	if (!user) {
		// navigate("/authenticate");
		return null;
	}

	const test = async() => {
		const response = await axiosInstance.get('/test');
		console.log(response); 
	}

	return (
		<div className="container py-8">
			<div className="flex flex-col gap-8">
				{/* Welcome Section */}
				<section className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<h1 className="text-3xl font-bold tracking-tight">
							Welcome back, {user.firstName} {user.lastName}
						</h1>
						<p className="text-muted-foreground">Here's what's happening with your mentorship journey.</p>
					</div>

					{/* Gamification Card */}
					<Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
						<CardContent className="p-6">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div className="flex items-center gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
										<Award className="h-6 w-6 text-primary" />
									</div>
									<div>
										<h3 className="font-medium">Level 12 Growth Seeker</h3>
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<span>1,240 XP</span>
											<span>•</span>
											<span>760 XP until Level 13</span>
										</div>
									</div>
								</div>
								<Button onClick={test}>
									Test
								</Button>
								<div className="flex items-center gap-3">
									<div className="flex items-center gap-1">
										<Zap className="h-4 w-4 text-yellow-500" />
										<span className="text-sm font-medium">8 Week Streak!</span>
									</div>
									<Button asChild size="sm">
										<Link to="/gamification">View Progress</Link>
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Upcoming Sessions */}
					<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Upcoming Sessions</CardTitle>
									<CardDescription>Your scheduled mentorship sessions</CardDescription>
								</div>
								<Button variant="ghost" size="sm" asChild>
									<Link to="/sessions">View All</Link>
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{upcomingSessions.map((session) => (
									<div key={session.id} className="flex items-start gap-4 rounded-lg border p-4">
										<Avatar className="h-12 w-12">
											<AvatarImage src={session.mentorAvatar} alt={session.mentorName} />
											<AvatarFallback>{session.mentorName.charAt(0)}</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="flex items-center justify-between">
												<h3 className="font-semibold">{session.title}</h3>
												{session.isPaid ? <Badge>Paid</Badge> : <Badge variant="outline">Free</Badge>}
											</div>
											<p className="text-sm text-muted-foreground">with {session.mentorName}</p>
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
													{session.type === "video" ? <Video className="h-4 w-4 text-muted-foreground" /> : <MessageSquare className="h-4 w-4 text-muted-foreground" />}
													<span className="text-sm">{session.type === "video" ? "Video Call" : "Chat"}</span>
												</div>
											</div>
										</div>
										<Button>Join Session</Button>
									</div>
								))}
								{upcomingSessions.length === 0 && (
									<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
										<CalendarDays className="mb-2 h-8 w-8 text-muted-foreground" />
										<p className="text-center text-muted-foreground">No upcoming sessions</p>
										<Button className="mt-4" asChild>
											<Link to="/browse">Find a Mentor</Link>
										</Button>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Notifications */}
					<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Notifications</CardTitle>
									<CardDescription>Stay updated with your mentorship activities</CardDescription>
								</div>
								<Button variant="ghost" size="sm">
									Mark All as Read
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{notifications.map((notification) => (
									<div key={notification.id} className="flex items-start gap-4 rounded-lg border p-4">
										<div
											className={`flex h-10 w-10 items-center justify-center rounded-full ${
												notification.type === "reminder"
													? "bg-blue-100 text-blue-600"
													: notification.type === "availability"
													? "bg-green-100 text-green-600"
													: notification.type === "achievement"
													? "bg-yellow-100 text-yellow-600"
													: "bg-purple-100 text-purple-600"
											}`}>
											{notification.type === "reminder" ? (
												<Bell className="h-5 w-5" />
											) : notification.type === "availability" ? (
												<Users className="h-5 w-5" />
											) : notification.type === "achievement" ? (
												<Award className="h-5 w-5" />
											) : (
												<BookOpen className="h-5 w-5" />
											)}
										</div>
										<div className="flex-1">
											<p className="font-medium">{notification.message}</p>
											<p className="text-sm text-muted-foreground">{notification.time}</p>
										</div>
										<Button variant="ghost" size="sm">
											{notification.action}
										</Button>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</section>

				{/* Quick Links and Mentors Ready Now */}
				<div className="grid gap-6 md:grid-cols-2">
					{/* Quick Links */}
					<Card>
						<CardHeader>
							<CardTitle>Quick Links</CardTitle>
							<CardDescription>Frequently used actions</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2">
							<Button variant="outline" className="h-auto py-4 justify-start text-left" asChild>
								<Link to="/browse" className="flex flex-col items-start">
									<span className="font-medium">Browse Mentors</span>
									<span className="text-xs text-muted-foreground">Find experts in any field</span>
								</Link>
							</Button>
							<Button variant="outline" className="h-auto py-4 justify-start text-left" asChild>
								<Link to="/ready-now" className="flex flex-col items-start">
									<span className="font-medium">Mentors Ready Now</span>
									<span className="text-xs text-muted-foreground">Connect with available mentors</span>
								</Link>
							</Button>
							<Button variant="outline" className="h-auto py-4 justify-start text-left" asChild>
								<Link to="/gamification" className="flex flex-col items-start">
									<span className="font-medium">Your Progress</span>
									<span className="text-xs text-muted-foreground">View achievements and rewards</span>
								</Link>
							</Button>
							<Button variant="outline" className="h-auto py-4 justify-start text-left" asChild>
								<Link to="/profile" className="flex flex-col items-start">
									<span className="font-medium">Update Profile</span>
									<span className="text-xs text-muted-foreground">Manage your preferences</span>
								</Link>
							</Button>
						</CardContent>
					</Card>

					{/* Mentors Ready Now */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Mentors Ready Now</CardTitle>
									<CardDescription>Connect with mentors available right now</CardDescription>
								</div>
								<Button variant="ghost" size="sm" asChild>
									<Link to="/ready-now">View All</Link>
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{readyNowMentors.map((mentor) => (
									<div key={mentor.id} className="flex items-start gap-4 rounded-lg border p-4">
										<Avatar className="h-12 w-12">
											<AvatarImage src={mentor.avatar} alt={mentor.name} />
											<AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="flex items-center justify-between">
												<h3 className="font-semibold">{mentor.name}</h3>
												<div className="flex items-center gap-1">
													<span className="h-2 w-2 rounded-full bg-green-500"></span>
													<span className="text-xs text-muted-foreground">Available Now</span>
												</div>
											</div>
											<p className="text-sm text-muted-foreground">{mentor.expertise}</p>
											<div className="mt-2 flex flex-wrap gap-2">
												{mentor.tags.map((tag) => (
													<Badge key={tag} variant="secondary" className="text-xs">
														{tag}
													</Badge>
												))}
											</div>
											<div className="mt-2 flex items-center justify-between">
												<div className="flex items-center gap-1">
													{mentor.sessionType === "video" ? <Video className="h-4 w-4 text-muted-foreground" /> : <MessageSquare className="h-4 w-4 text-muted-foreground" />}
													<span className="text-xs text-muted-foreground">{mentor.sessionType === "video" ? "Video Call" : "Chat"}</span>
												</div>
												<div>
													{mentor.isPaid ? (
														<span className="text-sm font-medium">{mentor.rate}</span>
													) : (
														<Badge variant="outline" className="text-xs">
															Free
														</Badge>
													)}
												</div>
											</div>
										</div>
										<Button size="sm">Request Session</Button>
									</div>
								))}
								{readyNowMentors.length === 0 && (
									<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
										<Users className="mb-2 h-8 w-8 text-muted-foreground" />
										<p className="text-center text-muted-foreground">No mentors available right now</p>
										<Button className="mt-4" asChild>
											<Link to="/browse">Browse All Mentors</Link>
										</Button>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

const upcomingSessions = [
	{
		id: 1,
		title: "JavaScript Fundamentals",
		mentorName: "Sarah Johnson",
		mentorAvatar: "/placeholder.svg",
		date: "March 20, 2025",
		time: "3:00 PM - 4:00 PM",
		type: "video",
		isPaid: true,
	},
	{
		id: 2,
		title: "Career Development Strategy",
		mentorName: "Michael Chen",
		mentorAvatar: "/placeholder.svg",
		date: "March 22, 2025",
		time: "11:00 AM - 12:00 PM",
		type: "video",
		isPaid: false,
	},
];

const notifications = [
	{
		id: 1,
		type: "reminder",
		message: "Your session with Sarah Johnson starts in 1 hour",
		time: "2 hours ago",
		action: "View",
	},
	{
		id: 2,
		type: "availability",
		message: "David Kim is now available for mentoring sessions",
		time: "5 hours ago",
		action: "Connect",
	},
	{
		id: 3,
		type: "achievement",
		message: "Congratulations! You've earned the 'Consistent Learner' badge",
		time: "Yesterday",
		action: "View",
	},
	{
		id: 4,
		type: "system",
		message: "Your feedback for the React Component Design session has been submitted",
		time: "Yesterday",
		action: "View",
	},
];

const readyNowMentors = [
	{
		id: 1,
		name: "David Kim",
		expertise: "Data Science & Machine Learning",
		avatar: "/placeholder.svg",
		tags: ["Python", "ML", "Data Analysis"],
		sessionType: "video",
		isPaid: true,
		rate: "$75/hour",
	},
	{
		id: 2,
		name: "Emily Rodriguez",
		expertise: "UX/UI Design",
		avatar: "/placeholder.svg",
		tags: ["Figma", "User Research"],
		sessionType: "chat",
		isPaid: false,
	},
];

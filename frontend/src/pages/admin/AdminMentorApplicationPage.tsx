import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Calendar, CheckCircle, XCircle, Clock, Eye, Download, Filter, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export function MentorApplicationsPage() {
	return (
		<div className="container py-8">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-4">
					<h1 className="text-3xl font-bold tracking-tight">Mentor Applications</h1>
					<p className="text-muted-foreground">Review and manage mentor applications</p>
				</div>

				<div className="flex flex-col gap-6">
					{/* Search and Filters */}
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input placeholder="Search applications..." className="pl-9" />
						</div>
						<Button variant="outline">
							<Filter className="mr-2 h-4 w-4" />
							Filters
						</Button>
					</div>

					{/* Stats Cards */}
					<div className="grid gap-4 md:grid-cols-4">
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
										<Clock className="h-5 w-5 text-blue-600" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Pending</p>
										<p className="text-2xl font-bold">12</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
										<Calendar className="h-5 w-5 text-yellow-600" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">In Review</p>
										<p className="text-2xl font-bold">5</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
										<CheckCircle className="h-5 w-5 text-green-600" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Approved</p>
										<p className="text-2xl font-bold">28</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
										<XCircle className="h-5 w-5 text-red-600" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Rejected</p>
										<p className="text-2xl font-bold">7</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Applications List */}
					<Card>
						<CardHeader className="pb-0">
							<Tabs defaultValue="pending" className="w-full">
								<TabsList className="grid w-full grid-cols-4">
									<TabsTrigger value="pending">Pending</TabsTrigger>
									<TabsTrigger value="in-review">In Review</TabsTrigger>
									<TabsTrigger value="approved">Approved</TabsTrigger>
									<TabsTrigger value="rejected">Rejected</TabsTrigger>
								</TabsList>
								<TabsContent value="pending" className="mt-6">
									<div className="space-y-4">
										{pendingApplications.map((application) => (
											<ApplicationCard key={application.id} application={application} />
										))}
									</div>
								</TabsContent>
								<TabsContent value="in-review" className="mt-6">
									<div className="space-y-4">
										{inReviewApplications.map((application) => (
											<ApplicationCard key={application.id} application={application} />
										))}
									</div>
								</TabsContent>
								<TabsContent value="approved" className="mt-6">
									<div className="space-y-4">
										{approvedApplications.map((application) => (
											<ApplicationCard key={application.id} application={application} />
										))}
									</div>
								</TabsContent>
								<TabsContent value="rejected" className="mt-6">
									<div className="space-y-4">
										{rejectedApplications.map((application) => (
											<ApplicationCard key={application.id} application={application} />
										))}
									</div>
								</TabsContent>
							</Tabs>
						</CardHeader>
					</Card>
				</div>
			</div>
		</div>
	);
}

function ApplicationCard({ application }: { application: Application }) {
	return (
		<Card className="overflow-hidden">
			<CardContent className="p-0">
				<div className="flex flex-col md:flex-row">
					<div className="p-6 flex-1">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div className="flex items-start gap-4">
								<Avatar className="h-12 w-12">
									<AvatarImage src={application.avatar} alt={application.name} />
									<AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="font-bold text-lg">{application.name}</h3>
									<p className="text-muted-foreground">{application.title}</p>
									<div className="mt-2 flex flex-wrap items-center gap-4">
										<div className="flex items-center gap-1">
											<Calendar className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">Applied: {application.appliedDate}</span>
										</div>
										<div className="flex items-center gap-1">
											<BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{application.experience} Experience</span>
										</div>
										<div className="flex items-center gap-1">
											<GraduationCap className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{application.education}</span>
										</div>
									</div>
									<div className="mt-2 flex flex-wrap gap-2">
										{application.skills.map((skill) => (
											<Badge key={skill} variant="secondary">
												{skill}
											</Badge>
										))}
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<StatusBadge status={application.status} />
								<div className="flex gap-2">
									<Button variant="outline" size="sm" asChild>
										<Link to={`/admin/mentor-applications/${application.id}`}>
											<Eye className="mr-2 h-4 w-4" />
											View
										</Link>
									</Button>
									<Button variant="outline" size="sm">
										<Download className="mr-2 h-4 w-4" />
										Documents
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function StatusBadge({ status }: { status: "pending" | "in-review" | "approved" | "rejected" }) {
	if (status === "pending") {
		return (
			<Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
				Pending
			</Badge>
		);
	} else if (status === "in-review") {
		return (
			<Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
				In Review
			</Badge>
		);
	} else if (status === "approved") {
		return (
			<Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
				Approved
			</Badge>
		);
	} else {
		return (
			<Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
				Rejected
			</Badge>
		);
	}
}

interface Application {
	id: number;
	name: string;
	avatar: string;
	title: string;
	appliedDate: string;
	experience: string;
	education: string;
	skills: string[];
	status: "pending" | "in-review" | "approved" | "rejected";
}

const pendingApplications: Application[] = [
	{
		id: 1,
		name: "Michael Chen",
		avatar: "/placeholder.svg",
		title: "Senior Product Manager",
		appliedDate: "March 18, 2025",
		experience: "8+ years",
		education: "MBA, Stanford",
		skills: ["Product Strategy", "Agile", "User Research"],
		status: "pending",
	},
	{
		id: 2,
		name: "Emily Rodriguez",
		avatar: "/placeholder.svg",
		title: "UX/UI Designer",
		appliedDate: "March 17, 2025",
		experience: "5+ years",
		education: "BFA, RISD",
		skills: ["UI Design", "User Research", "Figma"],
		status: "pending",
	},
	{
		id: 3,
		name: "David Kim",
		avatar: "/placeholder.svg",
		title: "Data Scientist",
		appliedDate: "March 15, 2025",
		experience: "6+ years",
		education: "Ph.D., MIT",
		skills: ["Python", "Machine Learning", "Data Analysis"],
		status: "pending",
	},
];

const inReviewApplications: Application[] = [
	{
		id: 4,
		name: "Lisa Wang",
		avatar: "/placeholder.svg",
		title: "Marketing Strategist",
		appliedDate: "March 14, 2025",
		experience: "7+ years",
		education: "MBA, Harvard",
		skills: ["Digital Marketing", "SEO", "Content Strategy"],
		status: "in-review",
	},
	{
		id: 5,
		name: "James Wilson",
		avatar: "/placeholder.svg",
		title: "Full Stack Developer",
		appliedDate: "March 12, 2025",
		experience: "10+ years",
		education: "B.S. Computer Science, Berkeley",
		skills: ["JavaScript", "Python", "AWS"],
		status: "in-review",
	},
];

const approvedApplications: Application[] = [
	{
		id: 6,
		name: "Sarah Johnson",
		avatar: "/placeholder.svg",
		title: "Senior JavaScript Developer",
		appliedDate: "March 10, 2025",
		experience: "8+ years",
		education: "B.S. Computer Science, Stanford",
		skills: ["JavaScript", "React", "Node.js"],
		status: "approved",
	},
];

const rejectedApplications: Application[] = [
	{
		id: 7,
		name: "Robert Taylor",
		avatar: "/placeholder.svg",
		title: "Junior Developer",
		appliedDate: "March 8, 2025",
		experience: "1+ years",
		education: "Bootcamp Graduate",
		skills: ["HTML", "CSS", "JavaScript"],
		status: "rejected",
	},
];

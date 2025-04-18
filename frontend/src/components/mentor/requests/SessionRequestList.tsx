import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Check, Clock, MessageSquare, X } from "lucide-react";

interface SessionRequestsListProps {
	status: "pending" | "approved" | "rejected";
}

export function SessionRequestsList({ status }: SessionRequestsListProps) {
	const [selectedRequest, setSelectedRequest] = useState<any>(null);

	// Sample data - in a real app, this would come from an API
	const pendingRequests = [
		{
			id: "req-1",
			mentee: {
				name: "Alex Johnson",
				avatar: "/placeholder.svg?height=40&width=40",
				initials: "AJ",
				bio: "Frontend Developer with 2 years of experience",
				previousSessions: 3,
			},
			topic: "React Fundamentals",
			goals: "Understand React hooks and component lifecycle",
			proposedTime: "Today, 3:00 PM",
			alternativeTimes: ["Tomorrow, 2:00 PM", "Jul 18, 10:00 AM"],
			urgency: "high",
			plan: "Pro Plan",
			message: "I'm working on a project and struggling with useEffect. Would love your guidance on best practices.",
		},
		{
			id: "req-2",
			mentee: {
				name: "Sarah Williams",
				avatar: "/placeholder.svg?height=40&width=40",
				initials: "SW",
				bio: "UX Designer transitioning to development",
				previousSessions: 1,
			},
			topic: "Career Guidance",
			goals: "Create a transition plan from design to development",
			proposedTime: "Tomorrow, 10:00 AM",
			alternativeTimes: ["Jul 19, 1:00 PM"],
			urgency: "medium",
			plan: "Basic Plan",
			message: "I've been a designer for 5 years and want to transition to frontend development. Need advice on skills to focus on.",
		},
		{
			id: "req-3",
			mentee: {
				name: "Michael Chen",
				avatar: "/placeholder.svg?height=40&width=40",
				initials: "MC",
				bio: "Computer Science student, final year",
				previousSessions: 0,
			},
			topic: "Interview Preparation",
			goals: "Practice technical interviews for frontend roles",
			proposedTime: "Jul 18, 2:30 PM",
			alternativeTimes: ["Jul 20, 11:00 AM", "Jul 21, 3:00 PM"],
			urgency: "low",
			plan: "Premium Plan",
			message: "I have interviews coming up with major tech companies and would like to practice frontend technical questions.",
		},
		{
			id: "req-4",
			mentee: {
				name: "Jessica Taylor",
				avatar: "/placeholder.svg?height=40&width=40",
				initials: "JT",
				bio: "Backend developer learning frontend",
				previousSessions: 2,
			},
			topic: "TypeScript in React",
			goals: "Learn best practices for TypeScript with React",
			proposedTime: "Jul 19, 4:00 PM",
			alternativeTimes: [],
			urgency: "medium",
			plan: "Pro Plan",
			message: "I'm comfortable with TypeScript on the backend but struggling to implement it properly in my React projects.",
		},
	];

	const approvedRequests = [
		{
			id: "req-5",
			mentee: {
				name: "David Lee",
				avatar: "/placeholder.svg?height=40&width=40",
				initials: "DL",
				bio: "Junior developer at a startup",
				previousSessions: 4,
			},
			topic: "Code Review",
			goals: "Review authentication implementation",
			proposedTime: "Jul 20, 1:00 PM",
			alternativeTimes: [],
			urgency: "medium",
			plan: "Pro Plan",
			message: "I've implemented authentication in my app and would like you to review it for security issues.",
		},
		{
			id: "req-6",
			mentee: {
				name: "Emma Wilson",
				avatar: "/placeholder.svg?height=40&width=40",
				initials: "EW",
				bio: "Self-taught developer",
				previousSessions: 1,
			},
			topic: "Portfolio Review",
			goals: "Get feedback on projects and resume",
			proposedTime: "Jul 22, 11:00 AM",
			alternativeTimes: [],
			urgency: "low",
			plan: "Basic Plan",
			message: "I'm applying for my first developer job and would like feedback on my portfolio projects.",
		},
	];

	const rejectedRequests = [
		{
			id: "req-7",
			mentee: {
				name: "Ryan Garcia",
				avatar: "/placeholder.svg?height=40&width=40",
				initials: "RG",
				bio: "Marketing professional learning to code",
				previousSessions: 0,
			},
			topic: "WordPress Development",
			goals: "Learn custom WordPress theme development",
			proposedTime: "Jul 17, 9:00 AM",
			alternativeTimes: ["Jul 18, 9:00 AM"],
			urgency: "high",
			plan: "Basic Plan",
			message: "I need help creating a custom WordPress theme for my portfolio.",
			rejectionReason: "Topic outside expertise area",
		},
	];

	let requests = [];
	switch (status) {
		case "pending":
			requests = pendingRequests;
			break;
		case "approved":
			requests = approvedRequests;
			break;
		case "rejected":
			requests = rejectedRequests;
			break;
	}

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{requests.map((request) => (
					<Card key={request.id}>
						<CardHeader className="pb-2">
							<div className="flex justify-between items-start">
								<div className="flex items-center gap-2">
									<Avatar>
										<AvatarImage src={request.mentee.avatar || "/placeholder.svg"} alt={request.mentee.name} />
										<AvatarFallback>{request.mentee.initials}</AvatarFallback>
									</Avatar>
									<div>
										<CardTitle className="text-lg">{request.mentee.name}</CardTitle>
										<CardDescription>{request.mentee.previousSessions > 0 ? `${request.mentee.previousSessions} previous sessions` : "First-time mentee"}</CardDescription>
									</div>
								</div>
								<Badge variant={request.urgency === "high" ? "destructive" : request.urgency === "medium" ? "default" : "outline"}>{request.plan}</Badge>
							</div>
						</CardHeader>
						<CardContent className="pb-2">
							<div className="space-y-2">
								<div>
									<div className="font-medium">{request.topic}</div>
									<div className="text-sm text-muted-foreground line-clamp-2">{request.goals}</div>
								</div>
								<div className="flex items-center gap-1 text-sm">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<span className="text-muted-foreground">{request.proposedTime}</span>
								</div>
								{request.alternativeTimes.length > 0 && (
									<div className="text-xs text-muted-foreground">
										+{request.alternativeTimes.length} alternative time{request.alternativeTimes.length > 1 ? "s" : ""}
									</div>
								)}
								<div className="flex items-start gap-1 text-sm">
									<MessageSquare className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
									<span className="text-muted-foreground line-clamp-2">{request.message}</span>
								</div>
								{/* {status === "rejected" && request.rejectionReason && <div className="text-sm text-red-500">Reason: {request.rejectionReason}</div>} */}
							</div>
						</CardContent>
						<CardFooter>
							{status === "pending" ? (
								<div className="flex items-center gap-2 w-full">
									<Button variant="outline" className="flex-1" onClick={() => setSelectedRequest(request)}>
										View Details
									</Button>
									<Button size="icon" variant="outline" className="h-9 w-9">
										<Check className="h-4 w-4 text-green-500" />
										<span className="sr-only">Approve</span>
									</Button>
									<Button size="icon" variant="outline" className="h-9 w-9">
										<X className="h-4 w-4 text-red-500" />
										<span className="sr-only">Reject</span>
									</Button>
								</div>
							) : (
								<Button variant="outline" className="w-full" onClick={() => setSelectedRequest(request)}>
									View Details
								</Button>
							)}
						</CardFooter>
					</Card>
				))}
			</div>

			{requests.length === 0 && (
				<div className="text-center py-12">
					<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
						<Calendar className="h-6 w-6 text-muted-foreground" />
					</div>
					<h3 className="text-lg font-semibold">No {status} requests</h3>
					<p className="text-muted-foreground">{status === "pending" ? "You're all caught up! No pending requests to review." : status === "approved" ? "No approved requests yet." : "No rejected requests."}</p>
				</div>
			)}

			{/* Request Detail Dialog */}
			<Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Session Request Details</DialogTitle>
						<DialogDescription>Review the complete details of this session request</DialogDescription>
					</DialogHeader>

					{selectedRequest && (
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<Avatar className="h-12 w-12">
									<AvatarImage src={selectedRequest.mentee.avatar || "/placeholder.svg"} alt={selectedRequest.mentee.name} />
									<AvatarFallback>{selectedRequest.mentee.initials}</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="font-semibold">{selectedRequest.mentee.name}</h3>
									<p className="text-sm text-muted-foreground">{selectedRequest.mentee.bio}</p>
								</div>
							</div>

							<div className="space-y-2">
								<div>
									<h4 className="text-sm font-semibold">Topic</h4>
									<p>{selectedRequest.topic}</p>
								</div>

								<div>
									<h4 className="text-sm font-semibold">Goals</h4>
									<p className="text-sm">{selectedRequest.goals}</p>
								</div>

								<div>
									<h4 className="text-sm font-semibold">Message</h4>
									<p className="text-sm">{selectedRequest.message}</p>
								</div>

								<div>
									<h4 className="text-sm font-semibold">Proposed Time</h4>
									<p className="text-sm">{selectedRequest.proposedTime}</p>
								</div>

								{selectedRequest.alternativeTimes.length > 0 && (
									<div>
										<h4 className="text-sm font-semibold">Alternative Times</h4>
										<ul className="text-sm list-disc pl-5">
											{selectedRequest.alternativeTimes.map((time: string, index: number) => (
												<li key={index}>{time}</li>
											))}
										</ul>
									</div>
								)}

								<div>
									<h4 className="text-sm font-semibold">Plan</h4>
									<p className="text-sm">{selectedRequest.plan}</p>
								</div>

								{status === "rejected" && selectedRequest.rejectionReason && (
									<div>
										<h4 className="text-sm font-semibold">Rejection Reason</h4>
										<p className="text-sm text-red-500">{selectedRequest.rejectionReason}</p>
									</div>
								)}
							</div>
						</div>
					)}

					<DialogFooter>
						{status === "pending" ? (
							<div className="flex w-full gap-2">
								<Button variant="outline" className="flex-1">
									Counter-Propose
								</Button>
								<Button variant="destructive" size="sm">
									<X className="h-4 w-4 mr-1" />
									Reject
								</Button>
								<Button size="sm">
									<Check className="h-4 w-4 mr-1" />
									Approve
								</Button>
							</div>
						) : (
							<Button onClick={() => setSelectedRequest(null)}>Close</Button>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

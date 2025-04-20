import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Filter, Calendar, Check, Clock, MessageSquare, X } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/config/api.config";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Define interfaces
interface Mentee {
	_id: string;
	firstName: string;
	lastName: string;
	avatar?: string;
}

interface Request {
	id: string;
	mentor: { _id: string };
	userId: Mentee;
	topic: string;
	sessionType: string;
	sessionFormat: string;
	date: string;
	time: string;
	hours: number;
	message: string;
	status: "pending" | "approved" | "rejected";
	paymentStatus: string;
	pricing: string;
	totalAmount: number;
	createdAt: string;
}

export function MentorRequestsPage() {
	const user = useSelector((state: RootState) => state.auth.user);
	const [requests, setRequests] = useState<Request[]>([]);
	const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

	useEffect(() => {
		const fetch = async () => {
			try {
				const response = await axiosInstance.get(`/mentor/${user?.id}/requests`);
				setRequests(Array.isArray(response.data.requests) ? response.data.requests : []);
			} catch (error) {
				console.error("Failed to fetch requests:", error);
				setRequests([]);
			}
		};
		if (user?.id) fetch();
	}, [user?.id]);

	const handleApprove = async (requestId: string) => {
		try {
			await axiosInstance.post(`/mentor/requests/${requestId}/approve`);
			setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: "approved" } : r)));
		} catch (error) {
			console.error("Failed to approve request", error);
		}
	};

	const handleReject = async (requestId: string) => {
		try {
			await axiosInstance.post(`/mentor/requests/${requestId}/reject`);
			setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r)));
		} catch (error) {
			console.error("Failed to reject request", error);
		}
	};

	const renderSessionRequestsList = (filteredRequests: Request[], status: string) => {
		return (
			<>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{filteredRequests.map((request) => {
						const avatarSrc = request.userId.avatar;
						return (
							<Card key={request.id}>
								<CardHeader className="pb-2">
									<div className="flex justify-between items-start">
										<div className="flex items-center gap-2">
											<Avatar className="h-12 w-12">
												<AvatarImage src={avatarSrc} alt={`${request.userId.firstName} ${request.userId.lastName}`} />
											</Avatar>
											<div>
												<CardTitle className="text-lg">{`${request.userId.firstName} ${request.userId.lastName}`}</CardTitle>
												<CardDescription>{request.sessionFormat}</CardDescription>
											</div>
										</div>
										<Badge variant={request.pricing === "paid" ? "default" : "outline"}>{request.pricing}</Badge>
									</div>
								</CardHeader>
								<CardContent className="pb-2">
									<div className="space-y-2">
										<div>
											<div className="font-medium">Topic : {request.topic}</div>
											<div className="text-sm text-muted-foreground">Format : {request.sessionType}</div>
										</div>
										<div className="flex items-center gap-1 text-sm">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<span className="text-muted-foreground">{`${new Date(request.date).toLocaleDateString()} ${request.time} (${request.hours} hours)`}</span>
										</div>
										<div className="flex items-start gap-1 text-sm">
											<MessageSquare className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
											<span className="text-muted-foreground line-clamp-2">{request.message}</span>
										</div>
									</div>
								</CardContent>
								<CardFooter>
									{status === "pending" ? (
										<div className="flex items-center gap-2 w-full">
											<Button variant="outline" className="flex-1" onClick={() => setSelectedRequest(request)}>
												View Details
											</Button>
											<Button size="icon" variant="outline" className="h-9 w-9" onClick={() => handleApprove(request.id)}>
												<Check className="h-4 w-4 text-green-500" />
												<span className="sr-only">Approve</span>
											</Button>
											<Button size="icon" variant="outline" className="h-9 w-9" onClick={() => handleReject(request.id)}>
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
						);
					})}
				</div>

				{filteredRequests.length === 0 && (
					<div className="text-center py-12">
						<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
							<Calendar className="h-6 w-6 text-muted-foreground" />
						</div>
						<h3 className="text-lg font-semibold">No {status} requests</h3>
						<p className="text-muted-foreground">{status === "pending" ? "You're all caught up! No pending requests to review." : status === "approved" ? "No approved requests yet." : "No rejected requests."}</p>
					</div>
				)}

				<Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
					<DialogContent className="max-w-lg">
						<DialogHeader>
							<DialogTitle className="text-2xl">Session Request Details</DialogTitle>
							<DialogDescription>Review the details of this session request below</DialogDescription>
						</DialogHeader>

						{selectedRequest && (
							<div className="space-y-2">
								{/* Mentee Information */}
								<div className="flex items-center gap-4 border-b pb-3">
									<Avatar className="h-14 w-14">
										<AvatarImage src={selectedRequest.userId.avatar ?? "/placeholder.svg"} alt={`${selectedRequest.userId.firstName} ${selectedRequest.userId.lastName}`} />
									</Avatar>
									<div>
										<h3 className="text-lg font-semibold">{`${selectedRequest.userId.firstName} ${selectedRequest.userId.lastName}`}</h3>
										<p className="text-sm text-muted-foreground">{selectedRequest.sessionFormat}</p>
									</div>
								</div>

								{/* Session Details */}
								<div className="space-y-2">
									<h4 className="text-md font-semibold text-foreground">Session Details</h4>
									<div className="grid grid-cols-1 gap-4">
										<div>
											<span className="text-sm font-medium text-muted-foreground">Topic</span>
											<p className="text-sm">{selectedRequest.topic}</p>
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<span className="text-sm font-medium text-muted-foreground">Session Type</span>
												<p className="text-sm">{selectedRequest.sessionType}</p>
											</div>
											<div>
												<span className="text-sm font-medium text-muted-foreground">Session Format</span>
												<p className="text-sm">{selectedRequest.sessionFormat}</p>
											</div>
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<span className="text-sm font-medium text-muted-foreground">Date & Time</span>
												<p className="text-sm">{`${new Date(selectedRequest.date).toLocaleDateString()} ${selectedRequest.time}`}</p>
											</div>
											<div>
												<span className="text-sm font-medium text-muted-foreground">Duration</span>
												<p className="text-sm">{`${selectedRequest.hours} hour${selectedRequest.hours > 1 ? "s" : ""}`}</p>
											</div>
										</div>
										<div>
											<span className="text-sm font-medium text-muted-foreground">Message</span>
											<p className="text-sm text-foreground">{selectedRequest.message}</p>
										</div>
									</div>
								</div>

								{/* Payment Details */}
								<div className="space-y-4 border-t pt-2">
									<h4 className="text-md font-semibold text-foreground">Payment Details</h4>
									<div className="grid grid-cols-1 gap-4">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<span className="text-sm font-medium text-muted-foreground">Pricing</span>
												<p className="text-sm">{selectedRequest.pricing}</p>
											</div>
											<div>
												<span className="text-sm font-medium text-muted-foreground">Total Amount</span>
												<p className="text-sm">${selectedRequest.totalAmount}</p>
											</div>
										</div>
										<div>
											<span className="text-sm font-medium text-muted-foreground">Payment Status</span>
											<p className="text-sm">{selectedRequest.paymentStatus}</p>
										</div>
									</div>
								</div>
							</div>
						)}

						<DialogFooter className="mt-6">
							{status === "pending" ? (
								<div className="flex w-full gap-2 justify-end">
									<Button variant="destructive" size="sm" onClick={() => handleReject(selectedRequest?.id as string)}>
										<X className="h-4 w-4 mr-1" />
										Reject
									</Button>
									<Button size="sm" onClick={() => handleApprove(selectedRequest?.id as string)}>
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
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Session Requests</h1>
					<p className="text-muted-foreground">Review and manage incoming session requests</p>
				</div>
			</div>

			<Tabs defaultValue="pending" className="space-y-4">
				<div className="flex flex-col sm:flex-row justify-between gap-4">
					<TabsList>
						<TabsTrigger value="pending">Pending ({requests ? requests.filter((req) => req.status === "pending").length : 0})</TabsTrigger>
						<TabsTrigger value="approved">Approved ({requests ? requests.filter((req) => req.status === "approved").length : 0})</TabsTrigger>
						<TabsTrigger value="rejected">Rejected ({requests ? requests.filter((req) => req.status === "rejected").length : 0})</TabsTrigger>
					</TabsList>

					<div className="flex items-center gap-2">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input type="search" placeholder="Search requests..." className="w-full sm:w-[200px] pl-8 bg-background" />
						</div>

						<Select defaultValue="all">
							<SelectTrigger className="w-[130px]">
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Filter" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Requests</SelectItem>
								<SelectItem value="today">Today</SelectItem>
								<SelectItem value="week">This Week</SelectItem>
								<SelectItem value="premium">Premium Only</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<TabsContent value="pending" className="space-y-4">
					{renderSessionRequestsList(requests ? requests.filter((req) => req.status === "pending") : [], "pending")}
				</TabsContent>

				<TabsContent value="approved" className="space-y-4">
					{renderSessionRequestsList(requests ? requests.filter((req) => req.status === "approved") : [], "approved")}
				</TabsContent>

				<TabsContent value="rejected" className="space-y-4">
					{renderSessionRequestsList(requests ? requests.filter((req) => req.status === "rejected") : [], "rejected")}
				</TabsContent>
			</Tabs>
		</div>
	);
}

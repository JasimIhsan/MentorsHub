import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Check, Clock, MessageSquare, X } from "lucide-react";
import axiosInstance from "@/api/config/api.config";

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

interface SessionRequestsListProps {
	requests: Request[];
	status: string;
	setRequests: React.Dispatch<React.SetStateAction<Request[]>>;
}

export function SessionRequestsList({ requests, status, setRequests }: SessionRequestsListProps) {
	const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

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

	const getInitials = (firstName: string, lastName: string) => {
		return `${firstName[0]}${lastName[0]}`.toUpperCase();
	};

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{requests.map((request) => {
					const avatarSrc = request.userId.avatar ?? "/placeholder.svg"; // Ensure string type
					return (
						<Card key={request.id}>
							<CardHeader className="pb-2">
								<div className="flex justify-between items-start">
									<div className="flex items-center gap-2">
										<Avatar>
											<AvatarImage src={avatarSrc} alt={`${request.userId.firstName} ${request.userId.lastName}`} />
											<AvatarFallback>{getInitials(request.userId.firstName, request.userId.lastName)}</AvatarFallback>
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
										<div className="font-medium">{request.topic}</div>
										<div className="text-sm text-muted-foreground">{request.sessionType}</div>
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

			{requests.length === 0 && (
				<div className="text-center py-12">
					<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
						<Calendar className="h-6 w-6 text-muted-foreground" />
					</div>
					<h3 className="text-lg font-semibold">No {status} requests</h3>
					<p className="text-muted-foreground">{status === "pending" ? "You're all caught up! No pending requests to review." : status === "approved" ? "No approved requests yet." : "No rejected requests."}</p>
				</div>
			)}

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
									<AvatarImage src={selectedRequest.userId.avatar ?? "/placeholder.svg"} alt={`${selectedRequest.userId.firstName} ${selectedRequest.userId.lastName}`} />
									<AvatarFallback>{getInitials(selectedRequest.userId.firstName, selectedRequest.userId.lastName)}</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="font-semibold">{`${selectedRequest.userId.firstName} ${selectedRequest.userId.lastName}`}</h3>
									<p className="text-sm text-muted-foreground">{selectedRequest.sessionFormat}</p>
								</div>
							</div>

							<div className="space-y-2">
								<div>
									<h4 className="text-sm font-semibold">Topic</h4>
									<p>{selectedRequest.topic}</p>
								</div>

								<div>
									<h4 className="text-sm font-semibold">Session Type</h4>
									<p>{selectedRequest.sessionType}</p>
								</div>

								<div>
									<h4 className="text-sm font-semibold">Session Format</h4>
									<p>{selectedRequest.sessionFormat}</p>
								</div>

								<div>
									<h4 className="text-sm font-semibold">Date & Time</h4>
									<p>{`${new Date(selectedRequest.date).toLocaleDateString()} ${selectedRequest.time}`}</p>
								</div>

								<div>
									<h4 className="text-sm font-semibold">Duration</h4>
									<p>{`${selectedRequest.hours} hour${selectedRequest.hours > 1 ? "s" : ""}`}</p>
								</div>

								<div>
									<h4 className="text-sm font-semibold">Message</h4>
									<p className="text-sm">{selectedRequest.message}</p>
								</div>

								<div>
									<h4 className="text-sm font-semibold">Pricing</h4>
									<p>{selectedRequest.pricing}</p>
								</div>

								<div>
									<h4 className="text-sm font-semibold">Total Amount</h4>
									<p>${selectedRequest.totalAmount}</p>
								</div>

								<div>
									<h4 className="text-sm font-semibold">Payment Status</h4>
									<p>{selectedRequest.paymentStatus}</p>
								</div>
							</div>
						</div>
					)}

					<DialogFooter>
						{status === "pending" ? (
							<div className="flex w-full gap-2">
								<Button variant="outline" className="flex-1" onClick={() => console.log("Counter-propose")}>
									Counter-Propose
								</Button>
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
}

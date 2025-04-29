import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Filter, Calendar, Check, Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/config/api.config";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

// Define the interface based on the JSON structure
interface SessionParticipant {
	_id: string;
	firstName: string;
	lastName: string;
	avatar: string;
	paymentStatus: string;
	paymentId: string;
}

interface ISessionMentorDTO {
	id: string;
	mentor: string;
	participants: SessionParticipant[];
	topic: string;
	sessionType: string;
	sessionFormat: string;
	date: string;
	time: string;
	hours: number;
	message: string;
	status: string;
	pricing: string;
	totalAmount: number;
	createdAt: string;
	rejectReason?: string;
}

export function MentorRequestsPage() {
	const user = useSelector((state: RootState) => state.auth.user);
	const [requests, setRequests] = useState<ISessionMentorDTO[]>([]);
	const [selectedRequest, setSelectedRequest] = useState<ISessionMentorDTO | null>(null);
	const [confirmationDialog, setConfirmationDialog] = useState<{
		isOpen: boolean;
		type: "approve" | "reject" | null;
		requestId: string | null;
		rejectReason: string;
	}>({ isOpen: false, type: null, requestId: null, rejectReason: "" });
	const [searchQuery, setSearchQuery] = useState("");
	const [filterOption, setFilterOption] = useState<"all" | "free" | "paid" | "today" | "week">("all");

	useEffect(() => {
		const fetch = async () => {
			try {
				const response = await axiosInstance.get(`/mentor/sessions/${user?.id}/requests`);
				setRequests(Array.isArray(response.data.requests) ? response.data.requests : []);
			} catch (error) {
				console.error("Failed to fetch requests:", error);
				setRequests([]);
			}
		};
		if (user?.id) fetch();
	}, [user?.id]);

	const handleApprove = (requestId: string) => {
		setConfirmationDialog({ isOpen: true, type: "approve", requestId, rejectReason: "" });
	};

	const handleReject = (requestId: string) => {
		setConfirmationDialog({ isOpen: true, type: "reject", requestId, rejectReason: "" });
	};

	const handleConfirmAction = async () => {
		if (!confirmationDialog.requestId || !confirmationDialog.type) return;

		try {
			if (confirmationDialog.type === "approve") {
				const response = await axiosInstance.put(`/mentor/sessions/${confirmationDialog.requestId}/status`, { status: "approved" });
				toast.success(response.data.message);
				setRequests((prev) => prev.map((r) => (r.id === confirmationDialog.requestId ? { ...r, status: "approved" } : r)));
			} else {
				const payload = {
					status: "rejected",
					rejectReason: confirmationDialog.rejectReason,
				};
				console.log("Reject Payload:", payload);

				if (!confirmationDialog.rejectReason.trim()) {
					toast.error("Please provide a reason for rejection.");
					return;
				}

				const response = await axiosInstance.put(`/mentor/sessions/${confirmationDialog.requestId}/status`, payload);
				toast.success(response.data.message);
				setRequests((prev) => prev.map((r) => (r.id === confirmationDialog.requestId ? { ...r, status: "rejected", rejectReason: confirmationDialog.rejectReason } : r)));
			}
		} catch (error: any) {
			console.error(`Failed to ${confirmationDialog.type} request:`, error.response?.data || error.message);
			toast.error(`Failed to ${confirmationDialog.type} request: ${error.response?.data?.message || "Unknown error"}`);
		} finally {
			setConfirmationDialog({
				isOpen: false,
				type: null,
				requestId: null,
				rejectReason: "",
			});
		}
	};

	const filterRequests = (requests: ISessionMentorDTO[], status: string) => {
		let filtered = requests.filter((req) => req.status === status);

		if (searchQuery) {
			const lowerQuery = searchQuery.toLowerCase();
			filtered = filtered.filter((req) => req.participants.some((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(lowerQuery) || req.topic.toLowerCase().includes(lowerQuery)));
		}

		const today = new Date();
		const startOfWeek = new Date(today);
		startOfWeek.setDate(today.getDate() - today.getDay());

		switch (filterOption) {
			case "free":
				return filtered.filter((req) => req.pricing.toLowerCase() === "free");
			case "paid":
				return filtered.filter((req) => req.pricing.toLowerCase() === "paid");
			case "today":
				return filtered.filter((req) => new Date(req.date).toDateString() === today.toDateString());
			case "week":
				return filtered.filter((req) => {
					const reqDate = new Date(req.date);
					return reqDate >= startOfWeek && reqDate <= new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);
				});
			case "all":
			default:
				return filtered;
		}
	};

	const renderSessionRequestsList = (filteredRequests: ISessionMentorDTO[], status: string) => {
		const processedRequests = filterRequests(filteredRequests, status);

		return (
			<>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{processedRequests.map((request) => {
						const participant = request.participants[0]; // Assuming one participant for one-on-one sessions
						return (
							<Card key={request.id}>
								<CardHeader>
									<div className="flex justify-between items-start">
										<div className="flex items-center gap-3">
											<Avatar className="h-12 w-12">
												<AvatarImage src={participant.avatar} alt={`${participant.firstName} ${participant.lastName}`} />
											</Avatar>
											<div>
												<CardTitle className="text-lg">{`${participant.firstName} ${participant.lastName}`}</CardTitle>
												<CardDescription>{request.sessionFormat}</CardDescription>
											</div>
										</div>
										<Badge variant={request.pricing === "paid" ? "default" : "outline"}>{request.pricing}</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 gap-1">
										<div className="space-y-1">
											<span className="text-sm font-medium text-muted-foreground">Topic</span>
											<p className="font-medium">{request.topic}</p>
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-1">
												<span className="text-sm font-medium text-muted-foreground">
													Session Type
												</span>
												<p className="text-sm">{request.sessionType}</p>
											</div>
											<div className="space-y-1">
												<span className="text-sm font-medium text-muted-foreground">Format</span>
												<p className="text-sm">{request.sessionFormat}</p>
											</div>
										</div>
										<div className="space-y-1">
											<span className="text-sm font-medium text-muted-foreground">Date & Time</span>
											<div className="flex items-center gap-1 text-sm">
												<Clock className="h-4 w-4 text-muted-foreground" />
												<span>{`${new Date(request.date).toLocaleDateString()} ${request.time} (${request.hours} hour${request.hours > 1 ? "s" : ""})`}</span>
											</div>
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

				{processedRequests.length === 0 && (
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
								<div className="flex items-center gap-4 border-b pb-3">
									<Avatar className="h-14 w-14">
										<AvatarImage src={selectedRequest.participants[0].avatar ?? "/placeholder.svg"} alt={`${selectedRequest.participants[0].firstName} ${selectedRequest.participants[0].lastName}`} />
									</Avatar>
									<div>
										<h3 className="text-lg font-semibold">{`${selectedRequest.participants[0].firstName} ${selectedRequest.participants[0].lastName}`}</h3>
										<p className="text-sm text-muted-foreground">{selectedRequest.sessionFormat}</p>
									</div>
								</div>

								<div className="space-y-2">
									<h4 className="text-md font-semibold text-foreground">Session Details</h4>
									<div className="grid grid-cols-1 gap-1">
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

								<div className="space-y-2 border-t pt-2">
									<h4 className="text-md font-semibold text-foreground">Payment Details</h4>
									<div className="grid grid-cols-1 gap-2">
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
											<p className="text-sm">{selectedRequest.participants[0].paymentStatus}</p>
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

				<Dialog open={confirmationDialog.isOpen} onOpenChange={() => setConfirmationDialog({ isOpen: false, type: null, requestId: null, rejectReason: "" })}>
					<DialogContent className="max-w-md">
						<DialogHeader>
							<DialogTitle>{confirmationDialog.type === "approve" ? "Confirm Approval" : "Confirm Rejection"}</DialogTitle>
							<DialogDescription>{confirmationDialog.type === "approve" ? "Are you sure you want to approve this session request?" : "Please provide a reason for rejecting this session request."}</DialogDescription>
						</DialogHeader>
						{confirmationDialog.type === "reject" && (
							<div className="py-4">
								<Textarea
									placeholder="Enter reason for rejection"
									value={confirmationDialog.rejectReason}
									onChange={(e) =>
										setConfirmationDialog((prev) => {
											console.log("Updated rejectReason:", e.target.value);
											return { ...prev, rejectReason: e.target.value };
										})
									}
									className="w-full"
								/>
							</div>
						)}
						<DialogFooter>
							<Button variant="outline" onClick={() => setConfirmationDialog({ isOpen: false, type: null, requestId: null, rejectReason: "" })}>
								Cancel
							</Button>
							<Button variant={confirmationDialog.type === "approve" ? "default" : "destructive"} onClick={handleConfirmAction} disabled={confirmationDialog.type === "reject" && !confirmationDialog.rejectReason.trim()}>
								{confirmationDialog.type === "approve" ? "Approve" : "Reject"}
							</Button>
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
							<Input type="search" placeholder="Search by name or topic..." className="w-full sm:w-[200px] pl-8 bg-background" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
						</div>

						<Select value={filterOption} onValueChange={(value) => setFilterOption(value as typeof filterOption)}>
							<SelectTrigger className="w-[180px]">
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Filter by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Requests</SelectItem>
								<SelectItem value="free">Free Sessions</SelectItem>
								<SelectItem value="paid">Paid Sessions</SelectItem>
								<SelectItem value="today">Today</SelectItem>
								<SelectItem value="week">This Week</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<TabsContent value="pending" className="space-y-4">
					{renderSessionRequestsList(requests, "pending")}
				</TabsContent>

				<TabsContent value="approved" className="space-y-4">
					{renderSessionRequestsList(requests, "approved")}
				</TabsContent>

				<TabsContent value="rejected" className="space-y-4">
					{renderSessionRequestsList(requests, "rejected")}
				</TabsContent>
			</Tabs>
		</div>
	);
}

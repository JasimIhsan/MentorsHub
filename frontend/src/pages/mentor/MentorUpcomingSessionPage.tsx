import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Video, Users, MessageSquare, CheckCircle, XCircle, IndianRupee } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axiosInstance from "@/api/config/api.config";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Loading } from "@/components/custom-ui/Loading";
import { ISessionMentorDTO, SessionStatus } from "@/interfaces/ISessionDTO";
import io, { Socket } from "socket.io-client";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export function MentorUpcomingSessionsPage() {
	const [sessions, setSessions] = useState<ISessionMentorDTO[]>([]);
	const [filteredSessions, setFilteredSessions] = useState<ISessionMentorDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [joinRequests, setJoinRequests] = useState<{ userId: string; userName: string; sessionId: string }[]>([]);
	const [showJoinRequestsModal, setShowJoinRequestsModal] = useState(false);
	const [filterOption, setFilterOption] = useState<"all" | "today" | "thisMonth">("all"); // Changed from sortOption
	const [currentPage, setCurrentPage] = useState(1);
	const sessionsPerPage = 5;
	const user = useSelector((state: RootState) => state.auth.user);
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		const fetchSessions = async () => {
			if (!user?.id) {
				setError("User not authenticated. Please log in to view sessions.");
				setLoading(false);
				return;
			}

			try {
				const response = await axiosInstance.get(`/mentor/sessions/upcoming/${user.id}`);
				if (!response.data?.sessions) {
					throw new Error("No sessions data received");
				}
				setSessions(response.data.sessions);
				setFilteredSessions(response.data.sessions);
			} catch (err: any) {
				const message = err.response?.data?.message || "Failed to load sessions.";
				setError(message);
				toast.error(message);
			} finally {
				setLoading(false);
			}
		};

		fetchSessions();

		// Initialize socket
		socketRef.current = io("http://localhost:5858", { withCredentials: true });
		socketRef.current.on("connect", () => {
			console.log("Mentor connected to socket:", socketRef.current?.id);
		});

		socketRef.current.on("user-join-request", (data: { userId: string; userName: string; sessionId: string }) => {
			setJoinRequests((prev) => [...prev, data]);
			setShowJoinRequestsModal(true);
			toast.info(`${data.userName} requested to join the session.`);
		});

		return () => {
			socketRef.current?.disconnect();
		};
	}, [user?.id]);

	// Filter sessions based on filter option
	useEffect(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Normalize to start of day
		const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

		let filtered = sessions;
		if (filterOption === "today") {
			filtered = sessions.filter((session) => {
				const sessionDate = new Date(session.date);
				return sessionDate.toDateString() === today.toDateString();
			});
		} else if (filterOption === "thisMonth") {
			filtered = sessions.filter((session) => {
				const sessionDate = new Date(session.date);
				return sessionDate >= startOfMonth && sessionDate <= new Date(today.getFullYear(), today.getMonth() + 1, 0);
			});
		}
		setFilteredSessions(filtered);
		setCurrentPage(1); // Reset to first page when filtering changes
	}, [filterOption, sessions]);

	// Pagination logic
	const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
	const indexOfLastSession = currentPage * sessionsPerPage;
	const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
	const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handleStartSession = async (session: ISessionMentorDTO) => {
		try {
			await axiosInstance.put(`/mentor/sessions/start/${session.id}`);
			socketRef.current?.emit("session-started", { sessionId: session.id });
			setSessions((prev) => prev.map((s) => (s.id === session.id ? { ...s, status: "active" as SessionStatus } : s)));
			setFilteredSessions((prev) => prev.map((s) => (s.id === session.id ? { ...s, status: "active" as SessionStatus } : s)));
			toast.success("Session started!");
		} catch (err: any) {
			toast.error(err.response?.data?.message || "Failed to start session.");
		}
	};

	const handleApproveJoin = (request: { userId: string; userName: string; sessionId: string }) => {
		socketRef.current?.emit("approve-join", {
			userId: request.userId,
			sessionId: request.sessionId,
		});
		setJoinRequests((prev) => prev.filter((r) => r.userId !== request.userId));
		toast.success(`Approved ${request.userName} to join the session.`);
	};

	const handleRejectJoin = (request: { userId: string; userName: string; sessionId: string }) => {
		socketRef.current?.emit("reject-join", {
			userId: request.userId,
			sessionId: request.sessionId,
		});
		setJoinRequests((prev) => prev.filter((r) => r.userId !== request.userId));
		toast.info(`Rejected ${request.userName}'s join request.`);
	};

	const renderPaginationItems = () => {
		const items = [];
		const maxPagesToShow = 5; // Show up to 5 page numbers at a time
		let startPage = Math.max(1, currentPage - 2);
		let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

		// Adjust startPage if endPage is at the maximum
		if (endPage - startPage < maxPagesToShow - 1) {
			startPage = Math.max(1, endPage - maxPagesToShow + 1);
		}

		// Always show first page
		if (startPage > 1) {
			items.push(
				<PaginationItem key={1}>
					<PaginationLink onClick={() => handlePageChange(1)}>{1}</PaginationLink>
				</PaginationItem>
			);
			if (startPage > 2) {
				items.push(
					<PaginationItem key="start-ellipsis">
						<PaginationEllipsis />
					</PaginationItem>
				);
			}
		}

		// Show page numbers in range
		for (let page = startPage; page <= endPage; page++) {
			items.push(
				<PaginationItem key={page}>
					<PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page}>
						{page}
					</PaginationLink>
				</PaginationItem>
			);
		}

		// Show last page and ellipsis if needed
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				items.push(
					<PaginationItem key="end-ellipsis">
						<PaginationEllipsis />
					</PaginationItem>
				);
			}
			items.push(
				<PaginationItem key={totalPages}>
					<PaginationLink onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
				</PaginationItem>
			);
		}

		return items;
	};

	if (loading) {
		return <Loading appName="Mentor Sessions" loadingMessage="Loading your sessions" />;
	}

	if (error) {
		toast.error(error);
		return null;
	}

	return (
		<div className="w-full">
			<div className="flex flex-col gap-8">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold tracking-tight">Upcoming Sessions</h1>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="flex items-center gap-2">
								<span>Filter: {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={() => setFilterOption("all")}>All</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilterOption("today")}>Today</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilterOption("thisMonth")}>This Month</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<Card className="p-0 border-none bg-background shadow-none">
					<CardContent className="p-0">
						<div className="space-y-6">
							{currentSessions.map((session) => (
								<MentorSessionCardDetailed key={session.id} session={session} onStartSession={() => handleStartSession(session)} />
							))}
							{currentSessions.length === 0 && (
								<div className="text-center p-4">
									<p className="text-sm text-muted-foreground">No sessions found for the selected filter.</p>
								</div>
							)}
						</div>
						{/* Pagination Controls */}
						{totalPages > 0 && (
							<div className="mt-6">
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
										</PaginationItem>
										{renderPaginationItems()}
										<PaginationItem>
											<PaginationNext onClick={() => handlePageChange(currentPage + 1)} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} />
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
			<JoinRequestsModal isOpen={showJoinRequestsModal} onClose={() => setShowJoinRequestsModal(false)} joinRequests={joinRequests} onApprove={handleApproveJoin} onReject={handleRejectJoin} />
		</div>
	);
}

// MentorSessionCardDetailed and JoinRequestsModal components remain unchanged
interface MentorSessionCardProps {
	session: ISessionMentorDTO;
	onStartSession: () => void;
}

function MentorSessionCardDetailed({ session, onStartSession }: MentorSessionCardProps) {
	const formatTime = (time: string) => {
		const [hour, minute] = time.split(":").map(Number);
		const ampm = hour >= 12 ? "PM" : "AM";
		const hour12 = hour % 12 || 12; // convert 0 to 12 for 12AM
		return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
	};

	return (
		<Card className="overflow-hidden p-0">
			<CardContent className="p-6">
				<div className="flex flex-col md:flex-row gap-6">
					{/* Left Section: Session Details */}
					<div className="flex-1">
						<div className="flex justify-between items-center">
							<div>
								<h3 className="font-bold text-xl text-primary">{session.topic}</h3>
							</div>
						</div>

						{/* Session Metadata */}
						<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex items-center gap-2">
								<CalendarDays className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">
									{new Date(session.date).toLocaleString("en-US", {
										dateStyle: "medium",
									})}
								</span>
							</div>

							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">
									{formatTime(session.time)} ({session.hours} hours)
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Video className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{session.sessionFormat}</span>
							</div>
							<div className="flex items-center gap-2">
								<IndianRupee className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{session.pricing === "free" ? "Free" : `${session.totalAmount?.toFixed(2) || 0}`}</span>
							</div>
							<div className="flex items-center gap-2">
								<MessageSquare className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{session.sessionType}</span>
							</div>
						</div>
					</div>

					<div className="flex justify-center items-center gap-2">
						<Badge variant={session.status === "completed" ? "outline" : "default"} className={`${session.status === "completed" ? "bg-primary/5 text-primary" : "bg-primary text-primary-foreground"} capitalize`}>
							{session.status}
						</Badge>
						{/* Participants Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="flex items-center gap-2">
									<Users className="h-4 w-4" />
									<span>Participants ({session.participants.length})</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-64">
								{session.participants.length === 0 ? (
									<DropdownMenuItem disabled className="text-muted-foreground">
										No participants
									</DropdownMenuItem>
								) : (
									session.participants.map((participant) => (
										<DropdownMenuItem key={participant._id} className="flex items-center gap-2">
											<Avatar className="h-8 w-8">
												<AvatarImage src={participant.avatar} alt={`${participant.firstName} ${participant.lastName}`} />
												<AvatarFallback>{participant.firstName.charAt(0)}</AvatarFallback>
											</Avatar>
											<div className="flex flex-col">
												<span className="font-medium">
													{participant.firstName} {participant.lastName}
												</span>
												<span className="text-sm text-muted-foreground">Payment: {participant.paymentStatus || "N/A"}</span>
											</div>
										</DropdownMenuItem>
									))
								)}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Action Buttons */}
						{session.status === "upcoming" && (
							<Button onClick={onStartSession} className="w-full md:w-auto">
								Start Session
							</Button>
						)}
					</div>
					{/* Right Section: Participants Dropdown and Actions */}
				</div>
			</CardContent>
		</Card>
	);
}

interface JoinRequestsModalProps {
	isOpen: boolean;
	onClose: () => void;
	joinRequests: { userId: string; userName: string; sessionId: string }[];
	onApprove: (request: { userId: string; userName: string; sessionId: string }) => void;
	onReject: (request: { userId: string; userName: string; sessionId: string }) => void;
}

function JoinRequestsModal({ isOpen, onClose, joinRequests, onApprove, onReject }: JoinRequestsModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Join Requests</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					{joinRequests.length === 0 ? (
						<p className="text-center text-sm text-muted-foreground">No pending join requests.</p>
					) : (
						joinRequests.map((request) => (
							<div key={request.userId} className="flex items-center justify-between p-2 border-b">
								<div>
									<p className="font-medium">{request.userName}</p>
									<p className="text-sm text-muted-foreground">Requested to join session {request.sessionId}</p>
								</div>
								<div className="flex gap-2">
									<Button size="sm" onClick={() => onApprove(request)}>
										<CheckCircle className="h-4 w-4 mr-1" /> Approve
									</Button>
									<Button size="sm" variant="destructive" onClick={() => onReject(request)}>
										<XCircle className="h-4 w-4 mr-1" /> Reject
									</Button>
								</div>
							</div>
						))
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

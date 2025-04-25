import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Video, Users, DollarSign, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axiosInstance from "@/api/config/api.config";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Loading } from "@/components/custom-ui/Loading";
import { ISessionMentorDTO, SessionStatus } from "@/interfaces/ISessionDTO";
import io, { Socket } from "socket.io-client";

export function MentorSessionsPage() {
	const [sessions, setSessions] = useState<ISessionMentorDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [joinRequests, setJoinRequests] = useState<{ userId: string; userName: string; sessionId: string }[]>([]);
	const [showJoinRequestsModal, setShowJoinRequestsModal] = useState(false);
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
				const response = await axiosInstance.get(`/mentor/sessions/all/${user.id}`);
				if (!response.data?.sessions) {
					throw new Error("No sessions data received");
				}
				setSessions(response.data.sessions);
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

	const handleStartSession = async (session: ISessionMentorDTO) => {
		try {
			await axiosInstance.put(`/mentor/sessions/start/${session.id}`);
			socketRef.current?.emit("session-started", { sessionId: session.id });
			setSessions((prev) => prev.map((s) => (s.id === session.id ? { ...s, status: "active" as SessionStatus } : s)));
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

	if (loading) {
		return <Loading appName="Mentor Sessions" loadingMessage="Loading your sessions" />;
	}

	if (error) {
		toast.error(error);
		return null;
	}

	return (
		<div className="w-full p-6">
			<div className="flex flex-col gap-8">
				<h1 className="text-3xl font-bold tracking-tight">My Sessions</h1>
				<Card>
					<CardHeader>
						<h2 className="text-lg font-semibold">All Sessions</h2>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{sessions.map((session) => (
								<MentorSessionCardDetailed key={session.id} session={session} onStartSession={() => handleStartSession(session)} />
							))}
							{sessions.length === 0 && (
								<div className="text-center p-4">
									<p className="text-sm text-muted-foreground">No sessions found.</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
			<JoinRequestsModal isOpen={showJoinRequestsModal} onClose={() => setShowJoinRequestsModal(false)} joinRequests={joinRequests} onApprove={handleApproveJoin} onReject={handleRejectJoin} />
		</div>
	);
}

interface MentorSessionCardProps {
	session: ISessionMentorDTO;
	onStartSession: () => void;
}

function MentorSessionCardDetailed({ session, onStartSession }: MentorSessionCardProps) {
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
								<span className="text-sm">{session.date}</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">
									{session.time} ({session.hours} hours)
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Video className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{session.sessionFormat}</span>
							</div>
							<div className="flex items-center gap-2">
								<DollarSign className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{session.pricing === "free" ? "Free" : `$${session.totalAmount || 0}`}</span>
							</div>
							<div className="flex items-center gap-2">
								<MessageSquare className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{session.sessionType}</span>
							</div>
						</div>

						{/* Rejection Reason (if applicable) */}
						{session.rejectReason && session.status === "rejected" && (
							<div className="mt-4 p-3 bg-destructive/10 rounded-md">
								<p className="text-sm text-destructive">
									<strong>Rejection Reason:</strong> {session.rejectReason}
								</p>
							</div>
						)}
					</div>

					<div className="flex justify-center items-center gap-7">
						<Badge variant={session.status === "completed" ? "outline" : "default"} className={`${session.status === "completed" ? "bg-primary/5 text-primary" : "bg-primary text-primary-foreground"} capitalize`}>
							{session.status}
						</Badge>
						<div className="flex flex-col items-end justify-center gap-4">
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
											<DropdownMenuItem key={participant._id} className="flex flex-col items-start">
												<span className="font-medium">
													{participant.firstName} {participant.lastName}
												</span>
												<span className="text-sm text-muted-foreground">Payment: {participant.paymentStatus || "N/A"}</span>
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

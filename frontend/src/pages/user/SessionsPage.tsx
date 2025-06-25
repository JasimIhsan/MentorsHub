import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Video, MessageSquare, FileText, MoreHorizontal, Search, CreditCard, ChevronDown, CheckCircle, ArrowRight, Download, Star, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/api/config/api.config";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Loading } from "@/components/custom/Loading";
import { ISessionUserDTO } from "@/interfaces/ISessionDTO";
import { SessionDetailsModal } from "@/components/custom/SessionDetailsModal";
import { formatDate, formatTime } from "@/utility/time-data-formatter"; // Corrected import path
import { isSessionExpired } from "@/utility/is-session-expired";
import { createRazorpayOrderAPI } from "@/api/session.api.service";

declare global {
	interface Window {
		Razorpay: any;
	}
}

interface User {
	id: string;
	// Add other user properties as needed
}

export function SessionsPage() {
	const [sessions, setSessions] = useState<ISessionUserDTO[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<"upcoming" | "approved" | "completed" | "canceled" | "all" | "pending" | "rejected">("all");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [paidSession, setPaidSession] = useState<ISessionUserDTO | null>(null);
	const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
	const [selectedSession, setSelectedSession] = useState<ISessionUserDTO | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(5);
	const [showCancelDialog, setShowCancelDialog] = useState(false);
	const [sessionToCancel, setSessionToCancel] = useState<ISessionUserDTO | null>(null);
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [sessionToReview, setSessionToReview] = useState<ISessionUserDTO | null>(null);
	const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
	const [sessionToPay, setSessionToPay] = useState<ISessionUserDTO | null>(null);
	const user = useSelector((state: RootState) => state.userAuth.user as User | null);
	const [walletBalance, setWalletBalance] = useState(0);

	// Load Razorpay script
	useEffect(() => {
		let script: HTMLScriptElement | null = null;

		const loadRazorpayScript = () => {
			if (window.Razorpay) {
				setIsRazorpayLoaded(true);
				return;
			}

			script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.async = true;
			script.onload = () => setIsRazorpayLoaded(true);
			script.onerror = () => {
				toast.error("Failed to load payment gateway. Please try again later.");
				setIsRazorpayLoaded(false);
			};
			document.body.appendChild(script);
		};

		loadRazorpayScript();

		return () => {
			if (script && document.body.contains(script)) {
				document.body.removeChild(script);
			}
		};
	}, []);

	// Fetch sessions and wallet balance
	useEffect(() => {
		const fetchData = async () => {
			if (!user?.id) {
				setError("User not authenticated. Please log in to view sessions.");
				setLoading(false);
				return;
			}

			try {
				// Fetch sessions
				const sessionsResponse = await axiosInstance.get(`/user/sessions/all/${user.id}`);
				if (!sessionsResponse.data?.sessions) {
					throw new Error("No sessions data received");
				}
				setSessions(sessionsResponse.data.sessions);

				// Fetch wallet balance
				const walletResponse = await axiosInstance.get(`/user/wallet/${user.id}`);
				setWalletBalance(walletResponse.data.wallet.balance || 0);
			} catch (err: any) {
				const message = err.response?.data?.message || "Failed to load data. Please check your network and try again.";
				setError(message);
				toast.error(message);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [user?.id]);

	const handleCancelSession = async () => {
		if (!sessionToCancel || !user?.id) return;

		try {
			const response = await axiosInstance.put(`/user/sessions/cancel-session`, {
				sessionId: sessionToCancel.id,
				userId: user.id,
			});
			if (response.data.success) {
				setSessions((prevSessions) => prevSessions.map((s) => (s.id === sessionToCancel.id ? { ...s, status: "canceled" } : s)));
				toast.success("Session canceled successfully.");
			} else {
				toast.error(response.data.message || "Failed to cancel session.");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to cancel session.");
		} finally {
			setShowCancelDialog(false);
			setSessionToCancel(null);
		}
	};

	if (loading) {
		return <Loading appName="My Sessions" loadingMessage="Loading your sessions" />;
	}

	if (error) {
		toast.error(error);
		return null;
	}

	const filteredSessions = selectedCategory === "all" ? sessions : sessions.filter((session) => session.status === selectedCategory);
	const sortedSessions = filteredSessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

	const totalItems = sortedSessions.length;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentSessions = sortedSessions.slice(indexOfFirstItem, indexOfLastItem);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const categoryLabels: { [key in typeof selectedCategory]: string } = {
		upcoming: "Upcoming Sessions",
		approved: "Approved Sessions",
		completed: "Completed Sessions",
		canceled: "Canceled Sessions",
		all: "All Sessions",
		pending: "Pending Sessions",
		rejected: "Rejected Sessions",
	};

	return (
		<div className="w-full py-8 px-10 md:px-20 xl:px-25">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-4">
					<h1 className="text-3xl font-bold tracking-tight">My Sessions</h1>
					<p className="text-muted-foreground">Manage your mentoring sessions</p>
				</div>

				<Card>
					<CardHeader className="pb-0">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold">{categoryLabels[selectedCategory]}</h2>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="flex items-center gap-2" aria-label={`Filter by ${categoryLabels[selectedCategory]}`}>
										{categoryLabels[selectedCategory]}
										<ChevronDown className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onSelect={() => setSelectedCategory("all")}>All</DropdownMenuItem>
									<DropdownMenuItem onSelect={() => setSelectedCategory("upcoming")}>Upcoming</DropdownMenuItem>
									<DropdownMenuItem onSelect={() => setSelectedCategory("approved")}>Approved</DropdownMenuItem>
									<DropdownMenuItem onSelect={() => setSelectedCategory("completed")}>Completed</DropdownMenuItem>
									<DropdownMenuItem onSelect={() => setSelectedCategory("pending")}>Pending</DropdownMenuItem>
									<DropdownMenuItem onSelect={() => setSelectedCategory("canceled")}>Canceled</DropdownMenuItem>
									<DropdownMenuItem onSelect={() => setSelectedCategory("rejected")}>Rejected</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</CardHeader>
					<CardContent className="pt-6">
						<div className="space-y-4">
							{currentSessions.map((session) => (
								<SessionCard
									key={session.id}
									session={session}
									setShowPaymentModal={setShowPaymentModal}
									setPaidSession={setPaidSession}
									isRazorpayLoaded={isRazorpayLoaded}
									setSelectedSession={setSelectedSession}
									setShowCancelDialog={setShowCancelDialog}
									setSessionToCancel={setSessionToCancel}
									setShowReviewModal={setShowReviewModal}
									setSessionToReview={setSessionToReview}
									setShowPaymentMethodModal={setShowPaymentMethodModal}
									setSessionToPay={setSessionToPay}
									walletBalance={walletBalance}
								/>
							))}
							{currentSessions.length === 0 && (
								<EmptyState
									title={`No ${selectedCategory === "all" ? "sessions" : selectedCategory + " sessions"}`}
									description={`You don't have any ${selectedCategory === "all" ? "sessions" : selectedCategory + " sessions"}${
										selectedCategory === "canceled" || selectedCategory === "all" || selectedCategory === "rejected" ? "." : " scheduled."
									}`}
									action={
										selectedCategory !== "canceled" && selectedCategory !== "rejected" ? (
											<Button asChild>
												<Link to="/browse">Find a Mentor</Link>
											</Button>
										) : undefined
									}
								/>
							)}
						</div>
						{totalPages > 1 && (
							<div className="mt-6">
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious onClick={currentPage > 1 ? () => handlePageChange(currentPage - 1) : undefined} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
										</PaginationItem>
										{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
											<PaginationItem key={page}>
												<PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page}>
													{page}
												</PaginationLink>
											</PaginationItem>
										))}
										<PaginationItem>
											<PaginationNext onClick={currentPage < totalPages ? () => handlePageChange(currentPage + 1) : undefined} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} />
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						)}
						<div className="mt-6 rounded-lg border border-dashed p-4 text-center">
							<p className="text-sm text-muted-foreground">Need to reschedule a session? Contact your mentor directly or reach out to our support team.</p>
						</div>
					</CardContent>
				</Card>
			</div>
			{paidSession && (
				<PaymentSuccessModal
					isOpen={showPaymentModal}
					onClose={() => {
						setShowPaymentModal(false);
						setPaidSession(null);
						const fetchSessions = async () => {
							try {
								const response = await axiosInstance.get(`/user/sessions/all/${user?.id}`);
								setSessions(response.data.sessions);
							} catch (err: any) {
								toast.error("Failed to refresh sessions.");
							}
						};
						fetchSessions();
					}}
					session={paidSession}
				/>
			)}
			{selectedSession && <SessionDetailsModal session={selectedSession} onClose={() => setSelectedSession(null)} />}
			{sessionToReview && (
				<ReviewModal
					isOpen={showReviewModal}
					onClose={() => {
						setShowReviewModal(false);
						setSessionToReview(null);
					}}
					session={sessionToReview}
				/>
			)}
			{sessionToPay && (
				<PaymentMethodModal
					isOpen={showPaymentMethodModal}
					onClose={() => {
						setShowPaymentMethodModal(false);
						setSessionToPay(null);
					}}
					session={sessionToPay}
					walletBalance={walletBalance}
					isRazorpayLoaded={isRazorpayLoaded}
					setShowPaymentModal={setShowPaymentModal}
					setPaidSession={setPaidSession}
					userId={user?.id || ""}
				/>
			)}
			<Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cancel Session</DialogTitle>
						<DialogDescription>
							Are you sure you want to cancel your session with {sessionToCancel ? `${sessionToCancel.mentor.firstName} ${sessionToCancel.mentor.lastName}` : "this mentor"} on {sessionToCancel ? formatDate(sessionToCancel.date) : ""} at{" "}
							{sessionToCancel ? formatTime(sessionToCancel.time) : ""}?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowCancelDialog(false)}>
							Keep Session
						</Button>
						<Button variant="destructive" onClick={handleCancelSession}>
							Cancel Session
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

interface SessionCardProps {
	session: ISessionUserDTO;
	setShowPaymentModal: Dispatch<SetStateAction<boolean>>;
	setPaidSession: Dispatch<SetStateAction<ISessionUserDTO | null>>;
	isRazorpayLoaded: boolean;
	setSelectedSession: Dispatch<SetStateAction<ISessionUserDTO | null>>;
	setShowCancelDialog: Dispatch<SetStateAction<boolean>>;
	setSessionToCancel: Dispatch<SetStateAction<ISessionUserDTO | null>>;
	setShowReviewModal: Dispatch<SetStateAction<boolean>>;
	setSessionToReview: Dispatch<SetStateAction<ISessionUserDTO | null>>;
	setShowPaymentMethodModal: Dispatch<SetStateAction<boolean>>;
	setSessionToPay: Dispatch<SetStateAction<ISessionUserDTO | null>>;
	walletBalance: number;
}

function SessionCard({ session, isRazorpayLoaded, setSelectedSession, setShowCancelDialog, setSessionToCancel, setShowReviewModal, setSessionToReview, setShowPaymentMethodModal, setSessionToPay }: SessionCardProps) {
	const [isReasonOpen, setIsReasonOpen] = useState(false);

	const isExpired = session.status === "upcoming" && isSessionExpired(session.date, session.time);
	const type = isExpired ? "expired" : session.status;

	const handleInitiatePayment = () => {
		setSessionToPay(session);
		setShowPaymentMethodModal(true);
	};

	return (
		<Card className="overflow-hidden p-0">
			<CardContent className="p-0">
				<div className="flex flex-col md:flex-row">
					<div className="relative flex-shrink-0 h-24 w-full md:h-auto md:w-48 bg-primary/10">
						<div className="absolute inset-0 flex items-center justify-center">
							<Avatar className="h-16 w-16 border-2 border-background">
								<AvatarImage src={session.mentor.avatar} alt={`${session.mentor.firstName} ${session.mentor.lastName}`} />
								<AvatarFallback>{session.mentor.firstName.charAt(0)}</AvatarFallback>
							</Avatar>
						</div>
					</div>
					<div className="p-6 flex-1">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div>
								<h3 className="font-bold text-lg cursor-pointer hover:underline" onClick={() => setSelectedSession(session)}>
									{session.topic}
								</h3>
								<p className="text-muted-foreground">with {`${session.mentor.firstName} ${session.mentor.lastName}`}</p>
								<div className="mt-2 flex flex-wrap items-center gap-4">
									<div className="flex items-center gap-1">
										<CalendarDays className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">{formatDate(session.date)}</span>
									</div>
									<div className="flex items-center gap-1">
										<Clock className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">{formatTime(session.time)}</span>
									</div>
									<div className="flex items-center gap-1">
										{session.sessionType === "video" ? <Video className="h-4 w-4 text-muted-foreground" /> : <MessageSquare className="h-4 w-4 text-muted-foreground" />}
										<span className="text-sm">{session.sessionType === "video" ? "Video Call" : "Chat"}</span>
									</div>
									<div className="flex items-center gap-1">
										<MessageSquare className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">{session.sessionFormat === "one-on-one" ? "One-on-One" : "Group"}</span>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{type === "upcoming" && (
									<>
										<Button asChild>
											<Link to={`/video-call/${session.id}`}>Join Session</Link>
										</Button>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">More options</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onSelect={() => setSelectedSession(session)}>
													<FileText className="mr-2 h-4 w-4" />
													View Details
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link to={`/messages?mentor=${session.mentor._id}`} className="cursor-pointer">
														<MessageSquare className="mr-2 h-4 w-4" />
														Message
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem>
													<FileText className="mr-2 h-4 w-4" />
													View Notes
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-destructive"
													onSelect={() => {
														setSessionToCancel(session);
														setShowCancelDialog(true);
													}}>
													Cancel Session
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</>
								)}
								{type === "approved" && (
									<>
										<Badge variant="outline" className="bg-yellow-100 text-yellow-800">
											Awaiting Payment
										</Badge>
										<Button onClick={handleInitiatePayment} disabled={!isRazorpayLoaded}>
											Pay Now
											<CreditCard className="ml-2 h-4 w-4" />
										</Button>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">More options</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onSelect={() => setSelectedSession(session)}>
													<FileText className="mr-2 h-4 w-4" />
													View Details
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link to={`/messages?mentor=${session.mentor._id}`} className="cursor-pointer">
														<MessageSquare className="mr-2 h-4 w-4" />
														Message
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-destructive"
													onSelect={() => {
														setSessionToCancel(session);
														setShowCancelDialog(true);
													}}>
													Cancel Session
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</>
								)}
								{type === "completed" && (
									<>
										<Badge variant="outline" className="bg-primary/5 text-primary">
											Completed
										</Badge>
										<Button
											variant="outline"
											onClick={() => {
												setSessionToReview(session);
												setShowReviewModal(true);
											}}>
											Leave Review
										</Button>
										<Button variant="ghost" size="icon" onClick={() => setSelectedSession(session)}>
											<FileText className="h-4 w-4" />
											<span className="sr-only">View Details</span>
										</Button>
									</>
								)}
								{type === "canceled" && (
									<>
										<Badge variant="outline" className="bg-destructive/10 text-destructive">
											Canceled
										</Badge>
										<Button variant="outline" asChild>
											<Link to={`/browse`}>Rebook</Link>
										</Button>
									</>
								)}
								{type === "pending" && <Badge variant="outline">Pending</Badge>}
								{type === "rejected" && (
									<>
										<Badge variant="outline" className="bg-red-100 text-red-800">
											Rejected
										</Badge>
										<DropdownMenu open={isReasonOpen} onOpenChange={setIsReasonOpen}>
											<DropdownMenuTrigger asChild>
												<Button variant="outline" onMouseEnter={() => setIsReasonOpen(true)} onMouseLeave={() => setIsReasonOpen(false)}>
													Reason
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="max-w-xs">
												<div className="p-2 text-sm">{session.rejectReason || "No rejection reason provided."}</div>
											</DropdownMenuContent>
										</DropdownMenu>
										<Button variant="outline" asChild>
											<Link to={`/browse`}>Rebook</Link>
										</Button>
									</>
								)}
								{type === "expired" && (
									<>
										<Badge variant="outline" className="bg-gray-100 text-gray-800">
											Expired
										</Badge>
										<Button variant="outline" asChild>
											<Link to={`/browse`}>Rebook</Link>
										</Button>
										<Button variant="ghost" size="icon" onClick={() => setSelectedSession(session)}>
											<FileText className="h-4 w-4" />
											<span className="sr-only">View Details</span>
										</Button>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
	return (
		<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
			<Search className="mb-2 h-10 w-10 text-muted-foreground" />
			<h3 className="text-lg font-medium">{title}</h3>
			<p className="mt-1 text-sm text-muted-foreground">{description}</p>
			{action && <div className="mt-4">{action}</div>}
		</div>
	);
}

function PaymentSuccessModal({ isOpen, onClose, session }: { isOpen: boolean; onClose: () => void; session: ISessionUserDTO }) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-lg p-0 overflow-hidden">
				<div className="bg-gradient-to-r from-primary to-blue-500 p-4 text-center text-white">
					<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
						<CheckCircle className="h-10 w-10 text-white" />
					</div>
					<DialogHeader>
						<DialogTitle className="text-3xl font-bold text-white text-center">Payment Successful!</DialogTitle>
					</DialogHeader>
					<p className="mt-2 text-white/80">Your session has been booked successfully</p>
				</div>
				<div className="px-6">
					<div className="space-y-2">
						<div className="rounded-lg bg-primary/5 p-4">
							<h3 className="mb-4 font-medium">Session Details</h3>
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
										<CalendarDays className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Date</p>
										<p className="font-medium">{formatDate(session.date)}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
										<Clock className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Time</p>
										<p className="font-medium">{formatTime(session.time)}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
										<MessageSquare className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Mentor</p>
										<p className="font-medium">{`${session.mentor.firstName} ${session.mentor.lastName}`}</p>
									</div>
								</div>
							</div>
						</div>
						<div className="flex justify-center">
							<Button variant="outline" className="gap-2">
								<Download className="h-4 w-4" />
								Add to Calendar
							</Button>
						</div>
						<div className="rounded-lg border border-dashed p-4 text-center">
							<p className="text-sm text-muted-foreground">You'll receive an email with the session details and a calendar invitation. The video call link will be available 15 minutes before the session starts.</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-3 px-6 pb-6 bg-background">
					<Button asChild className="w-full gap-2">
						<Link to="/sessions" onClick={onClose}>
							View My Sessions
							<ArrowRight className="h-4 w-4" />
						</Link>
					</Button>
					<Button variant="outline" asChild className="w-full" onClick={onClose}>
						<Link to="/dashboard">Back to Dashboard</Link>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function ReviewModal({ isOpen, onClose, session }: { isOpen: boolean; onClose: () => void; session: ISessionUserDTO }) {
	const [rating, setRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);
	const [feedback, setFeedback] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const user = useSelector((state: RootState) => state.userAuth.user as User | null);

	const handleSubmitReview = async () => {
		if (!user?.id || !session.id) {
			toast.error("User or session not found.");
			return;
		}

		if (rating === 0) {
			toast.error("Please provide a rating.");
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await axiosInstance.post("/user/reviews/create", {
				reviewerId: user.id,
				sessionId: session.id,
				mentorId: session.mentor._id,
				rating,
				comment: feedback,
			});
			if (response.data.success) {
				toast.success("Review submitted successfully!");
				onClose();
			} else {
				toast.error(response.data.message || "Failed to submit review.");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to submit review.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Leave a Review</DialogTitle>
					<DialogDescription>
						Share your feedback for your session with {session.mentor.firstName} {session.mentor.lastName} on {formatDate(session.date)} at {formatTime(session.time)}.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="flex justify-center gap-1">
						{[1, 2, 3, 4, 5].map((star) => (
							<Star
								key={star}
								className={`h-9 w-9 cursor-pointer ${star <= (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
								onClick={() => setRating(star)}
								onMouseEnter={() => setHoverRating(star)}
								onMouseLeave={() => setHoverRating(0)}
							/>
						))}
					</div>
					<div>
						<label htmlFor="feedback" className="text-sm font-medium">
							Your Feedback
						</label>
						<Textarea id="feedback" placeholder="Share your experience..." value={feedback} onChange={(e) => setFeedback(e.target.value)} className="mt-1" rows={4} />
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button onClick={handleSubmitReview} disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : "Submit Review"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function PaymentMethodModal({
	isOpen,
	onClose,
	session,
	walletBalance,
	isRazorpayLoaded,
	setShowPaymentModal,
	setPaidSession,
	userId,
}: {
	isOpen: boolean;
	onClose: () => void;
	session: ISessionUserDTO;
	walletBalance: number;
	isRazorpayLoaded: boolean;
	setShowPaymentModal: Dispatch<SetStateAction<boolean>>;
	setPaidSession: Dispatch<SetStateAction<ISessionUserDTO | null>>;
	userId: string;
}) {
	const [isPaying, setIsPaying] = useState(false);

	const handleWalletPayment = async () => {
		// Fallback check for safety, though totalAmount is now required
		if (!session.totalAmount || walletBalance < session.totalAmount) {
			toast.error("Insufficient wallet balance. Please use gateway payment or top up your wallet.");
			return;
		}

		setIsPaying(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const response = await axiosInstance.post("/user/sessions/pay/wallet", {
				sessionId: session.id,
				userId: userId,
				paymentStatus: "completed",
				status: "upcoming",
			});
			if (response.data.success) {
				setPaidSession({ ...session, status: "upcoming" });
				setShowPaymentModal(true);
				toast.success("Payment successful using wallet! Session moved to upcoming.");
				onClose();
			} else {
				toast.error(response.data?.message || "Wallet payment failed.");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to process wallet payment.");
		} finally {
			setIsPaying(false);
		}
	};

	const handleGatewayPayment = async () => {
		if (!isRazorpayLoaded || !window.Razorpay) {
			toast.error("Payment gateway not loaded. Please try again later.");
			return;
		}

		setIsPaying(true);
		let order;
		try {
			order = await createRazorpayOrderAPI(session.id, userId);
			if (!order || !order.id || !order.amount) {
				throw new Error("Invalid order details received from server.");
			}
		} catch (error: any) {
			toast.error(error.message || "Failed to create order.");
			setIsPaying(false);
			return;
		}

		try {
			const options = {
				key: import.meta.env.VITE_RAZORPAY_KEY,
				amount: order.amount,
				currency: "INR",
				name: "Mentor Session Payment",
				description: `Payment for session with ${session.mentor.firstName} ${session.mentor.lastName}`,
				order_id: order.id,
				handler: async function (response: any) {
					try {
						const paymentResponse = await axiosInstance.post("/user/sessions/pay/gateway", {
							sessionId: session.id,
							userId: userId,
							paymentId: response.razorpay_payment_id,
							orderId: response.razorpay_order_id,
							signature: response.razorpay_signature,
							paymentStatus: "completed",
							status: "upcoming",
						});
						if (paymentResponse.data.success) {
							setPaidSession({ ...session, status: "upcoming" });
							setShowPaymentModal(true);
							toast.success("Payment successful! Session moved to upcoming.");
							onClose();
						} else {
							toast.error(paymentResponse.data?.message || "Payment processing failed.");
						}
					} catch (error: any) {
						toast.error(error.response?.data?.message || "Failed to process payment.");
					}
					setIsPaying(false);
				},
				prefill: {
					name: `${session.mentor.firstName} ${session.mentor.lastName}`,
				},
				theme: {
					color: "#112d4e",
				},
				notes: {
					sessionId: session.id,
				},
				modal: {
					ondismiss: () => {
						setIsPaying(false);
						toast.info("Payment cancelled.");
					},
				},
			};

			const rzp = new window.Razorpay(options);
			rzp.on("payment.failed", (response: any) => {
				toast.error(`Payment failed: ${response.error?.description || "Unknown error"}.`);
				setIsPaying(false);
			});
			rzp.open();
		} catch (error: any) {
			toast.error(error.message || "Failed to initiate payment.");
			setIsPaying(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Select Payment Method</DialogTitle>
					<DialogDescription>
						Choose how you'd like to pay for your session with {session.mentor.firstName} {session.mentor.lastName} amounting to ₹{session.totalAmount || "N/A"}.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="flex items-center justify-between p-4 border rounded-lg">
						<div className="flex items-center gap-2">
							<Wallet className="h-5 w-5 text-primary" />
							<div>
								<p className="font-medium">Wallet Payment</p>
								<p className="text-sm text-muted-foreground">Available Balance: ₹{walletBalance}</p>
							</div>
						</div>
						<Button onClick={handleWalletPayment} disabled={isPaying || !session.totalAmount || walletBalance < session.totalAmount}>
							{isPaying ? "Processing..." : "Pay with Wallet"}
						</Button>
					</div>
					<div className="flex items-center justify-between p-4 border rounded-lg">
						<div className="flex items-center gap-2">
							<CreditCard className="h-5 w-5 text-primary" />
							<div>
								<p className="font-medium">Online Payment</p>
								<p className="text-sm text-muted-foreground">Pay securely with card, UPI, or net banking</p>
							</div>
						</div>
						<Button onClick={handleGatewayPayment} disabled={isPaying || !isRazorpayLoaded}>
							{isPaying ? "Processing..." : "Pay Online"}
						</Button>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isPaying}>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

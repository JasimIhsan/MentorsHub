import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Video, MessageSquare, FileText, MoreHorizontal, Search, CreditCard, ChevronDown, CheckCircle, ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axiosInstance from "@/api/config/api.config";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Loading } from "@/components/custom-ui/Loading";
import { ISessionUserDTO } from "@/interfaces/ISessionDTO";

declare global {
	interface Window {
		Razorpay: any;
	}
}

export function SessionsPage() {
	const [sessions, setSessions] = useState<ISessionUserDTO[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<"upcoming" | "approved" | "completed" | "canceled" | "all" | "pending" | "rejected">("all");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [paidSession, setPaidSession] = useState<ISessionUserDTO | null>(null);
	const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
	const user = useSelector((state: RootState) => state.auth.user);

	// Load Razorpay script
	useEffect(() => {
		let script: HTMLScriptElement | null = null;

		const loadRazorpayScript = () => {
			if (window.Razorpay) {
				console.log("Razorpay already loaded");
				setIsRazorpayLoaded(true);
				return;
			}

			console.log("Loading Razorpay script...");
			script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.async = true;
			script.onload = () => {
				console.log("Razorpay script loaded successfully");
				setIsRazorpayLoaded(true);
			};
			script.onerror = () => {
				console.error("Failed to load Razorpay script");
				toast.error("Failed to load payment gateway. Please try again later.");
				setIsRazorpayLoaded(false);
			};
			document.body.appendChild(script);
		};

		loadRazorpayScript();

		// Cleanup script on component unmount
		return () => {
			if (script && document.body.contains(script)) {
				console.log("Cleaning up Razorpay script");
				document.body.removeChild(script);
			}
		};
	}, []);

	// Fetch sessions
	useEffect(() => {
		const fetchSessions = async () => {
			if (!user?.id) {
				setError("User not authenticated. Please log in to view sessions.");
				setLoading(false);
				return;
			}

			try {
				const response = await axiosInstance.get(`/user/sessions/all/${user.id}`);
				if (!response.data?.sessions) {
					throw new Error("No sessions data received");
				}
				setSessions(response.data.sessions);
			} catch (err: any) {
				const message = err.response?.data?.message || "Failed to load sessions. Please check your network and try again.";
				setError(message);
				toast.error(message);
			} finally {
				setLoading(false);
			}
		};
		fetchSessions();
	}, [user?.id]);

	if (loading) {
		return <Loading appName="My Sessions" loadingMessage="Loading your sessions" />;
	}

	if (error) {
		toast.error(error);
		return null;
	}

	const filteredSessions = selectedCategory === "all" ? sessions : sessions.filter((session) => session.status === selectedCategory);
	const sortedSessions = filteredSessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

	const categoryLabels: { [key in typeof selectedCategory]: string } = {
		upcoming: "Upcoming Sessions",
		approved: "Approved Sessions",
		completed: "Completed Sessions",
		canceled: "Canceled Sessions",
		all: "All Sessions",
		pending: "Pending Sessions",
		rejected: "Rejected Sessions",
	};

	console.log(`sessions  : `, sortedSessions);
	
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
							{sortedSessions.map((session) => (
								<SessionCard key={session.id} session={session} setShowPaymentModal={setShowPaymentModal} setPaidSession={setPaidSession} isRazorpayLoaded={isRazorpayLoaded} />
							))}
							{sortedSessions.length === 0 && (
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
						// Refresh sessions after payment
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
		</div>
	);
}

interface SessionCardProps {
	session: ISessionUserDTO;
	setShowPaymentModal: (value: boolean) => void;
	setPaidSession: (session: ISessionUserDTO) => void;
	isRazorpayLoaded: boolean;
}

function SessionCard({ session, setShowPaymentModal, setPaidSession, isRazorpayLoaded }: SessionCardProps) {
	console.log('session in card: ', session);
	const [isPaying, setIsPaying] = useState(false);
	const [isReasonOpen, setIsReasonOpen] = useState(false); // State for hover dropdown
	const user = useSelector((state: RootState) => state.auth.user);

	const type = session.status;

	const handlePayment = async () => {
		if (!isRazorpayLoaded || !window.Razorpay) {
			console.error("Razorpay not loaded, cannot initiate payment");
			toast.error("Payment gateway not loaded. Please try again later.");
			return;
		}

		console.log("Initiating payment for session:", session.id);
		setIsPaying(true);
		try {
			const options = {
				key: import.meta.env.VITE_RAZORPAY_KEY,
				amount: session.totalAmount ? session.totalAmount * 100 : 0,
				currency: "INR",
				name: "Mentor Session Payment",
				description: `Payment for session with ${session.mentor.firstName} ${session.mentor.lastName}`,
				handler: async function (response: any) {
					console.log("Payment successful, response:", response);
					try {
						const paymentResponse = await axiosInstance.put("/user/sessions/pay", {
							sessionId: session.id,
							userId: user?.id,
							paymentId: response.razorpay_payment_id,
							paymentStatus: "completed",
							status: "upcoming",
						});
						if (paymentResponse.data.success) {
							console.log("Session updated to upcoming");
							setPaidSession({ ...session, status: "upcoming" });
							setShowPaymentModal(true);
							toast.success("Payment successful! Session moved to upcoming.");
						} else {
							console.error("Payment processing failed:", paymentResponse.data.message);
							toast.error(paymentResponse.data.message || "Payment processing failed.");
						}
					} catch (error: any) {
						console.error("Error processing payment:", error);
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
						console.log("Payment modal dismissed");
						setIsPaying(false);
						toast.info("Payment cancelled.");
					},
				},
			};

			console.log("Opening Razorpay payment modal with options:", options);
			const rzp = new window.Razorpay(options);
			rzp.on("payment.failed", (response: any) => {
				console.error("Payment failed:", response.error);
				toast.error(`Payment failed: ${response.error.description || "Unknown error"}.`);
				setIsPaying(false);
			});
			rzp.open();
		} catch (error) {
			console.error("Error initializing payment:", error);
			toast.error("Failed to initialize payment. Please try again.");
			setIsPaying(false);
		}
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
								<h3 className="font-bold text-lg">{session.topic}</h3>
								<p className="text-muted-foreground">with {`${session.mentor.firstName} ${session.mentor.lastName}`}</p>
								<div className="mt-2 flex flexrape-wrap items-center gap-4">
									<div className="flex items-center gap-1">
										<CalendarDays className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">{session.date}</span>
									</div>
									<div className="flex items-center gap-1">
										<Clock className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">{session.time}</span>
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
											<Link to={`/sessions/${session.id}`}>Join Session</Link>
										</Button>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">More options</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
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
												<DropdownMenuItem className="text-destructive">Cancel Session</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</>
								)}
								{type === "approved" && (
									<>
										<Badge variant="outline" className="bg-yellow-100 text-yellow-800">
											Awaiting Payment
										</Badge>
										<Button onClick={handlePayment} disabled={isPaying || !isRazorpayLoaded}>
											{isPaying ? "Processing..." : "Pay Now"}
											<CreditCard className="ml-2 h-4 w-4" />
										</Button>
									</>
								)}
								{type === "completed" && (
									<>
										<Badge variant="outline" className="bg-primary/5 text-primary">
											Completed
										</Badge>
										<Button variant="outline" asChild>
											<Link to={`/sessions/${session.id}/review`}>Leave Review</Link>
										</Button>
										<Button variant="ghost" size="icon">
											<FileText className="h-4 w-4" />
											<span className="sr-only">View Notes</span>
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

interface PaymentSuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	session: ISessionUserDTO;
}

function PaymentSuccessModal({ isOpen, onClose, session }: PaymentSuccessModalProps) {
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
										<p className="font-medium">{session.date}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
										<Clock className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Time</p>
										<p className="font-medium">{session.time}</p>
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

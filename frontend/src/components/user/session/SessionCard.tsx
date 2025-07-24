import { useState, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MessageSquare, FileText, MoreHorizontal, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ISessionUserDTO } from "@/interfaces/session.interface";
import { formatDate, formatTime } from "@/utility/time-data-formatter";
import { isSessionExpired } from "@/utility/is-session-expired";

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
	// walletBalance: number;
}

export function SessionCard({ session, isRazorpayLoaded, setSelectedSession, setShowCancelDialog, setSessionToCancel, setShowReviewModal, setSessionToReview, setShowPaymentMethodModal, setSessionToPay }: SessionCardProps) {
	const [isReasonOpen, setIsReasonOpen] = useState(false);

	// Check if session is expired
	const isExpired = session.status === "upcoming" && isSessionExpired(session.date, session.time);
	const type = isExpired ? "expired" : session.status;

	// Initiate payment
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
								<AvatarImage src={session.mentor.avatar!} alt={`${session.mentor.firstName} ${session.mentor.lastName}`} />
								<AvatarFallback className="avatarFallback">{session.mentor.firstName.charAt(0)}</AvatarFallback>
							</Avatar>
						</div>
					</div>
					<div className="p-6 flex-1">
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
													<span className="sr-only">View More options</span>
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
													<span className="sr-only">View More options</span>
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
										<Badge variant="outline" className="text-primary bg-primary/5">
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
											<span className="sr-only">View Session Details</span>
										</Button>
									</>
								)}
								{type === "canceled" && (
									<>
										<Badge variant="outline" className="bg-destructive/10 text-destructive">
											Canceled
										</Badge>
										<Button variant="outline" asChild>
											<Link to="/browse">Rebook Now</Link>
										</Button>
									</>
								)}
								{type === "pending" && <Badge variant="outline">Pending</Badge>}
								{type === "rejected" && (
									<>
										<Badge className="bg-red-100 text-red-800">Rejected</Badge>
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
											<Link to="/browse">Rebook</Link>
										</Button>
									</>
								)}
								{type === "expired" && (
									<>
										<Badge variant="outline" className="bg-gray-100 text-gray-800">
											Expired
										</Badge>
										<Button variant="outline" asChild>
											<Link to="/browse">Rebook Now</Link>
										</Button>
										<Button variant="ghost" size="icon" onClick={() => setSelectedSession(session)}>
											<FileText className="h-4 w-4" />
											<span className="sr-only">View Session Details</span>
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

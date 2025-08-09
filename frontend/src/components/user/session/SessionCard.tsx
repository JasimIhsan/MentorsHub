import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MessageSquare, FileText, MoreHorizontal, CreditCard, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { calculateEndTime } from "@/utility/calculate.endTime";
import { ISessionUserDTO } from "@/interfaces/session.interface";
import { formatDate, formatTime } from "@/utility/time-data-formatter";
import { isSessionExpired } from "@/utility/is-session-expired";
import { toast } from "sonner";
import { requestSessionRescheduleAPI } from "@/api/rescheduling.api.service";

interface SessionCardProps {
	session: ISessionUserDTO;
	setShowPaymentModal: Dispatch<SetStateAction<boolean>>;
	setPaidSession: Dispatch<SetStateAction<ISessionUserDTO | null>>;
	isRazorpayLoaded: boolean;
	setShowCancelDialog: Dispatch<SetStateAction<boolean>>;
	setSessionToCancel: Dispatch<SetStateAction<ISessionUserDTO | null>>;
	setShowReviewModal: Dispatch<SetStateAction<boolean>>;
	setSessionToReview: Dispatch<SetStateAction<ISessionUserDTO | null>>;
	setShowPaymentMethodModal: Dispatch<SetStateAction<boolean>>;
	setSessionToPay: Dispatch<SetStateAction<ISessionUserDTO | null>>;
}

export function SessionCard({ session, isRazorpayLoaded, setShowCancelDialog, setSessionToCancel, setShowReviewModal, setSessionToReview, setShowPaymentMethodModal, setSessionToPay }: SessionCardProps) {
	const [showRescheduleModal, setShowRescheduleModal] = useState(false);
	const [isReasonOpen, setIsReasonOpen] = useState(false);
	// Format current date to YYYY-MM-DD
	const formatToDateInput = (date: Date) => {
		return date.toISOString().split("T")[0];
	};

	// Initialize with current date
	const [rescheduleData, setRescheduleData] = useState({
		date: formatToDateInput(new Date()), // Set to current date
		startTime: session.startTime,
		endTime: session.endTime,
		message: "",
	});

	// Check if session is expired
	const isExpired = session.status === "upcoming" && isSessionExpired(session.date, session.endTime);
	const type = isExpired ? "expired" : session.status;

	// Update endTime when startTime changes
	useEffect(() => {
		if (rescheduleData.startTime && session.hours) {
			const calculatedEndTime = calculateEndTime(rescheduleData.startTime, session.hours);
			setRescheduleData((prev) => ({ ...prev, endTime: calculatedEndTime }));
		}
	}, [rescheduleData.startTime, session.hours]);

	// Initiate payment
	const handleInitiatePayment = () => {
		setSessionToPay(session);
		setShowPaymentMethodModal(true);
	};

	// Handle reschedule form submission
	const handleRescheduleSubmit = async () => {
		try {
			const response = await requestSessionRescheduleAPI(session.id, {
				userId: session.userId,
				...rescheduleData,
			});
			if (response.success) {
				setShowRescheduleModal(false);
				toast.success(response.message || "Session rescheduled successfully.");
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
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
								<Link to={`/sessions/details/${session.id}`}>
									<h3 className="font-bold text-lg cursor-pointer hover:underline">{session.topic}</h3>
								</Link>
								<p className="text-muted-foreground">with {`${session.mentor.firstName} ${session.mentor.lastName}`}</p>
								<div className="mt-2 flex flex-wrap items-center gap-4">
									<div className="flex items-center gap-1">
										<CalendarDays className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">{formatDate(session.date)}</span>
									</div>
									<div className="flex items-center gap-1">
										<Clock className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">{`${formatTime(session.startTime)} - ${formatTime(session.endTime)}`}</span>
									</div>
									<div className="flex items-center gap-1">
										<MessageSquare className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">{session.sessionFormat === "one-on-one" ? "One-on-One" : "Group"}</span>
									</div>
									{session.rescheduleRequest && (
										<Badge
											variant="outline"
											className={
												session.rescheduleRequest.status === "pending"
													? "bg-yellow-100 text-yellow-800"
													: session.rescheduleRequest.status === "accepted"
													? "bg-green-100 text-green-800"
													: session.rescheduleRequest.status === "rejected"
													? "bg-red-100 text-red-800"
													: "bg-gray-100 text-gray-800"
											}>
											Reschedule {session.rescheduleRequest.status && session.rescheduleRequest.status.charAt(0).toUpperCase() + session.rescheduleRequest.status.slice(1)}
										</Badge>
									)}
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
												<DropdownMenuItem asChild>
													<Link to={`/sessions/details/${session.id}`}>
														<FileText className="mr-2 h-4 w-4" />
														View Details
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link to={`/messages?mentor=${session.mentor._id}`} className="cursor-pointer">
														<MessageSquare className="mr-2 h-4 w-4" />
														Message
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem onSelect={() => setShowRescheduleModal(true)}>
													<Calendar className="mr-2 h-4 w-4" />
													Request Reschedule
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
												<DropdownMenuItem asChild>
													<Link to={`/sessions/details/${session.id}`}>
														<FileText className="mr-2 h-4 w-4" />
														View Details
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link to={`/messages?mentor=${session.mentor._id}`} className="cursor-pointer">
														<MessageSquare className="mr-2 h-4 w-4" />
														Message
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem onSelect={() => setShowRescheduleModal(true)}>
													<Calendar className="mr-2 h-4 w-4" />
													Request Reschedule
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
										<Button variant="ghost" size="icon" asChild>
											<Link to={`/sessions/details/${session.id}`}>
												<FileText className="h-4 w-4" />
												<span className="sr-only">View Session Details</span>
											</Link>
										</Button>
									</>
								)}
								{type === "canceled" && (
									<>
										<Badge variant="outline" className="bg-destructive/10 text-destructive">
											Canceled
										</Badge>
										<Button asChild>
											<Link to={`/browse/mentor-profile/${session.mentor._id}`}>Rebook Now</Link>
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
											<Link to={`/browse/mentor-profile/${session.mentor._id}`}>Rebook</Link>
										</Button>
									</>
								)}
								{type === "expired" && (
									<>
										<Badge variant="outline" className="bg-gray-100 text-gray-800">
											Expired
										</Badge>
										<Button variant="outline" asChild>
											<Link to={`/browse/mentor-profile/${session.mentor._id}`}>Rebook Now</Link>
										</Button>
										<Button variant="ghost" size="icon" asChild>
											<Link to={`/sessions/details/${session.id}`}>
												<FileText className="h-4 w-4" />
												<span className="sr-only">View Session Details</span>
											</Link>
										</Button>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
			<Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Request Reschedule</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="reschedule-date">Date</Label>
							<Input id="reschedule-date" type="date" value={rescheduleData.date} onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })} />
						</div>
						<div className="space-y-2">
							<Label htmlFor="reschedule-start-time">Start Time</Label>
							<Input id="reschedule-start-time" type="time" value={rescheduleData.startTime} onChange={(e) => setRescheduleData({ ...rescheduleData, startTime: e.target.value })} />
						</div>
						<div className="space-y-2">
							<Label htmlFor="reschedule-end-time">End Time</Label>
							<Input id="reschedule-end-time" type="time" value={rescheduleData.endTime} disabled className="bg-gray-100 cursor-not-allowed" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="reschedule-reason">Reason</Label>
							<Textarea id="reschedule-reason" value={rescheduleData.message} onChange={(e) => setRescheduleData({ ...rescheduleData, message: e.target.value })} rows={4} />
						</div>
					</div>
					<DialogFooter>
						<div className="flex flex-col gap-4 w-full">
							{session.rescheduleRequest && session.rescheduleRequest.status === "pending" && (
								<div className="w-full text-center text-red-500 bg-red-50 font-medium text-sm p-3 rounded-md">
									<p>You already have a pending reschedule request.</p>
								</div>
							)}
							<div className="flex justify-end gap-3">
								<Button variant="outline" onClick={() => setShowRescheduleModal(false)} className="min-w-[100px]">
									Cancel
								</Button>
								<Button onClick={handleRescheduleSubmit} disabled={!rescheduleData.date || !rescheduleData.startTime || (session.rescheduleRequest && session.rescheduleRequest.status === "pending")} className="min-w-[100px]">
									Submit Request
								</Button>
							</div>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Card>
	);
}

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MessageSquare, Users, CheckCircle, XCircle, AlertCircle, RefreshCw, ArrowRight, History, IndianRupee, Settings } from "lucide-react";
import { ISessionUserDTO } from "@/interfaces/session.interface";
import { SessionPaymentStatusEnum, SessionStatusEnum } from "@/interfaces/enums/session.status.enum";
import { RescheduleStatusEnum } from "@/interfaces/enums/reschedule.request.enum";
import { toast } from "sonner";
import { Link, useParams } from "react-router-dom";
import { cancelSessionAPI, cancelSessionByMentorAPI, fetchSessionByUser } from "@/api/session.api.service";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { formatDate, formatTime } from "@/utility/time-data-formatter";
import { Alert } from "@/components/custom/alert";
import { acceptProposalRescheduleAPI } from "@/api/rescheduling.api.service";
import { RescheduleDialog } from "@/components/common/reschedule/RescheduleDialog";
import { CounterProposeDialog } from "@/components/common/reschedule/CounterProposalDialog";
import { ProposalCard } from "@/components/common/reschedule/ProposalCard";
import { getStatusBadgeVariant } from "@/utility/session.status.badge";
import { IRescheduleRequestDTO } from "@/interfaces/reschedule.interface";

// Returns payment status badge component
function getPaymentStatusBadge(status: SessionPaymentStatusEnum) {
	switch (status) {
		case SessionPaymentStatusEnum.COMPLETED:
			return (
				<Badge variant="secondary" className="bg-green-100 text-green-800">
					<CheckCircle className="w-3 h-3 mr-1" />
					Paid
				</Badge>
			);
		case SessionPaymentStatusEnum.PENDING:
			return (
				<Badge variant="outline" className="border-yellow-300 text-yellow-800">
					<AlertCircle className="w-3 h-3 mr-1" />
					Pending
				</Badge>
			);
		case SessionPaymentStatusEnum.FAILED:
			return (
				<Badge variant="destructive">
					<XCircle className="w-3 h-3 mr-1" />
					Failed
				</Badge>
			);
		default:
			return null;
	}
}

export function SessionDetailsPage() {
	const { sessionId } = useParams<{ sessionId: string }>();
	const [session, setSession] = useState<ISessionUserDTO | null>(null);
	const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
	const [isCounterProposeDialogOpen, setIsCounterProposeDialogOpen] = useState(false);
	const user = useSelector((state: RootState) => state.userAuth.user);

	// Check if user is initiator of reschedule request
	const rescheduleRequest = session?.rescheduleRequest;
	const isInitiator = user?.id === rescheduleRequest?.initiatedBy;
	const canTakeAction = rescheduleRequest?.lastActionBy !== user?.id && rescheduleRequest?.status === RescheduleStatusEnum.PENDING;

	// Fetch session data
	useEffect(() => {
		if (!user?.id || !sessionId) return;
		const fetchSession = async () => {
			try {
				const response = await fetchSessionByUser(user.id!, sessionId);
				if (response.success) {
					setSession(response.session);
				}
			} catch (error) {
				if (error instanceof Error) {
					toast.error(error.message);
				}
			}
		};
		fetchSession();
	}, [user?.id, sessionId]);

	console.log(`counter proposal : `, session?.rescheduleRequest?.counterProposal);

	// Handle session cancellation
	const handleCancelSession = async () => {
		if (!user?.id || !session) return;
		const isMentor = user.id === session.mentor._id;
		console.log("isMentor: ", isMentor);
		try {
			const response = isMentor ? await cancelSessionByMentorAPI(user.id, session.id) : await cancelSessionAPI(user.id, session.id);
			if (response.success) {
				setSession(response.session);
				toast.success("Session canceled successfully.");
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
	};

	// Handle accepting a proposal
	const handleAcceptProposal = async (isCounterProposal: boolean) => {
		if (!rescheduleRequest || !user?.id) return;
		try {
			const response = await acceptProposalRescheduleAPI(user.id, rescheduleRequest.sessionId, isCounterProposal);
			if (response.success) {
				toast.success("Proposal accepted successfully.");
				setSession(response.session);
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
	};

	// Update session state with new reschedule request
	const handleRescheduleSuccess = (updatedRequest: IRescheduleRequestDTO) => {
		setSession((prev) => {
			if (!prev) return prev;
			return { ...prev, rescheduleRequest: updatedRequest };
		});
	};

	// Return loading state if session data is not yet available
	if (!session) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto px-4 py-6 max-w-4xl">
			{/* Header Section */}
			<div className="mb-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{session.topic || "Session"}</h1>
						<div className="flex flex-wrap items-center gap-3">
							<Badge variant="outline" className="flex items-center gap-1">
								<Users className="w-3 h-3" />
								{session.sessionFormat || "N/A"}
							</Badge>
							<Badge variant={getStatusBadgeVariant(session.status)}>{session.status}</Badge>
							{rescheduleRequest?.status === RescheduleStatusEnum.PENDING && (
								<Badge variant="outline" className="border-orange-300 text-orange-800">
									<RefreshCw className="w-3 h-3 mr-1" />
									Reschedule Pending
								</Badge>
							)}
							{rescheduleRequest?.status === RescheduleStatusEnum.ACCEPTED && (
								<Badge variant="secondary" className="bg-green-100 text-green-800">
									<CheckCircle className="w-3 h-3 mr-1" />
									Reschedule Accepted
								</Badge>
							)}
						</div>
					</div>
				</div>

				{/* Original Session Time */}
				<Card className="mb-6">
					<CardContent>
						<div className="flex items-center gap-2 mb-4">
							<Calendar className="w-5 h-5 text-gray-500" />
							<h3 className="font-medium">Session Schedule</h3>
						</div>
						{session.rescheduleRequest?.oldProposal ? (
							<>
								{/* <h4 className="font-medium mb-2 text-gray-700">Original Schedule</h4> */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
									<div className="flex items-center gap-3">
										<Calendar className="w-4 h-4 text-gray-500" />
										<div>
											<p className="font-medium">Date</p>
											<p className="text-gray-600">{session.rescheduleRequest.oldProposal.proposedDate ? formatDate(session.rescheduleRequest.oldProposal.proposedDate) : "N/A"}</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Clock className="w-4 h-4 text-gray-500" />
										<div>
											<p className="font-medium">Time</p>
											<p className="text-gray-600">
												{session.rescheduleRequest.oldProposal.proposedStartTime && session.rescheduleRequest.oldProposal.proposedEndTime
													? `${formatTime(session.rescheduleRequest.oldProposal.proposedStartTime)} - ${formatTime(session.rescheduleRequest.oldProposal.proposedEndTime)} (${session.hours || 0}h)`
													: "N/A"}
											</p>
										</div>
									</div>
								</div>
							</>
						) : (
							<div>
								{/* <h4 className="font-medium mb-2 text-gray-700">{session.rescheduleRequest?.oldProposal ? "Current Schedule" : "Schedule"}</h4> */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="flex items-center gap-3">
										<Calendar className="w-4 h-4 text-gray-500" />
										<div>
											<p className="font-medium">Date</p>
											<p className="text-gray-600">{session.date ? formatDate(session.date) : "N/A"}</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Clock className="w-4 h-4 text-gray-500" />
										<div>
											<p className="font-medium">Time</p>
											<p className="text-gray-600">{session.startTime && session.endTime ? `${formatTime(session.startTime)} - ${formatTime(session.endTime)} (${session.hours || 0}h)` : "N/A"}</p>
										</div>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Reschedule Details */}
			{rescheduleRequest && rescheduleRequest.status === RescheduleStatusEnum.PENDING && (
				<Card className="mb-6 border-orange-200">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-orange-900">
							<RefreshCw className="w-5 h-5" />
							Reschedule Request Details
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Request Info */}
						<div className="bg-gray-50 p-4 rounded-lg">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
								<div>
									<p className="text-sm font-medium text-gray-700">Initiated by</p>
									<p className="text-sm text-gray-900">{isInitiator ? "You" : `${session.mentor?.firstName || "N/A"} ${session.mentor?.lastName || ""}`}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-700">Last action by</p>
									<p className="text-sm text-gray-900">{rescheduleRequest.lastActionBy === user?.id ? "You" : `${session.mentor?.firstName || "N/A"} ${session.mentor?.lastName || ""}`}</p>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="text-sm font-medium text-gray-700">Created</p>
									<p className="text-sm text-gray-900">{formatDate(rescheduleRequest.createdAt)}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-700">Last updated</p>
									<p className="text-sm text-gray-900">{formatDate(rescheduleRequest.updatedAt)}</p>
								</div>
							</div>
						</div>

						{/* Proposals */}
						<div className="space-y-4">
							<h4 className="font-medium flex items-center gap-2">
								<History className="w-4 h-4" />
								Proposals
							</h4>

							{/* Current/Original Proposal */}
							<ProposalCard proposal={rescheduleRequest.currentProposal} showActions={canTakeAction} onAccept={() => handleAcceptProposal(false)} onReject={handleCancelSession} title="Current Proposal" variant="default" />

							{/* Counter Proposal */}
							{rescheduleRequest.counterProposal && (
								<>
									<div className="flex items-center gap-2 my-2">
										<ArrowRight className="w-4 h-4 text-gray-400" />
										<span className="text-sm text-gray-600">Counter proposed</span>
									</div>
									<ProposalCard proposal={rescheduleRequest.counterProposal} title="Counter Proposal" variant="counter" showActions={canTakeAction} onAccept={() => handleAcceptProposal(true)} onReject={handleCancelSession} />
								</>
							)}

							{/* Show actions for original proposal if no counter proposal */}
							{!rescheduleRequest.counterProposal && canTakeAction && !isInitiator && (
								<div className="flex gap-2">
									<Button onClick={() => setIsCounterProposeDialogOpen(true)} variant="outline">
										<RefreshCw className="w-4 h-4 mr-2" />
										Counter Propose
									</Button>

									<CounterProposeDialog session={session} userId={user?.id || ""} isOpen={isCounterProposeDialogOpen} onOpenChange={setIsCounterProposeDialogOpen} onSuccess={handleRescheduleSuccess} />
								</div>
							)}
						</div>

						{/* Status message for waiting on response */}
						{!canTakeAction && (
							<div className="flex items-center gap-2 text-orange-700 bg-orange-50 p-3 rounded-lg">
								<AlertCircle className="w-4 h-4" />
								<span className="text-sm">Waiting for {user?.role === "mentor" ? "participant" : "mentor"} response</span>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Reschedule Accepted Section */}
			{rescheduleRequest && rescheduleRequest.status === RescheduleStatusEnum.ACCEPTED && (
				<Card className="mb-6 border-green-200">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-green-900">
							<CheckCircle className="w-5 h-5" />
							Reschedule Accepted
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="bg-green-50 p-4 rounded-lg space-y-4">
							<p className="text-sm font-medium text-gray-700">Accepted Proposal</p>
							<ProposalCard proposal={rescheduleRequest.counterProposal || rescheduleRequest.currentProposal} title={rescheduleRequest.counterProposal ? "Accepted Counter Proposal" : "Accepted Original Proposal"} variant="highlight" />
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
								<div>
									<p className="text-sm font-medium text-gray-700">Accepted By</p>
									<p className="text-sm text-gray-900">{rescheduleRequest.lastActionBy === user?.id ? "You" : `${session.mentor?.firstName || "N/A"} ${session.mentor?.lastName || ""}`}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-700">Accepted At</p>
									<p className="text-sm text-gray-900">{formatDate(rescheduleRequest.updatedAt)}</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Main Details Card */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<MessageSquare className="w-5 h-5" />
						Session Details
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Session Info */}
					<div>
						<h4 className="font-medium mb-3">Session Information</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p className="text-sm font-medium text-gray-700">Topic</p>
								<p className="text-sm text-gray-900">{session.topic || "N/A"}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-700">Format</p>
								<p className="text-sm text-gray-900">{session.sessionFormat || "N/A"}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-700">Status</p>
								<Badge variant={getStatusBadgeVariant(session.status)}>{session.status}</Badge>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-700">Duration</p>
								<p className="text-sm text-gray-900">{session.hours ? `${session.hours} hour${session.hours > 1 ? "s" : ""}` : "N/A"}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-700">Created At</p>
								<p className="text-sm text-gray-900">{session.createdAt ? formatDate(session.createdAt) : "N/A"}</p>
							</div>
							{session.rejectReason && (
								<div>
									<p className="text-sm font-medium text-gray-700">Reject Reason</p>
									<p className="text-sm text-gray-900 italic">{session.rejectReason}</p>
								</div>
							)}
						</div>
					</div>

					<Separator />

					<div>
						<h4 className="font-medium mb-3">Mentor</h4>
						<div className="flex items-center gap-3">
							<Avatar>
								<AvatarImage src={session.mentor?.avatar || ""} alt={`${session.mentor?.firstName} ${session.mentor?.lastName}`} />
								<AvatarFallback>
									{session.mentor?.firstName?.[0] || "N"}
									{session.mentor?.lastName?.[0] || "A"}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-medium">
									{session.mentor?.firstName || "N/A"} {session.mentor?.lastName || ""}
								</p>
								<p className="text-sm text-gray-600">Session Mentor</p>
							</div>
						</div>
					</div>

					<Separator />

					<div>
						<h4 className="font-medium mb-2">Session Description</h4>
						<p className="text-gray-600">{session.message || "No description provided"}</p>
					</div>

					<Separator />

					<div>
						<h4 className="font-medium mb-3">Payment Information</h4>
						{session.pricing === "paid" && (
							<div className="flex flex-wrap items-center gap-4">
								<div className="flex items-center gap-2">
									<IndianRupee className="w-4 h-4 text-gray-500" />
									<span className="font-medium">{session.totalAmount ? `${session.totalAmount}/-` : "N/A"}</span>
								</div>
								{session.paymentStatus && getPaymentStatusBadge(session.paymentStatus)}
							</div>
						)}
						{session.pricing === "free" && (
							<Badge variant="secondary" className="bg-green-100 text-green-800">
								Free Session
							</Badge>
						)}
					</div>
				</CardContent>
			</Card>

			{![SessionStatusEnum.CANCELED, SessionStatusEnum.COMPLETED].includes(session.status) && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Settings className="w-5 h-5" />
							<span>Actions</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-3">
							{[SessionStatusEnum.UPCOMING, SessionStatusEnum.APPROVED].includes(session.status) && !rescheduleRequest && (
								<RescheduleDialog session={session} userId={user?.id || ""} isOpen={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen} onSuccess={handleRescheduleSuccess} />
							)}
							{session.status === SessionStatusEnum.UPCOMING && (
								<Button>
									<Link to={`/video-call/${session.id}`}>Join Session</Link>
								</Button>
							)}
							{session.status === SessionStatusEnum.COMPLETED && (
								<Button variant="outline">
									<MessageSquare className="w-4 h-4 mr-2" />
									Leave Feedback
								</Button>
							)}
							<Alert
								triggerElement={
									<Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
										Cancel Session
									</Button>
								}
								actionText="Cancel Session"
								contentTitle="Cancel Session"
								contentDescription="Are you sure you want to cancel this session?"
								onConfirm={handleCancelSession}
							/>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

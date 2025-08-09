import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, RefreshCw, CheckCircle, XCircle, ArrowRight, History, Users } from "lucide-react";
import { ISessionMentorDTO } from "@/interfaces/session.interface";
import { SessionStatusEnum } from "@/interfaces/enums/session.status.enum";
import { RescheduleStatusEnum } from "@/interfaces/enums/reschedule.request.enum";
import { IProposalDTO } from "@/interfaces/reschedule.interface";
import { formatDate, formatTime } from "@/utility/time-data-formatter";
import { counterProposeRescheduleAPI, fetchRescheduleRequestsByMentor } from "@/api/rescheduling.api.service";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";

// Returns badge variant based on session status
function getStatusBadgeVariant(status: SessionStatusEnum) {
	switch (status) {
		case SessionStatusEnum.UPCOMING:
		case SessionStatusEnum.APPROVED:
			return "default";
		case SessionStatusEnum.COMPLETED:
			return "secondary";
		case SessionStatusEnum.CANCELED:
		case SessionStatusEnum.REJECTED:
			return "destructive";
		case SessionStatusEnum.PENDING:
			return "outline";
		case SessionStatusEnum.EXPIRED:
			return "secondary";
		default:
			return "outline";
	}
}

// Proposal card component for displaying reschedule proposals
function ProposalCard({
	proposal,
	title,
	variant = "default",
	showActions = false,
	onAccept,
	onReject,
}: {
	proposal: IProposalDTO;
	title: string;
	variant?: "default" | "highlight" | "counter";
	showActions?: boolean;
	onAccept?: () => void;
	onReject?: () => void;
}) {
	const bgClass = variant === "highlight" ? "bg-blue-50 border-blue-200" : variant === "counter" ? "bg-orange-50 border-orange-200" : "bg-gray-50";
	const titleColor = variant === "highlight" ? "text-blue-900" : variant === "counter" ? "text-orange-900" : "text-gray-900";

	return (
		<div className={`p-4 rounded-lg border ${bgClass}`}>
			<h4 className={`font-medium ${titleColor} mb-3`}>{title}</h4>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
				<div className="flex items-center gap-2">
					<Calendar className={`w-4 h-4 ${variant === "highlight" ? "text-blue-600" : variant === "counter" ? "text-orange-600" : "text-gray-600"}`} />
					<div>
						<p className="text-sm font-medium">Date</p>
						<p className="text-sm text-gray-700">{proposal.proposedDate ? formatDate(proposal.proposedDate) : "N/A"}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Clock className={`w-4 h-4 ${variant === "highlight" ? "text-blue-600" : variant === "counter" ? "text-orange-600" : "text-gray-600"}`} />
					<div>
						<p className="text-sm font-medium">Time</p>
						<p className="text-sm text-gray-700">{proposal.proposedStartTime && proposal.proposedEndTime ? `${formatTime(proposal.proposedStartTime)} - ${formatTime(proposal.proposedEndTime)}` : "N/A"}</p>
					</div>
				</div>
			</div>
			{proposal.message && (
				<div className="mt-3">
					<p className="text-sm font-medium text-gray-700">Message:</p>
					<p className="text-sm text-gray-900 italic">"{proposal.message}"</p>
				</div>
			)}
			{showActions && (
				<div className="flex gap-2 mt-3">
					<Button size="sm" onClick={onAccept} className="bg-green-600 hover:bg-green-700">
						<CheckCircle className="w-3 h-3 mr-1" />
						Accept
					</Button>
					<Button size="sm" variant="destructive" onClick={onReject}>
						<XCircle className="w-3 h-3 mr-1" />
						Reject
					</Button>
				</div>
			)}
		</div>
	);
}

export function MentorRescheduleRequestsPage() {
	const [sessions, setSessions] = useState<ISessionMentorDTO[]>([]);
	const [isCounterProposeDialogOpen, setIsCounterProposeDialogOpen] = useState(false);
	const [rescheduleMessage, setRescheduleMessage] = useState("");
	const [rescheduleDate, setRescheduleDate] = useState("");
	const [rescheduleStartTime, setRescheduleStartTime] = useState("");
	const [rescheduleEndTime, setRescheduleEndTime] = useState("");
	const [selectedRescheduleRequestId, setSelectedRescheduleRequestId] = useState<string | null>(null);
	const [selectedSessionHours, setSelectedSessionHours] = useState<number | null>(null);
	const [selectedSession, setSelectedSession] = useState<ISessionMentorDTO | null>(null);
	const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const userId = useSelector((state: RootState) => state.userAuth.user?.id);

	// Calculate end time based on start time and hours
	const calculateEndTime = (startTime: string, hours: number): string => {
		if (!startTime || !hours) return "";
		const [hour, minute] = startTime.split(":").map(Number);
		const startDate = new Date();
		startDate.setHours(hour, minute, 0, 0);
		const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000);
		return `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;
	};

	// Update endTime whenever startTime or selectedSessionHours changes
	useEffect(() => {
		if (rescheduleStartTime && selectedSessionHours) {
			const endTime = calculateEndTime(rescheduleStartTime, selectedSessionHours);
			setRescheduleEndTime(endTime);
		} else {
			setRescheduleEndTime("");
		}
	}, [rescheduleStartTime, selectedSessionHours]);

	useEffect(() => {
		const fetchRequest = async () => {
			if (!userId) return;
			setIsLoading(true);
			try {
				const response = await fetchRescheduleRequestsByMentor(userId, 1, 10, RescheduleStatusEnum.PENDING);
				if (response.success) {
					setSessions(response.requests);
				}
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRequest();
	}, [userId]);

	// Handle counter proposal submission
	const handleCounterPropose = async (rescheduleRequestId: string) => {
		if (!selectedSessionHours) {
			toast.error("Session duration is not specified");
			return;
		}
		const sessionId = selectedSession?.id ?? null;
		if (!sessionId || !userId) return;
		try {
			const response = await counterProposeRescheduleAPI(userId, sessionId, rescheduleStartTime, rescheduleEndTime, rescheduleMessage, new Date(rescheduleDate));
			if (response.success) {
				setSessions((prevSessions) =>
					prevSessions.map((session) =>
						session.rescheduleRequest?.id === rescheduleRequestId
							? {
									...session,
									rescheduleRequest: {
										...session.rescheduleRequest!,
										counterProposal: {
											proposedDate: rescheduleDate,
											proposedStartTime: rescheduleStartTime,
											proposedEndTime: rescheduleEndTime,
											message: rescheduleMessage,
										},
										lastActionBy: userId,
										updatedAt: new Date().toISOString(),
									},
							  }
							: session
					)
				);
				setIsCounterProposeDialogOpen(false);
				resetRescheduleForm();
				toast.success(response.message || "Counter proposal sent successfully.");
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
	};

	// Handle accepting a proposal
	const handleAcceptProposal = (rescheduleRequestId: string, isCounterProposal: boolean) => {
		const session = sessions.find((s) => s.rescheduleRequest?.id === rescheduleRequestId);
		const proposal = isCounterProposal ? session?.rescheduleRequest?.counterProposal : session?.rescheduleRequest?.currentProposal;
		console.log(`Accept ${isCounterProposal ? "counter " : ""}proposal:`, {
			rescheduleRequestId,
			proposalType: isCounterProposal ? "counter" : "current",
			proposal,
		});
		// TODO: Implement actual API call for accepting proposal
	};

	// Handle rejecting a reschedule request
	const handleRejectRequest = (rescheduleRequestId: string) => {
		console.log("Reject reschedule request:", {
			rescheduleRequestId,
		});
		// TODO: Implement actual API call for rejecting request
	};

	// Reset reschedule form fields
	const resetRescheduleForm = () => {
		setRescheduleMessage("");
		setRescheduleDate("");
		setRescheduleStartTime("");
		setRescheduleEndTime("");
		setSelectedRescheduleRequestId(null);
		setSelectedSessionHours(null);
		setSelectedSession(null);
	};

	// Set hours and session when opening dialog
	const openCounterProposeDialog = (rescheduleRequestId: string) => {
		const session = sessions.find((s) => s.rescheduleRequest?.id === rescheduleRequestId);
		if (session) {
			setSelectedSessionHours(session.hours);
			setSelectedSession(session);
		}
		setSelectedRescheduleRequestId(rescheduleRequestId);
		setIsCounterProposeDialogOpen(true);
	};

	// Toggle expanded view for a session
	const toggleExpanded = (sessionId: string) => {
		setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
	};

	// Loading skeleton component
	const LoadingSkeleton = () => (
		<div className="space-y-4">
			{[...Array(3)].map((_, index) => (
				<Card key={index}>
					<CardHeader>
						<Skeleton className="bg-gray-200 h-6 w-1/2 mb-2" />
						<div className="flex gap-2">
							<Skeleton className="bg-gray-200 h-4 w-20" />
							<Skeleton className="bg-gray-200 h-4 w-20" />
							<Skeleton className="bg-gray-200 h-4 w-24" />
						</div>
					</CardHeader>
					<CardContent>
						<Skeleton className="bg-gray-200 h-4 w-3/4 mb-2" />
						<Skeleton className="bg-gray-200 h-4 w-1/2" />
					</CardContent>
				</Card>
			))}
		</div>
	);

	return (
		<div className="">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reschedule Requests</h1>
				<p className="text-gray-600">View and manage reschedule requests for your sessions</p>
			</div>

			{/* Loading State */}
			{isLoading ? (
				<LoadingSkeleton />
			) : (
				<>
					{/* Session List */}
					<div className="space-y-4">
						{sessions.map((session) => {
							const rescheduleRequest = session.rescheduleRequest;
							if (!rescheduleRequest || rescheduleRequest.status !== RescheduleStatusEnum.PENDING) return null;

							const initiator = session.participants.find((p) => p._id === rescheduleRequest.initiatedBy);
							const canTakeAction = rescheduleRequest.lastActionBy !== userId;
							const isExpanded = expandedSessionId === session.id;

							return (
								<Card key={session.id} className={`cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? "bg-gray-50" : ""}`} onClick={() => toggleExpanded(session.id)}>
									<CardHeader>
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
											<div>
												<CardTitle className="flex items-center gap-2">
													<RefreshCw className="w-5 h-5" />
													{session.topic}
												</CardTitle>
												<div className="flex flex-wrap items-center gap-3 mt-2">
													<Badge variant="outline" className="flex items-center gap-1">
														<Users className="w-3 h-3" />
														{session.sessionFormat || "N/A"}
													</Badge>
													<Badge variant={getStatusBadgeVariant(session.status)}>{session.status}</Badge>
													<Badge variant="outline" className="border-orange-300 text-orange-800">
														<RefreshCw className="w-3 h-3 mr-1" />
														Reschedule Pending
													</Badge>
												</div>
											</div>
											<div className="text-sm text-gray-600">
												<p>Initiated by: {initiator ? `${initiator.firstName} ${initiator.lastName}` : "Unknown"}</p>
												<p>Proposed: {rescheduleRequest.currentProposal.proposedDate ? formatDate(rescheduleRequest.currentProposal.proposedDate) : "N/A"}</p>
											</div>
										</div>
									</CardHeader>
									{isExpanded && (
										<CardContent className="space-y-6">
											{/* Session Info */}
											<div className="bg-gray-50 p-4 rounded-lg">
												<h4 className="font-medium mb-3">Original Schedule</h4>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div className="flex items-center gap-3">
														<Calendar className="w-4 h-4 text-gray-500" />
														<div>
															<p className="text-sm font-medium">Date</p>
															<p className="text-sm text-gray-600">{rescheduleRequest.oldProposal?.proposedDate ? formatDate(rescheduleRequest.oldProposal.proposedDate) : "N/A"}</p>
														</div>
													</div>
													<div className="flex items-center gap-3">
														<Clock className="w-4 h-4 text-gray-500" />
														<div>
															<p className="text-sm font-medium">Time</p>
															<p className="text-sm text-gray-600">
																{rescheduleRequest.oldProposal?.proposedStartTime && rescheduleRequest.oldProposal?.proposedEndTime
																	? `${formatTime(rescheduleRequest.oldProposal.proposedStartTime)} - ${formatTime(rescheduleRequest.oldProposal.proposedEndTime)} (${session.hours}h)`
																	: "N/A"}
															</p>
														</div>
													</div>
												</div>
											</div>

											{/* Reschedule Request Info */}
											<div className="bg-gray-50 p-4 rounded-lg">
												<h4 className="font-medium mb-3">Reschedule Request</h4>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
													<div>
														<p className="text-sm font-medium text-gray-700">Initiated by</p>
														<p className="text-sm text-gray-900">{initiator ? `${initiator.firstName} ${initiator.lastName}` : "Unknown"}</p>
													</div>
													<div>
														<p className="text-sm font-medium text-gray-700">Last action by</p>
														<p className="text-sm text-gray-900">{rescheduleRequest.lastActionBy === userId ? "You" : initiator ? `${initiator.firstName} ${initiator.lastName}` : "Unknown"}</p>
													</div>
												</div>
												{rescheduleRequest.currentProposal.message && (
													<div className="mt-3">
														<p className="text-sm font-medium text-gray-700">Message:</p>
														<p className="text-sm text-gray-900 italic">"{rescheduleRequest.currentProposal.message}"</p>
													</div>
												)}
											</div>

											{/* Proposals */}
											<div className="space-y-4">
												<h4 className="font-medium flex items-center gap-2">
													<History className="w-4 h-4" />
													Proposals
												</h4>

												{/* Current Proposal */}
												<ProposalCard
													proposal={rescheduleRequest.currentProposal}
													title="Current Proposal"
													variant="default"
													showActions={canTakeAction && !rescheduleRequest.counterProposal}
													onAccept={() => handleAcceptProposal(rescheduleRequest.id, false)}
													onReject={() => handleRejectRequest(rescheduleRequest.id)}
												/>

												{/* Counter Proposal */}
												{rescheduleRequest.counterProposal && (
													<>
														<div className="flex items-center gap-2 my-2">
															<ArrowRight className="w-4 h-4 text-gray-400" />
															<span className="text-sm text-gray-600">Counter proposed</span>
														</div>
														<ProposalCard
															proposal={rescheduleRequest.counterProposal}
															title="Counter Proposal"
															variant="counter"
															showActions={canTakeAction}
															onAccept={() => handleAcceptProposal(rescheduleRequest.id, true)}
															onReject={() => handleRejectRequest(rescheduleRequest.id)}
														/>
													</>
												)}

												{/* Action Buttons */}
												{!rescheduleRequest.counterProposal && canTakeAction && (
													<div className="flex gap-2">
														<Button variant="outline" onClick={() => openCounterProposeDialog(rescheduleRequest.id)}>
															<RefreshCw className="w-4 h-4 mr-2" />
															Counter Propose
														</Button>
													</div>
												)}
											</div>
										</CardContent>
									)}
								</Card>
							);
						})}
					</div>

					{/* Counter Propose Dialog */}
					<Dialog open={isCounterProposeDialogOpen} onOpenChange={setIsCounterProposeDialogOpen}>
						<DialogContent className="sm:max-w-3xl">
							<DialogHeader>
								<DialogTitle>Counter Propose for {selectedSession?.topic}</DialogTitle>
								<DialogDescription>Suggest an alternative time for this session.</DialogDescription>
							</DialogHeader>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Reference Schedules */}
								<div className="space-y-4">
									{/* Original Schedule */}
									{selectedSession && (
										<div className="bg-gray-50 p-4 rounded-lg">
											<h4 className="font-medium mb-3 text-gray-900">Original Schedule</h4>
											<div className="grid grid-cols-1 gap-4">
												<div className="flex items-center gap-3">
													<Calendar className="w-4 h-4 text-gray-500" />
													<div>
														<p className="text-sm font-medium">Date</p>
														<p className="text-sm text-gray-600">{selectedSession.rescheduleRequest?.oldProposal?.proposedDate ? formatDate(selectedSession.rescheduleRequest.oldProposal.proposedDate) : "N/A"}</p>
													</div>
												</div>
												<div className="flex items-center gap-3">
													<Clock className="w-4 h-4 text-gray-500" />
													<div>
														<p className="text-sm font-medium">Time</p>
														<p className="text-sm text-gray-600">
															{selectedSession.rescheduleRequest?.oldProposal?.proposedStartTime && selectedSession.rescheduleRequest?.oldProposal?.proposedEndTime
																? `${formatTime(selectedSession.rescheduleRequest.oldProposal.proposedStartTime)} - ${formatTime(selectedSession.rescheduleRequest.oldProposal.proposedEndTime)}`
																: "N/A"}
														</p>
													</div>
												</div>
											</div>
										</div>
									)}

									{/* Current Proposal */}
									{selectedSession?.rescheduleRequest?.currentProposal && (
										<div className="bg-gray-50 p-4 rounded-lg">
											<h4 className="font-medium mb-3 text-gray-900">Current Proposal</h4>
											<div className="grid grid-cols-1 gap-4">
												<div className="flex items-center gap-3">
													<Calendar className="w-4 h-4 text-gray-500" />
													<div>
														<p className="text-sm font-medium">Date</p>
														<p className="text-sm text-gray-600">{selectedSession.rescheduleRequest.currentProposal.proposedDate ? formatDate(selectedSession.rescheduleRequest.currentProposal.proposedDate) : "N/A"}</p>
													</div>
												</div>
												<div className="flex items-center gap-3">
													<Clock className="w-4 h-4 text-gray-500" />
													<div>
														<p className="text-sm font-medium">Time</p>
														<p className="text-sm text-gray-600">
															{selectedSession.rescheduleRequest.currentProposal.proposedStartTime && selectedSession.rescheduleRequest.currentProposal.proposedEndTime
																? `${formatTime(selectedSession.rescheduleRequest.currentProposal.proposedStartTime)} - ${formatTime(selectedSession.rescheduleRequest.currentProposal.proposedEndTime)}`
																: "N/A"}
														</p>
													</div>
												</div>
											</div>
										</div>
									)}
								</div>

								{/* Counter Proposal Form */}
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="counter-date">Alternative Date</Label>
										<Input id="counter-date" type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} />
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div className="space-y-2">
											<Label htmlFor="counter-start">Start Time</Label>
											<Input id="counter-start" type="time" value={rescheduleStartTime} onChange={(e) => setRescheduleStartTime(e.target.value)} />
										</div>
										<div className="space-y-2">
											<Label htmlFor="counter-end">End Time</Label>
											<Input id="counter-end" type="time" value={rescheduleEndTime} readOnly />
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="counter-hours">Duration (hours)</Label>
										<Input id="counter-hours" type="number" value={selectedSessionHours || ""} readOnly className="bg-gray-100" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="counter-message">Message</Label>
										<Textarea id="counter-message" placeholder="Add a message with your counter proposal..." value={rescheduleMessage} onChange={(e) => setRescheduleMessage(e.target.value)} />
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button variant="outline" onClick={() => setIsCounterProposeDialogOpen(false)}>
									Cancel
								</Button>
								<Button onClick={() => selectedRescheduleRequestId && handleCounterPropose(selectedRescheduleRequestId)} disabled={!rescheduleDate || !rescheduleStartTime}>
									Send Counter Proposal
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					{/* No Requests Message */}
					{sessions.every((s) => !s.rescheduleRequest || s.rescheduleRequest.status !== RescheduleStatusEnum.PENDING) && (
						<Card>
							<CardContent className="pt-6 text-center">
								<p className="text-gray-600">No pending reschedule requests at the moment.</p>
							</CardContent>
						</Card>
					)}
				</>
			)}
		</div>
	);
}

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, RefreshCw, ArrowRight, History, Users, X } from "lucide-react";
import { ISessionMentorDTO } from "@/interfaces/session.interface";
import { RescheduleStatusEnum } from "@/interfaces/enums/reschedule.request.enum";
import { formatDate, formatTime } from "@/utility/time-data-formatter";
import { acceptProposalRescheduleAPI, fetchRescheduleRequestsByMentor } from "@/api/rescheduling.api.service";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { ProposalCard } from "@/components/common/reschedule/ProposalCard";
import { getStatusBadgeVariant } from "@/utility/session.status.badge";
import { cancelSessionAPI } from "@/api/session.api.service";
import { CounterProposeDialog } from "@/components/common/reschedule/CounterProposalDialog";
import { IRescheduleRequestDTO } from "@/interfaces/reschedule.interface";

// Component for managing mentor reschedule requests
export function MentorRescheduleRequestsPage() {
	const [sessions, setSessions] = useState<ISessionMentorDTO[]>([]);
	const [isCounterProposeDialogOpen, setIsCounterProposeDialogOpen] = useState(false);
	const [selectedSession, setSelectedSession] = useState<ISessionMentorDTO | null>(null);
	const [expandedSessionIds, setExpandedSessionIds] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const userId = useSelector((state: RootState) => state.userAuth.user?.id);

	// Fetch reschedule requests for the mentor
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

	const handleRescheduleSuccess = (updatedRequest: IRescheduleRequestDTO) => {
		setSessions((prev) => prev.map((session) => (session.id === updatedRequest.sessionId ? { ...session, rescheduleRequest: updatedRequest } : session)));
	};

	// Handle accepting a proposal
	const handleAcceptProposal = async (rescheduleRequestId: string, isCounterProposal: boolean) => {
		const session = sessions.find((s) => s.rescheduleRequest?.id === rescheduleRequestId);
		if (!session || !userId) return;
		try {
			const response = await acceptProposalRescheduleAPI(userId, session.id, isCounterProposal);
			if (response.success) {
				setSessions((prev) => prev.map((s) => (s.id === session.id ? response.session : s)));
				toast.success("Proposal accepted successfully.");
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
	};

	// Handle canceling a session
	const handleCancelSession = async (rescheduleRequestId: string) => {
		const session = sessions.find((s) => s.rescheduleRequest?.id === rescheduleRequestId);
		if (!session || !userId) return;
		try {
			await cancelSessionAPI(userId, session.id);
			setSessions((prev) => prev.filter((s) => s.id !== session.id));
			toast.success("Session canceled successfully.");
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
	};

	// Open counter propose dialog with session details
	const openCounterProposeDialog = (rescheduleRequestId: string) => {
		const session = sessions.find((s) => s.rescheduleRequest?.id === rescheduleRequestId);
		if (session) {
			setSelectedSession(session);
		}
		setIsCounterProposeDialogOpen(true);
	};

	// Toggle expanded view for a session
	const toggleExpanded = (sessionId: string) => {
		setExpandedSessionIds([sessionId]);
	};

	// Close a specific session
	const closeSession = (sessionId: string) => {
		setExpandedSessionIds((prev) => prev.filter((id) => id !== sessionId));
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
		<div className="container max-w-5xl">
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
							const isExpanded = expandedSessionIds.includes(session.id);

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
											<div className="bg-blue-50 p-4 rounded-lg">
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
													onReject={() => handleCancelSession(rescheduleRequest.id)}
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
															onReject={() => handleCancelSession(rescheduleRequest.id)}
														/>
													</>
												)}

												{/* Action Buttons */}
												<div className="flex gap-2">
													{!rescheduleRequest.counterProposal && canTakeAction && (
														<Button variant="outline" onClick={() => openCounterProposeDialog(rescheduleRequest.id)}>
															<RefreshCw className="w-4 h-4 mr-2" />
															Counter Propose
														</Button>
													)}
													<div className="flex justify-end">
														<Button
															variant="outline"
															onClick={(e) => {
																e.stopPropagation();
																closeSession(session.id);
															}}>
															<X className="w-4 h-4 mr-2" />
															Close
														</Button>
													</div>
												</div>
											</div>
										</CardContent>
									)}
								</Card>
							);
						})}
					</div>

					{/* Counter Propose Dialog */}
					<CounterProposeDialog session={selectedSession!} userId={userId as string} isOpen={isCounterProposeDialogOpen} onOpenChange={setIsCounterProposeDialogOpen} onSuccess={handleRescheduleSuccess} />

					{/* No Requests Message */}
					{sessions.every((s) => !s.rescheduleRequest || s.rescheduleRequest.status !== RescheduleStatusEnum.PENDING) && (
						<div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
							{/* Icon */}
							<div className="mb-6">
								<svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</div>

							{/* Message */}
							<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Pending Reschedule Requests</h2>
							<p className="text-sm sm:text-base text-gray-500 max-w-md mb-6">It looks like there are no reschedule requests at the moment. Check back later or explore your scheduled sessions.</p>

							{/* Call to Action Buttons */}
							{/* <div className="flex flex-col sm:flex-row gap-3">
								<Button variant="default">View All Sessions</Button>
								<Button variant="outline">Schedule New Session</Button>
							</div> */}
						</div>
					)}
				</>
			)}
		</div>
	);
}

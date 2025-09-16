import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ISessionMentorDTO, ISessionUserDTO } from "@/interfaces/session.interface";
import { calculateEndTime } from "@/utility/calculate.endTime";
import { counterProposeRescheduleAPI } from "@/api/rescheduling.api.service";
import { formatDate, formatTime } from "@/utility/time-data-formatter";
import { Calendar, Clock } from "lucide-react";
import { convertLocaltoUTC } from "@/utility/time-converter/localToUTC";
import { convertUTCtoLocal } from "@/utility/time-converter/utcToLocal";

interface CounterProposeDialogProps {
	session: ISessionUserDTO | ISessionMentorDTO;
	userId: string;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: (updatedRequest: any) => void; // Callback to update session state
}

// Reusable component for sending counter proposals
export function CounterProposeDialog({ session, userId, isOpen, onOpenChange, onSuccess }: CounterProposeDialogProps) {
	const [rescheduleDate, setRescheduleDate] = useState("");
	const [rescheduleStartTime, setRescheduleStartTime] = useState("");
	const [rescheduleEndTime, setRescheduleEndTime] = useState("");
	const [rescheduleMessage, setRescheduleMessage] = useState("");

	// Calculate end time when start time or session hours change
	useEffect(() => {
		if (rescheduleStartTime && session?.hours) {
			const calculatedEndTime = calculateEndTime(rescheduleStartTime, session.hours);
			setRescheduleEndTime(calculatedEndTime);
		}
	}, [rescheduleStartTime, session?.hours]);

	// Reset form fields
	const resetForm = () => {
		setRescheduleDate("");
		setRescheduleStartTime("");
		setRescheduleEndTime("");
		setRescheduleMessage("");
	};

	// Handle counter proposal submission
	const handleSubmit = async () => {
		if (!session.rescheduleRequest) return;
		try {
			const { startTime, endTime, date } = convertLocaltoUTC(rescheduleStartTime, rescheduleEndTime, rescheduleDate);
			const response = await counterProposeRescheduleAPI(userId, session.id, startTime, endTime, rescheduleMessage, date as Date);
			if (response.success) {
				const localRequest = { ...response.request, ...convertUTCtoLocal(response.request.startTime, response.request.endTime, response.request.date) };
				onSuccess(localRequest);
				toast.success("Counter proposal sent successfully.");
				resetForm();
				onOpenChange(false);
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle>Counter Propose for {session?.topic}</DialogTitle>
					<DialogDescription>Suggest an alternative time for this session.</DialogDescription>
				</DialogHeader>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Reference Schedules */}
					<div className="space-y-4">
						{/* Original Schedule */}
						{session && (
							<div className="bg-gray-50 p-4 rounded-lg">
								<h4 className="font-medium mb-3 text-gray-900">Original Schedule</h4>
								<div className="grid grid-cols-1 gap-4">
									<div className="flex items-center gap-3">
										<Calendar className="w-4 h-4 text-gray-500" />
										<div>
											<p className="text-sm font-medium">Date</p>
											<p className="text-sm text-gray-600">{session.rescheduleRequest?.oldProposal?.proposedDate ? formatDate(session.rescheduleRequest.oldProposal.proposedDate) : "N/A"}</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Clock className="w-4 h-4 text-gray-500" />
										<div>
											<p className="text-sm font-medium">Time</p>
											<p className="text-sm text-gray-600">
												{session.rescheduleRequest?.oldProposal?.proposedStartTime && session.rescheduleRequest?.oldProposal?.proposedEndTime
													? `${formatTime(session.rescheduleRequest.oldProposal.proposedStartTime)} - ${formatTime(session.rescheduleRequest.oldProposal.proposedEndTime)}`
													: "N/A"}
											</p>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Current Proposal */}
						{session?.rescheduleRequest?.currentProposal && (
							<div className="bg-gray-50 p-4 rounded-lg">
								<h4 className="font-medium mb-3 text-gray-900">Current Proposal</h4>
								<div className="grid grid-cols-1 gap-4">
									<div className="flex items-center gap-3">
										<Calendar className="w-4 h-4 text-gray-500" />
										<div>
											<p className="text-sm font-medium">Date</p>
											<p className="text-sm text-gray-600">{session.rescheduleRequest.currentProposal.proposedDate ? formatDate(session.rescheduleRequest.currentProposal.proposedDate) : "N/A"}</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Clock className="w-4 h-4 text-gray-500" />
										<div>
											<p className="text-sm font-medium">Time</p>
											<p className="text-sm text-gray-600">
												{session.rescheduleRequest.currentProposal.proposedStartTime && session.rescheduleRequest.currentProposal.proposedEndTime
													? `${formatTime(session.rescheduleRequest.currentProposal.proposedStartTime)} - ${formatTime(session.rescheduleRequest.currentProposal.proposedEndTime)}`
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
							<Input id="counter-hours" type="number" value={session?.hours || ""} readOnly className="bg-gray-100" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="counter-message">Message</Label>
							<Textarea id="counter-message" placeholder="Add a message with your counter proposal..." value={rescheduleMessage} onChange={(e) => setRescheduleMessage(e.target.value)} />
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={() => handleSubmit()} disabled={!rescheduleDate || !rescheduleStartTime}>
						Send Counter Proposal
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ISessionUserDTO } from "@/interfaces/session.interface";
import { calculateEndTime } from "@/utility/calculate.endTime";
import { requestSessionRescheduleAPI } from "@/api/rescheduling.api.service";
import { formatDate, formatTime } from "@/utility/time-data-formatter";

interface RescheduleDialogProps {
	session: ISessionUserDTO;
	userId: string;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: (updatedRequest: any) => void;
}

// Reusable component for sending reschedule requests
export function RescheduleDialog({ session, userId, isOpen, onOpenChange, onSuccess }: RescheduleDialogProps) {
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

	// Handle reschedule request submission
	const handleSubmit = async () => {
		try {
			const response = await requestSessionRescheduleAPI(session.id, {
				userId,
				date: rescheduleDate,
				startTime: rescheduleStartTime,
				endTime: rescheduleEndTime,
				message: rescheduleMessage,
			});
			if (response.success) {
				onSuccess(response.request); // Update session state with new reschedule request
				toast.success(response.message || "Reschedule request sent successfully.");
				resetForm();
				onOpenChange(false);
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<RefreshCw className="w-4 h-4 mr-2" />
					Request Reschedule
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Request Reschedule</DialogTitle>
					<DialogDescription>Propose a new date and time for this session.</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					{/* Original Session Info */}
					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-4">
							<h3 className="font-medium text-sm">Original Date and Time</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center gap-3">
								<Calendar className="w-4 h-4 text-gray-500" />
								<div>
									<p className="text-sm font-medium">Date</p>
									<p className="text-gray-600 text-sm">{session.date ? formatDate(session.date) : "N/A"}</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Clock className="w-4 h-4 text-gray-500" />
								<div>
									<p className="font-medium text-sm">Time</p>
									<p className="text-gray-600 text-sm">{session.startTime && session.endTime ? `${formatTime(session.startTime)} - ${formatTime(session.endTime)} (${session.hours || 0}h)` : "N/A"}</p>
								</div>
							</div>
						</div>
					</div>
					{/* Reschedule Form */}
					<div className="space-y-2">
						<Label htmlFor="reschedule-date">New Date</Label>
						<Input id="reschedule-date" type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} />
					</div>
					<div className="grid grid-cols-2 gap-2">
						<div className="space-y-2">
							<Label htmlFor="reschedule-start">Start Time</Label>
							<Input id="reschedule-start" type="time" value={rescheduleStartTime} onChange={(e) => setRescheduleStartTime(e.target.value)} />
						</div>
						<div className="space-y-2">
							<Label htmlFor="reschedule-end-time">End Time</Label>
							<Input id="reschedule-end-time" type="time" value={rescheduleEndTime} disabled className="bg-gray-100 cursor-not-allowed" />
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="reschedule-message">Reason</Label>
						<Textarea id="reschedule-message" placeholder="Please explain why you need to reschedule..." value={rescheduleMessage} onChange={(e) => setRescheduleMessage(e.target.value)} />
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSubmit}>Send Request</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

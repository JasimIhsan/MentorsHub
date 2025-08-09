import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ISessionUserDTO } from "@/interfaces/session.interface";
import { calculateEndTime } from "@/utility/calculate.endTime";
import axiosInstance from "@/api/config/api.config";

interface CounterProposeDialogProps {
	session: ISessionUserDTO;
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
			const response = await axiosInstance.post(`/user/sessions/reschedule-counter-proposal`, {
				rescheduleRequestId: session.rescheduleRequest.id,
				proposedDate: rescheduleDate,
				proposedStartTime: rescheduleStartTime,
				proposedEndTime: rescheduleEndTime,
				message: rescheduleMessage,
				userId,
				sessionId: session.id,
			});
			if (response.data.success) {
				onSuccess(response.data.request); // Update session state with new reschedule request
				toast.success("Counter proposal sent successfully.");
				resetForm();
				onOpenChange(false);
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to send counter proposal.");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Counter Propose</DialogTitle>
					<DialogDescription>Suggest an alternative time for this session.</DialogDescription>
				</DialogHeader>
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
							<Input id="counter-end" type="time" value={rescheduleEndTime} disabled className="bg-gray-100 cursor-not-allowed" />
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="counter-message">Message (optional)</Label>
						<Textarea id="counter-message" placeholder="Add a message with your counter proposal..." value={rescheduleMessage} onChange={(e) => setRescheduleMessage(e.target.value)} />
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSubmit}>Send Counter Proposal</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ISessionUserDTO } from "@/interfaces/session.interface";
import { formatDate, formatTime } from "@/utility/time-data-formatter";

interface CancelSessionDialogProps {
	isOpen: boolean;
	onClose: () => void;
	session: ISessionUserDTO | null;
	onConfirm: () => void;
}

export function CancelSessionDialog({ isOpen, onClose, session, onConfirm }: CancelSessionDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Cancel Session</DialogTitle>
					<DialogDescription>
						Are you sure you want to cancel your session with {session ? `${session.mentor.firstName} ${session.mentor.lastName}` : "this mentor"} on {session ? formatDate(session.date) : ""} at {session ? `${formatTime(session.startTime)} - ${formatTime(session.endTime)}` : ""}?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Keep Session
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Cancel Session
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

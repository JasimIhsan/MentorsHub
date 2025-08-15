import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ConfirmationDialogProps {
	isOpen: boolean;
	type: "approve" | "reject" | null;
	requestId: string | null;
	rejectReason: string;
	setConfirmationDialog: React.Dispatch<
		React.SetStateAction<{
			isOpen: boolean;
			type: "approve" | "reject" | null;
			requestId: string | null;
			rejectReason: string;
		}>
	>;
	handleConfirmAction: (requestId: string | null, type: "approve" | "reject" | null, rejectReason: string) => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, type, requestId, rejectReason, setConfirmationDialog, handleConfirmAction }) => {
	return (
		<Dialog open={isOpen} onOpenChange={() => setConfirmationDialog({ isOpen: false, type: null, requestId: null, rejectReason: "" })}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{type === "approve" ? "Confirm Approval" : "Confirm Rejection"}</DialogTitle>
					<DialogDescription>{type === "approve" ? "Are you sure you want to approve this session request?" : "Please provide a reason for rejecting this session request."}</DialogDescription>
				</DialogHeader>
				{type === "reject" && (
					<div className="py-4">
						<Textarea
							placeholder="Enter reason for rejection"
							value={rejectReason}
							onChange={(e) =>
								setConfirmationDialog((prev: { isOpen: boolean; type: "approve" | "reject" | null; requestId: string | null; rejectReason: string }) => ({
									...prev,
									rejectReason: e.target.value,
								}))
							}
							className="w-full"
						/>
					</div>
				)}
				<DialogFooter>
					<Button variant="outline" onClick={() => setConfirmationDialog({ isOpen: false, type: null, requestId: null, rejectReason: "" })}>
						Cancel
					</Button>
					<Button variant={type === "approve" ? "default" : "destructive"} onClick={() => handleConfirmAction(requestId, type, rejectReason)} disabled={type === "reject" && !rejectReason.trim()}>
						{type === "approve" ? "Approve" : "Reject"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

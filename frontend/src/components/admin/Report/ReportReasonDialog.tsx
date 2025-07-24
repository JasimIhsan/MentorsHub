import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ReasonDialogProps {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	reason: string | null;
}

export function ReportReasonDialog({ isOpen, setIsOpen, reason }: ReasonDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Full Report Reason</DialogTitle>
					<DialogDescription>{reason || "No reason selected"}</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

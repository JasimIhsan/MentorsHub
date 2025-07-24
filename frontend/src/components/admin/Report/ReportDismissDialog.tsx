// Dialog for dismissing a report
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DismissDialogProps {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	adminNote: string;
	setAdminNote: (note: string) => void;
	dismissReportId: string | null;
	handleDismissReport: (reportId: string, adminNote: string) => void;
}

export function DismissDialog({ isOpen, setIsOpen, adminNote, setAdminNote, dismissReportId, handleDismissReport }: DismissDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Dismiss Report</DialogTitle>
					<DialogDescription>Please provide a note explaining why this report is being dismissed.</DialogDescription>
				</DialogHeader>
				<Input value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Enter admin note" className="mt-2" />
				<DialogFooter className="mt-4">
					<Button
						variant="outline"
						onClick={() => {
							setIsOpen(false);
							setAdminNote("");
						}}>
						Cancel
					</Button>
					<Button onClick={() => dismissReportId && handleDismissReport(dismissReportId, adminNote)}>Confirm Dismiss</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

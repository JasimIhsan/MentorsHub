import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ValidationErrorModalProps {
	showErrorModal: boolean;
	setShowErrorModal: (open: boolean) => void;
	validationErrors: string[];
}

export function ValidationErrorModal({ showErrorModal, setShowErrorModal, validationErrors }: ValidationErrorModalProps) {
	return (
		<Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Validation Errors</DialogTitle>
					<DialogDescription>Please fix the following issues to submit your application:</DialogDescription>
				</DialogHeader>
				<div className="max-h-[60vh] overflow-y-auto">
					<ul className="list-disc pl-5 space-y-2 text-sm text-red-600">
						{validationErrors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				</div>
				<DialogFooter>
					<Button onClick={() => setShowErrorModal(false)}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

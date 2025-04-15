// src/components/mentor-application/ErrorModal.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface ErrorModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	errors: string[];
}

export function ErrorModal({ open, onOpenChange, errors }: ErrorModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-[90vw] sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Validation Errors</DialogTitle>
					<DialogDescription>Please fix the following issues to submit your application:</DialogDescription>
				</DialogHeader>
				<div className="max-h-[60vh] overflow-y-auto">
					<ul className="list-disc pl-5 space-y-2 text-sm text-red-600">
						{errors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				</div>
				<DialogFooter>
					<Button onClick={() => onOpenChange(false)}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

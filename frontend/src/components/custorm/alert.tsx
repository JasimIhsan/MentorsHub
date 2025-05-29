import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface AlertProps {
	triggerElement: React.ReactNode; // Trigger button or item
	contentTitle: string;
	contentDescription: string;
	actionText: string;
	onConfirm: () => void; // Function to execute on confirmation
}

export const Alert = ({ triggerElement, contentTitle, contentDescription, actionText, onConfirm }: AlertProps) => {
	return (
		<AlertDialog>
			{/* This button triggers the dialog */}
			<AlertDialogTrigger asChild>{triggerElement}</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{contentTitle}</AlertDialogTitle>
					<AlertDialogDescription>{contentDescription}</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					{/* Cancel button closes the alert without doing anything */}
					<AlertDialogCancel>Cancel</AlertDialogCancel>

					{/* This button confirms the action and triggers `onConfirm` */}
					<AlertDialogAction onClick={onConfirm}>{actionText}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

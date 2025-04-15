// src/components/mentor-application/NavigationButtons.tsx
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface NavigationButtonsProps {
	step: number;
	totalSteps: number;
	handleBack: () => void;
	handleNext: () => void;
	isLoading: boolean;
}

export function NavigationButtons({ step, totalSteps, handleBack, handleNext, isLoading }: NavigationButtonsProps) {
	return (
		<div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
			{step > 1 ? (
				<Button variant="outline" onClick={handleBack} className="w-full sm:w-auto gap-2">
					<ArrowLeft className="h-4 w-4" />
					Back
				</Button>
			) : (
				<Button variant="outline" asChild className="w-full sm:w-auto gap-2">
					<Link to="/dashboard">
						<ArrowLeft className="h-4 w-4" />
						Cancel
					</Link>
				</Button>
			)}
			<Button onClick={handleNext} disabled={isLoading} className="w-full sm:w-auto gap-2">
				{isLoading ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						Submitting...
					</>
				) : step < totalSteps ? (
					<>
						Next
						<ArrowRight className="h-4 w-4" />
					</>
				) : (
					<>
						Submit Application
						<ArrowRight className="h-4 w-4" />
					</>
				)}
			</Button>
		</div>
	);
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, BookOpen } from "lucide-react";

export function MentorPageNotFoundPage() {
	return (
		<div className="flex min-h-full items-center justify-center bg-background p-6">
			<div className="text-center space-y-8 max-w-lg mx-auto">
				{/* Animated Icon */}
				<div className="flex justify-center">
					<AlertCircle className="h-24 w-24 text-destructive opacity-80 animate-pulse" />
				</div>

				{/* Heading */}
				<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Oops! Lost in Mentorship</h1>

				{/* Description */}
				<p className="text-lg text-muted-foreground">The mentor page you're seeking seems to have wandered off. Perhaps it's mentoring someone else right now!</p>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button asChild size="lg" className="w-full sm:w-auto">
						<Link to="/mentor">
							<Home className="mr-2 h-4 w-4" />
							Mentor Dashboard
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
						<Link to="/mentor/resources">
							<BookOpen className="mr-2 h-4 w-4" />
							Mentor Resources
						</Link>
					</Button>
				</div>

				{/* Optional Message */}
				<p className="text-sm text-muted-foreground">Need help? Contact our support team for guidance.</p>
			</div>
		</div>
	);
}

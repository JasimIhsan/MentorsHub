// src/pages/NotFoundPage.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, Compass } from "lucide-react";

export default function PageNotFound() {
	return (
		<div className="flex min-h-screen w-screen items-center justify-center bg-background">
			<div className="text-center space-y-8 p-6 max-w-lg mx-auto">
				{/* Icon/Illustration */}
				<div className="flex justify-center">
					<Compass className="h-24 w-24 text-muted-foreground animate-spin-slow" />
				</div>

				{/* Heading */}
				<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Oops! Page Not Found</h1>

				{/* Description */}
				<p className="text-lg text-muted-foreground">It looks like you’ve wandered off the path. The page you’re looking for doesn’t exist or has been moved.</p>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button asChild size="lg" className="w-full sm:w-auto">
						<Link to="/">
							<Home className="mr-2 h-4 w-4" />
							Back to Home
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
						<Link to="/browse">
							<Search className="mr-2 h-4 w-4" />
							Browse Mentors
						</Link>
					</Button>
				</div>

				{/* Optional Fun Element */}
				<p className="text-sm text-muted-foreground italic">"Not all those who wander are lost... but you might be!"</p>
			</div>
		</div>
	);
}

// Optional CSS for animation (add to globals.css or a separate file)

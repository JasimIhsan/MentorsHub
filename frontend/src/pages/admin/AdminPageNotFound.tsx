import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, AlertCircle, Settings } from "lucide-react";

export default function AdminPageNotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<div className="text-center space-y-8 p-6 max-w-lg mx-auto">
				{/* Icon/Illustration */}
				<div className="flex justify-center">
					<AlertCircle className="h-24 w-24 text-destructive opacity-80" />
				</div>

				{/* Heading */}
				<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Page Not Found</h1>

				{/* Description */}
				<p className="text-lg text-muted-foreground">This admin page doesn't exist or you may not have permission to access it.</p>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button asChild size="lg" className="w-full sm:w-auto">
						<Link to="/admin/dashboard">
							<LayoutDashboard className="mr-2 h-4 w-4" />
							Admin Dashboard
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
						<Link to="/admin/settings">
							<Settings className="mr-2 h-4 w-4" />
							Admin Settings
						</Link>
					</Button>
				</div>

				{/* Optional Message */}
				<p className="text-sm text-muted-foreground">If you believe this is an error, please contact the system administrator.</p>
			</div>
		</div>
	);
}

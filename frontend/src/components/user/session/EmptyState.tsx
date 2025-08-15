import React from "react";
import { Search, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // Utility for className concatenation, assuming it exists in the project

interface EmptyStateProps {
	title: string;
	description: string;
	action?: React.ReactNode;
	icon?: LucideIcon;
	className?: string; // Allow custom class for container
}

export function EmptyState({ title, description, action, icon: Icon = Search, className }: EmptyStateProps) {
	return (
		<div
			className={cn("flex flex-col items-center justify-center rounded-lg border border-dashed bg-gradient-to-b from-background to-muted/20 p-8 text-center shadow-sm transition-all duration-300 hover:shadow-md", className)}
			role="alert"
			aria-live="polite">
			<div className="mb-4 rounded-full bg-primary/10 p-3">
				<Icon className="h-12 w-12 text-primary" aria-hidden="true" />
			</div>
			<h3 className="text-xl font-semibold text-foreground">{title}</h3>
			<p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
			{action && (
				<div className="mt-6">
					<div className="transform transition-transform duration-200 hover:scale-105">{action}</div>
				</div>
			)}
		</div>
	);
}

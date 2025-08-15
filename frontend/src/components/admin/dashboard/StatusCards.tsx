import type React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// StatsCard component
export function StatsCard({ title, value, description, trend, percentage, icon: Icon }: { title: string; value: number; description: string; trend: "up" | "down"; percentage: string; icon: React.ElementType }) {
	return (
		<Card>
			<CardContent className="px-6 py-0">
				<div className="flex items-center justify-between">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<Icon className="h-6 w-6 text-primary" />
					</div>
					<div className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
						{trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
						<span>{percentage}</span>
					</div>
				</div>
				<div className="mt-4">
					<h3 className="text-2xl font-bold">{value}</h3>
					<p className="text-sm text-muted-foreground">{title}</p>
				</div>
				<p className="mt-2 text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}

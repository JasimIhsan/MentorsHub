import type React from "react";
import { Users, Calendar, Star, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// PlatformMetrics component
interface Metric {
	id: number;
	title: string;
	value: string;
	icon: React.ElementType;
}

const metrics: Metric[] = [
	{ id: 1, title: "Avg. Session Duration", value: "45 min", icon: Clock },
	{ id: 2, title: "User Retention Rate", value: "78%", icon: Users },
	{ id: 3, title: "Avg. Mentor Rating", value: "4.8", icon: Star },
	{ id: 4, title: "Monthly Active Users", value: "1,892", icon: Calendar },
];

export function PlatformMetrics() {
	return (
		<Card className="lg:col-span-3">
			<CardHeader>
				<CardTitle>Platform Metrics</CardTitle>
				<CardDescription>Key performance indicators</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4 sm:grid-cols-2">
					{metrics.map((metric) => (
						<div key={metric.id} className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<metric.icon className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">{metric.title}</p>
								<p className="text-lg font-semibold">{metric.value}</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

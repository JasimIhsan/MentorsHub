import { Card, CardContent } from "@/components/ui/card";
import { JSX } from "react";

interface StatCardProps {
	icon: JSX.Element;
	label: string;
	count: number;
	bgColor: string;
}

export default function StatCard({ icon, label, count, bgColor }: StatCardProps) {
	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex items-center gap-4">
					<div className={`flex h-10 w-10 items-center justify-center rounded-full ${bgColor}`}>{icon}</div>
					<div>
						<p className="text-sm text-muted-foreground">{label}</p>
						<p className="text-2xl font-bold">{count}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCardSkeleton() {
	return (
		<Card>
			<CardContent className="px-6 py-0 pt-6">
				<div className="flex items-center justify-between">
					<Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
					<Skeleton className="h-4 w-16 bg-gray-200" />
				</div>
				<div className="mt-4">
					<Skeleton className="h-8 w-24 bg-gray-200" />
					<Skeleton className="mt-2 h-4 w-32 bg-gray-200" />
				</div>
				<Skeleton className="mt-2 h-3 w-48 bg-gray-200" />
			</CardContent>
		</Card>
	);
}

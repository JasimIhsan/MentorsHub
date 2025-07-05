import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const BrowseMentorsMentorCardSkeleton = () => (
	<Card className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
		<CardContent className="flex flex-1 flex-col px-6 py-4">
			<div className="flex items-center gap-5">
				<Skeleton className="bg-gray-200 h-16 w-16 rounded-full" />
				<div className="space-y-2">
					<Skeleton className="bg-gray-200 h-5 w-32" />
					<Skeleton className="bg-gray-200 h-4 w-48" />
				</div>
			</div>
			<div className="mt-5 flex flex-wrap gap-2">
				<Skeleton className="bg-gray-200 h-6 w-20 rounded-full" />
				<Skeleton className="bg-gray-200 h-6 w-24 rounded-full" />
				<Skeleton className="bg-gray-200 h-6 w-16 rounded-full" />
			</div>
			<Skeleton className="bg-gray-200 mt-5 h-10 w-full" />
			<div className="mt-5 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Skeleton className="bg-gray-200 h-5 w-5 rounded-full" />
					<Skeleton className="bg-gray-200 h-4 w-12" />
					<Skeleton className="bg-gray-200 h-4 w-8" />
				</div>
				<Skeleton className="bg-gray-200 h-4 w-16" />
			</div>
			<Skeleton className="bg-gray-200 mt-6 h-10 w-full rounded-lg" />
		</CardContent>
	</Card>
);

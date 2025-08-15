import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// QuickLinkCardSkeleton component
export function QuickLinkCardSkeleton() {
	return (
		<Card className="overflow-hidden">
			<CardContent className="px-6 pt-6">
				<div className="flex items-center justify-between">
					<Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
					<Skeleton className="h-5 w-5 bg-gray-200" />
				</div>
				<div className="mt-4">
					<Skeleton className="h-5 w-32 bg-gray-200" />
					<Skeleton className="mt-2 h-4 w-48 bg-gray-200" />
				</div>
			</CardContent>
		</Card>
	);
}

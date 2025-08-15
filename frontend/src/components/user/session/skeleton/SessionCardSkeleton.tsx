import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton component for session cards
export function SessionCardSkeleton() {
	return (
		<Card className="overflow-hidden p-0">
			<CardContent className="p-0">
				<div className="flex flex-col md:flex-row">
					<Skeleton className="bg-gray-200 flex-shrink-0 h-24 w-full md:h-auto md:w-48" />
					<div className="p-6 flex-1">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div>
								<Skeleton className="bg-gray-200 h-6 w-3/4 mb-2" />
								<Skeleton className="bg-gray-200 h-4 w-1/2 mb-4" />
								<div className="flex flex-wrap items-center gap-4">
									<Skeleton className="bg-gray-200 h-4 w-24" />
									<Skeleton className="bg-gray-200 h-4 w-24" />
									<Skeleton className="bg-gray-200 h-4 w-24" />
									<Skeleton className="bg-gray-200 h-4 w-24" />
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Skeleton className="bg-gray-200 h-10 w-24" />
								<Skeleton className="bg-gray-200 h-10 w-10" />
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

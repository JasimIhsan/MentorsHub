import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// PlatformMetricsSkeleton component
export function PlatformMetricsSkeleton() {
	return (
		<Card className="lg:col-span-3">
			<CardHeader>
				<Skeleton className="h-6 w-32 bg-gray-200" />
				<Skeleton className="mt-2 h-4 w-48 bg-gray-200" />
			</CardHeader>
			<CardContent>
				<div className="grid gap-4 sm:grid-cols-2">
					{[...Array(4)].map((_, index) => (
						<div key={index} className="flex items-center gap-3">
							<Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
							<div>
								<Skeleton className="h-4 w-24 bg-gray-200" />
								<Skeleton className="mt-2 h-5 w-16 bg-gray-200" />
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

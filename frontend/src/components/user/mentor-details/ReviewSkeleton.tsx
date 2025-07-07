import { Skeleton } from "@/components/ui/skeleton";

export const ReviewsSkeleton = () => {
	return (
		<div className="space-y-6">
			{/* Review Summary Skeleton */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
				<Skeleton className="bg-gray-200 h-10 w-24" />
				<Skeleton className="bg-gray-200 h-6 w-48" />
			</div>
			<div className="space-y-2">
				{[1, 2, 3, 4, 5].map((star) => (
					<div key={star} className="flex items-center gap-2">
						<Skeleton className="bg-gray-200 h-6 w-16" />
						<Skeleton className="bg-gray-200 h-2 w-full rounded-full" />
						<Skeleton className="bg-gray-200 h-6 w-12" />
					</div>
				))}
			</div>
			<Skeleton className="bg-gray-200 h-10 w-32" />

			{/* Individual Reviews Skeleton */}
			<div className="space-y-6">
				{[1, 2, 3].map((index) => (
					<div key={index} className="border-b border-gray-200 pb-4">
						<div className="flex items-start gap-4">
							<Skeleton className="bg-gray-200 h-10 w-10 rounded-full" />
							<div className="flex-1">
								<div className="flex items-center justify-between">
									<div>
										<Skeleton className="bg-gray-200 h-6 w-32" />
										<Skeleton className="bg-gray-200 h-4 w-24 mt-1" />
									</div>
									<div className="flex items-center gap-1">
										<Skeleton className="bg-gray-200 h-4 w-20" />
									</div>
								</div>
								<Skeleton className="bg-gray-200 h-16 w-full mt-2" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

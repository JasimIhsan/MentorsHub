import { Skeleton } from "@/components/ui/skeleton";

export const MentorDetailsSkeleton = () => {
	return (
		<div className="container py-8 px-10 md:px-20 xl:px-25">
			<div className="flex flex-col gap-8">
				{/* Mentor Header Skeleton */}
				<div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
					<Skeleton className="bg-gray-200 h-32 w-32 rounded-full" />
					<div className="flex flex-1 flex-col gap-4 text-center md:text-left">
						<Skeleton className="bg-gray-200 h-8 w-64" />
						<Skeleton className="bg-gray-200 h-6 w-48" />
						<div className="flex flex-wrap justify-center gap-2 md:justify-start">
							<Skeleton className="bg-gray-200 h-6 w-20" />
							<Skeleton className="bg-gray-200 h-6 w-20" />
							<Skeleton className="bg-gray-200 h-6 w-20" />
						</div>
					</div>
					<div className="flex flex-col gap-3 w-full md:w-40">
						<Skeleton className="bg-gray-200 h-10 w-full" />
						<Skeleton className="bg-gray-200 h-10 w-full" />
					</div>
				</div>

				{/* Tabs Skeleton */}
				<div className="w-full">
					<div className="flex gap-2 mb-6">
						<Skeleton className="bg-gray-200 h-10 w-20" />
						<Skeleton className="bg-gray-200 h-10 w-20" />
						<Skeleton className="bg-gray-200 h-10 w-20" />
						<Skeleton className="bg-gray-200 h-10 w-20" />
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						<div className="md:col-span-2">
							<Skeleton className="bg-gray-200 h-96 w-full" />
						</div>
						<div>
							<Skeleton className="bg-gray-200 h-64 w-full" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

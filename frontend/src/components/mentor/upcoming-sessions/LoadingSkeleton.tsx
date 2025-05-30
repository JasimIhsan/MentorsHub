import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SessionSkeletonProps {
	count?: number; // Number of skeleton cards to display
	className?: string; // Optional Tailwind classes for customization
}

export  function SessionSkeleton({ count = 5, className = "" }: SessionSkeletonProps) {
	return (
		<div className={`space-y-6 ${className}`}>
			{Array.from({ length: count }).map((_, index) => (
				<Card key={index} className="overflow-hidden p-0">
					<CardContent className="p-6">
						<div className="flex flex-col md:flex-row gap-6">
							{/* Left Section: Session Details */}
							<div className="flex-1">
								<div className="flex justify-between items-center">
									<Skeleton className="bg-gray-200 h-7 w-3/4" /> {/* Topic */}
								</div>
								<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="flex items-center gap-2">
										<Skeleton className="bg-gray-200 h-4 w-4" /> {/* Calendar Icon */}
										<Skeleton className="bg-gray-200 h-4 w-24" /> {/* Date */}
									</div>
									<div className="flex items-center gap-2">
										<Skeleton className="bg-gray-200 h-4 w-4" /> {/* Clock Icon */}
										<Skeleton className="bg-gray-200 h-4 w-20" /> {/* Time */}
									</div>
									<div className="flex items-center gap-2">
										<Skeleton className="bg-gray-200 h-4 w-4" /> {/* Video Icon */}
										<Skeleton className="bg-gray-200 h-4 w-16" /> {/* Format */}
									</div>
									<div className="flex items-center gap-2">
										<Skeleton className="bg-gray-200 h-4 w-4" /> {/* Rupee Icon */}
										<Skeleton className="bg-gray-200 h-4 w-14" /> {/* Pricing */}
									</div>
									<div className="flex items-center gap-2">
										<Skeleton className="bg-gray-200 h-4 w-4" /> {/* Message Icon */}
										<Skeleton className="bg-gray-200 h-4 w-18" /> {/* Session Type */}
									</div>
								</div>
							</div>
							{/* Right Section: Actions and Badge */}
							<div className="flex justify-center items-center gap-2">
								<Skeleton className="bg-gray-200 h-6 w-16" /> {/* Status Badge */}
								<Skeleton className="bg-gray-200 h-10 w-32" /> {/* Participants Button */}
								<div className="flex flex-col gap-2">
									<Skeleton className="bg-gray-200 h-10 w-28" /> {/* Start Session Button */}
									<Skeleton className="bg-gray-200 h-10 w-28" /> {/* Mark as Completed Button */}
								</div>
								<Skeleton className="bg-gray-200 h-10 w-10" /> {/* More Options Button */}
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

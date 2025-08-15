import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton loader for a single RequestCard
export const RequestCardSkeleton: React.FC = () => {
	return (
		<Card className="animate-pulse">
			<CardHeader>
				<div className="flex justify-between items-start">
					<div className="flex items-center gap-3">
						<Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-[150px] bg-gray-200" />
							<Skeleton className="h-3 w-[100px] bg-gray-200" />
						</div>
					</div>
					<Skeleton className="h-6 w-[60px] rounded-full bg-gray-200" />
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 gap-1">
					<div className="space-y-1">
						<Skeleton className="bg-gray-200 h-3 w-[60px]" />
						<Skeleton className="bg-gray-200 h-4 w-[200px]" />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<Skeleton className="bg-gray-200 h-3 w-[80px]" />
							<Skeleton className="bg-gray-200 h-3 w-[100px]" />
						</div>
						<div className="space-y-1">
							<Skeleton className="bg-gray-200 h-3 w-[80px]" />
							<Skeleton className="bg-gray-200 h-3 w-[100px]" />
						</div>
					</div>
					<div className="space-y-1">
						<Skeleton className="bg-gray-200 h-3 w-[80px]" />
						<Skeleton className="bg-gray-200 h-3 w-[150px]" />
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<div className="flex items-center gap-2 w-full">
					<Skeleton className="bg-gray-200 h-9 flex-1" />
					<Skeleton className="bg-gray-200 h-9 w-9" />
					<Skeleton className="bg-gray-200 h-9 w-9" />
				</div>
			</CardFooter>
		</Card>
	);
};

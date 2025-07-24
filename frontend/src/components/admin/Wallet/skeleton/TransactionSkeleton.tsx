// Skeleton for transaction card
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TransactionSkeleton() {
	return (
		<Card className="border border-gray-200 py-1">
			<CardContent className="p-4">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="flex items-center space-x-4">
						<Skeleton className="bg-gray-300/60 h-10 w-10 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="bg-gray-300/60 h-4 w-[150px]" />
							<Skeleton className="bg-gray-300/60 h-4 w-[200px]" />
							<Skeleton className="bg-gray-300/60 h-4 w-[100px]" />
							<Skeleton className="bg-gray-300/60 h-4 w-[120px]" />
						</div>
					</div>
					<div className="space-y-2 text-right">
						<Skeleton className="bg-gray-300/60 h-4 w-[80px]" />
						<div className="flex items-center gap-2">
							<Skeleton className="bg-gray-300/60 h-4 w-4 rounded-full" />
							<Skeleton className="bg-gray-300/60 h-4 w-[60px]" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

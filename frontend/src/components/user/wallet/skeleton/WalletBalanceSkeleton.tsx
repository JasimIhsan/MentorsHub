import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for wallet balance loading state
export function WalletBalanceSkeleton() {
	return (
		<Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl lg:col-span-2">
			<CardContent className="p-6 sm:p-8">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="space-y-2">
						<Skeleton className="bg-gray-300/60 h-4 w-[100px]" />
						<Skeleton className="bg-gray-300/60 h-10 w-[200px]" />
					</div>
					<Skeleton className="bg-gray-300/60 h-12 w-12 rounded-full" />
				</div>
			</CardContent>
		</Card>
	);
}

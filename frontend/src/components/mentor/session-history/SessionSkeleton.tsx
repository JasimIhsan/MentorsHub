import { Card, CardContent } from "@/components/ui/card";

export function SessionCardSkeleton() {
	return (
		<Card className="overflow-hidden p-0">
			<CardContent className="p-6">
				<div className="flex flex-col md:flex-row gap-6">
					<div className="flex-1">
						<div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
						<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
							{[...Array(5)].map((_, index) => (
								<div key={index} className="flex items-center gap-2">
									<div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
									<div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
								</div>
							))}
						</div>
						<div className="flex justify-center items-center gap-2">
							<div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
							<div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
							<div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

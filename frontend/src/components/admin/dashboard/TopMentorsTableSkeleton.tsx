import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// TopMentorsTableSkeleton component
export function TopMentorsTableSkeleton() {
	return (
		<Card className="lg:col-span-4">
			<CardHeader>
				<Skeleton className="h-6 w-32 bg-gray-200" />
				<Skeleton className="mt-2 h-4 w-48 bg-gray-200" />
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								<Skeleton className="h-4 w-20 bg-gray-200" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-20 bg-gray-200" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-20 bg-gray-200" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-20 bg-gray-200" />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...Array(5)].map((_, index) => (
							<TableRow key={index}>
								<TableCell>
									<Skeleton className="h-4 w-32 bg-gray-200" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-16 bg-gray-200" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-16 bg-gray-200" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-16 bg-gray-200" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/custom/StarRating";
import { IReviewDTO } from "@/interfaces/review.dto";
import { formatDate } from "@/utility/time-data-formatter";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentReviewsPreviewProps {
	isLoading: boolean;
	reviews: IReviewDTO[];
}

export function RecentReviewsPreview({ isLoading, reviews }: RecentReviewsPreviewProps) {
	if (isLoading) {
		return (
			<div className="space-y-4">
				{[...Array(3)].map((_, index) => (
					<div key={index} className="space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
								<Skeleton className="h-4 w-24 bg-gray-200" />
							</div>
							<Skeleton className="h-3 w-20 bg-gray-200" />
						</div>
						<Skeleton className="h-4 w-32 bg-gray-200" />
						<Skeleton className="h-12 w-full bg-gray-200" />
					</div>
				))}
				<Skeleton className="h-9 w-full bg-gray-200" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{reviews.map((review) => (
				<div key={review.id} className="space-y-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Avatar className="h-8 w-8">
								<AvatarImage src={review.reviewerId.avatar!} alt={review.reviewerId.firstName} />
								<AvatarFallback>{review.reviewerId.firstName.charAt(0)}</AvatarFallback>
							</Avatar>
							<span className="font-medium text-sm">{review.reviewerId.firstName}</span>
						</div>
						<span className="text-xs text-muted-foreground">{formatDate(String(review.createdAt))}</span>
					</div>

					<StarRating rating={review.rating} />

					<p className="text-sm text-muted-foreground">{review.comment}</p>
				</div>
			))}

			<Button variant="outline" className="w-full">
				View All Reviews
			</Button>
		</div>
	);
}

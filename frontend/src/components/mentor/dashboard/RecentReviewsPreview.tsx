import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/custorm/StarRating";

export function RecentReviewsPreview() {
	const reviews = [
		{
			id: "rev-1",
			mentee: {
				name: "David Lee",
				avatar: "/placeholder.svg?height=40&width=40",
				initials: "DL",
			},
			rating: 5,
			comment: "Excellent session! Really helped me understand React hooks in depth.",
			date: "2 days ago",
		},
		{
			id: "rev-2",
			mentee: {
				name: "Sophia Martinez",
				avatar: "/placeholder.svg?height=40&width=40",
				initials: "SM",
			},
			rating: 4,
			comment: "Great advice on my portfolio. Very actionable feedback.",
			date: "1 week ago",
		},
	];

	return (
		<div className="space-y-4">
			{reviews.map((review) => (
				<div key={review.id} className="space-y-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Avatar className="h-8 w-8">
								<AvatarImage src={review.mentee.avatar || "/placeholder.svg"} alt={review.mentee.name} />
								<AvatarFallback>{review.mentee.initials}</AvatarFallback>
							</Avatar>
							<span className="font-medium text-sm">{review.mentee.name}</span>
						</div>
						<span className="text-xs text-muted-foreground">{review.date}</span>
					</div>

					<StarRating rating={review.rating} />

					<p className="text-sm text-muted-foreground">{review.comment}</p>

					<div className="pt-1">
						<Button variant="ghost" size="sm" className="h-7 text-xs">
							Reply to feedback
						</Button>
					</div>
				</div>
			))}

			<Button variant="outline" className="w-full">
				View All Reviews
			</Button>
		</div>
	);
}

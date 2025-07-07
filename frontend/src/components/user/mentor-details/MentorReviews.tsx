import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IMentorDTO } from "@/interfaces/IMentorDTO";
import axiosInstance from "@/api/config/api.config";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ReviewsSkeleton } from "./ReviewSkeleton";
import { ReviewDTO } from "@/pages/mentor/MentorReviewPage";

interface MentorReviewsProps {
	mentorId: string;
	mentor: IMentorDTO;
	reviews: ReviewDTO[];
	setReviews: React.Dispatch<React.SetStateAction<ReviewDTO[]>>;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	selectedRating: number | null;
	setSelectedRating: (rating: number | null) => void;
	setReviewToEdit: (review: ReviewDTO | null) => void;
	setIsModalOpen: (open: boolean) => void;
}

export function MentorReviews({ mentorId, mentor, reviews, setReviews, currentPage, setCurrentPage, selectedRating, setSelectedRating, setReviewToEdit, setIsModalOpen }: MentorReviewsProps) {
	const [reviewsLoading, setReviewsLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(1);
	const user = useSelector((state: RootState) => state.userAuth.user);
	const reviewsPerPage = 5;

	useEffect(() => {
		const fetchReviews = async () => {
			if (!mentorId) return;
			setReviewsLoading(true);
			try {
				const params: { page: number; limit: number; rating?: number } = {
					page: currentPage,
					limit: reviewsPerPage,
				};
				if (selectedRating) {
					params.rating = selectedRating;
				}
				const response = await axiosInstance.get(`/user/reviews/${mentorId}`, { params });
				if (response.data?.reviews) {
					setReviews(response.data.reviews);
					setTotalPages(Math.ceil(response.data.total / reviewsPerPage) || 1);
				}
			} catch (err: any) {
				toast.error(err.response?.data?.message || "Failed to load reviews.");
			} finally {
				setReviewsLoading(false);
			}
		};
		fetchReviews();
	}, [mentorId, currentPage, selectedRating, setReviews]);

	const handleRatingFilter = (rating: number) => {
		if (selectedRating === rating) {
			setSelectedRating(null);
		} else {
			setSelectedRating(rating);
			setCurrentPage(1);
		}
	};

	const handleEditReview = (review: ReviewDTO) => {
		setReviewToEdit(review);
		setIsModalOpen(true);
	};

	const handleDeleteReview = async (reviewId: string) => {
		try {
			const response = await axiosInstance.delete(`/user/reviews/${reviewId}/${mentorId}/${user?.id as string}`);
			if (response.data.success) {
				setReviews((prevReviews) => prevReviews.filter((r) => r.id !== reviewId));
				toast.success("Review deleted successfully!");
			} else {
				toast.error(response.data.message || "Failed to delete review.");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to delete review.");
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl">Reviews</CardTitle>
				<CardDescription>Feedback from mentees about their sessions with {mentor.firstName || "this mentor"}</CardDescription>
			</CardHeader>
			<CardContent>
				{reviewsLoading ? (
					<ReviewsSkeleton />
				) : (
					<>
						<div className="mb-8">
							<div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
								<div className="flex items-center gap-2">
									<span className="text-4xl font-bold">{mentor.averageRating ? mentor.averageRating.toFixed(1) : "N/A"}</span>
									<Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
								</div>
								<div className="mt-2 sm:mt-0">
									<p className="text-sm text-muted-foreground">
										{reviews.length.toLocaleString()} Ratings & {reviews.length.toLocaleString()} Reviews
									</p>
								</div>
							</div>
							<div className="mt-4 space-y-2">
								{[5, 4, 3, 2, 1].map((star) => {
									const count = reviews.filter((review) => review.rating === star).length;
									const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
									return (
										<button key={star} className={`flex items-center gap-2 w-full ${selectedRating === star ? "bg-gray-100" : ""} hover:bg-gray-50 rounded-md p-1 transition-colors`} onClick={() => handleRatingFilter(star)}>
											<span className="w-8 text-sm">{star} ★</span>
											<div className="w-xl h-2 bg-gray-200 rounded-full overflow-hidden">
												<div
													className={`h-full rounded-full ${star === 5 ? "bg-green-500" : star === 4 ? "bg-green-400" : star === 3 ? "bg-yellow-400" : star === 2 ? "bg-orange-400" : "bg-red-400"}`}
													style={{ width: `${percentage}%` }}
												/>
											</div>
											<span className="w-16 text-sm text-right">{count.toLocaleString()}</span>
										</button>
									);
								})}
							</div>
							<Button
								variant="default"
								className="mt-4"
								onClick={() => {
									setReviewToEdit(null);
									setIsModalOpen(true);
								}}>
								Rate Mentor
							</Button>
						</div>
						{reviews.length > 0 ? (
							<div className="space-y-6">
								{reviews.map((review) => (
									<div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
										<div className="flex items-start gap-4">
											<Avatar className="h-10 w-10">
												<AvatarImage src={review.reviewerId.avatar} alt={review.reviewerId.firstName} />
												<AvatarFallback>{review.reviewerId.firstName.charAt(0)}</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<div className="flex items-center justify-between">
													<div>
														<h4 className="font-medium">{`${review.reviewerId.firstName} ${review.reviewerId.lastName}`}</h4>
														<p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
													</div>
													<div className="flex items-center gap-1">
														{[...Array(5)].map((_, i) => (
															<Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
														))}
														{user?.id === review.reviewerId.id && (
															<DropdownMenu>
																<DropdownMenuTrigger asChild>
																	<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
																		<MoreVertical className="h-4 w-4" />
																	</Button>
																</DropdownMenuTrigger>
																<DropdownMenuContent align="end">
																	<DropdownMenuItem onClick={() => handleEditReview(review)}>Edit Review</DropdownMenuItem>
																	<DropdownMenuItem onClick={() => handleDeleteReview(review.id)} className="text-red-600">
																		Delete Review
																	</DropdownMenuItem>
																</DropdownMenuContent>
															</DropdownMenu>
														)}
													</div>
												</div>
												<p className="mt-2 text-sm">{review.comment || "No feedback provided."}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8">
								<Star className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
								<p className="text-muted-foreground">No reviews available at this time.</p>
							</div>
						)}
						{totalPages > 1 && (
							<div className="mt-6 flex justify-center gap-2">
								<Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
									Previous
								</Button>
								<span className="flex items-center">
									Page {currentPage} of {totalPages}
								</span>
								<Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
									Next
								</Button>
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}

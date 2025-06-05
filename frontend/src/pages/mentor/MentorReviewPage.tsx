import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axiosInstance from "@/api/config/api.config";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Reuse ReviewDTO interface from the original code
export interface ReviewerDTO {
	id: string;
	firstName: string;
	lastName: string;
	avatar?: string;
}

export interface ReviewDTO {
	id: string;
	reviewerId: ReviewerDTO;
	mentorId: string;
	sessionId: string;
	rating: number;
	comment: string;
	createdAt: Date;
	updatedAt: Date;
}

export function MentorReviewsPage() {
	const [reviews, setReviews] = useState<ReviewDTO[]>([]);
	const [reviewsLoading, setReviewsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [selectedRating, setSelectedRating] = useState<number | null>(null);
	const reviewsPerPage = 5;
	const user = useSelector((state: RootState) => state.userAuth.user);

	// Fetch reviews for the logged-in mentor
	useEffect(() => {
		const fetchReviews = async () => {
			if (!user?.id) {
				toast.error("User not found.");
				return;
			}
			setReviewsLoading(true);
			try {
				const params: { page: number; limit: number; rating?: number } = {
					page: currentPage,
					limit: reviewsPerPage,
				};
				if (selectedRating) {
					params.rating = selectedRating;
				}
				const response = await axiosInstance.get(`/user/reviews/${user.id}`, { params });
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
	}, [user?.id, currentPage, selectedRating]);

	// Handle page change
	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	// Handle rating filter click
	const handleRatingFilter = (rating: number) => {
		if (selectedRating === rating) {
			setSelectedRating(null);
		} else {
			setSelectedRating(rating);
			setCurrentPage(1);
		}
	};

	// Calculate average rating
	const averageRating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : "N/A";

	if (!user) {
		return (
			<div className=" py-8 px-10 md:px-20 xl:px-25">
				<Card>
					<CardContent className="pt-6 text-center">
						<h2 className="text-xl font-semibold mb-2">Please Log In</h2>
						<p className="text-muted-foreground">You need to be logged in to view your reviews.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="5">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">My Reviews</CardTitle>
					<CardDescription>Feedback from your mentees about their sessions with you</CardDescription>
				</CardHeader>
				<CardContent>
					{reviewsLoading ? (
						<div className="flex items-center justify-center py-8">
							<motion.div className="text-muted-foreground" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
								<Star className="h-8 w-8" />
							</motion.div>
						</div>
					) : (
						<>
							{/* Total Review Progress Section */}
							<div className="mb-8">
								<div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
									<div className="flex items-center gap-2">
										<span className="text-4xl font-bold">{averageRating}</span>
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
							</div>

							{/* Individual Reviews */}
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

							{/* Pagination Controls */}
							{totalPages > 1 && (
								<div className="mt-6 flex justify-center gap-2">
									<Button variant="outline" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
										Previous
									</Button>
									<span className="flex items-center">
										Page {currentPage} of {totalPages}
									</span>
									<Button variant="outline" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
										Next
									</Button>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

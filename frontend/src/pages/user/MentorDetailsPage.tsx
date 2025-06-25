import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MessageSquare, Star, Users, Briefcase, GraduationCap, Award, User, Heart, MoreVertical } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMentor } from "@/hooks/useMentor";
import { motion } from "framer-motion";
import { WeekDay } from "@/interfaces/IMentorDTO";
import { formatTime } from "@/utility/time-data-formatter";
import axiosInstance from "@/api/config/api.config";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Define interface for reviewer
export interface ReviewerDTO {
	id: string;
	firstName: string;
	lastName: string;
	avatar?: string;
}

// Define interface for review
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

// Define interface for modal props
interface MentorReviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	setReviews: React.Dispatch<React.SetStateAction<ReviewDTO[]>>;
	mentor: {
		id: string;
		firstName: string;
		lastName: string;
	};
	reviewToEdit?: ReviewDTO | null;
}

// Mentor Review Modal Component
export function MentorReviewModal({ isOpen, onClose, mentor, setReviews, reviewToEdit }: MentorReviewModalProps) {
	const [rating, setRating] = useState(reviewToEdit?.rating || 0);
	const [hoverRating, setHoverRating] = useState(0);
	const [feedback, setFeedback] = useState(reviewToEdit?.comment || "");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const user = useSelector((state: RootState) => state.userAuth.user);

	// Reset state when modal opens or reviewToEdit changes
	useEffect(() => {
		setRating(reviewToEdit?.rating || 0);
		setFeedback(reviewToEdit?.comment || "");
	}, [reviewToEdit, isOpen]);

	const handleSubmitReview = async () => {
		if (!user?.id || !mentor.id) {
			toast.error("User, session, or mentor not found.");
			return;
		}

		if (rating === 0) {
			toast.error("Please provide a rating.");
			return;
		}

		setIsSubmitting(true);
		try {
			let response;
			if (reviewToEdit) {
				// Update existing review
				response = await axiosInstance.put(`/user/reviews/${reviewToEdit.id}`, {
					reviewerId: user.id,
					mentorId: mentor.id,
					rating,
					comment: feedback,
				});
			} else {
				// Create new review
				response = await axiosInstance.post("/user/reviews/create", {
					reviewerId: user.id,
					mentorId: mentor.id,
					rating,
					comment: feedback,
				});
			}

			if (response.data.success) {
				const review = response.data.review;
				if (reviewToEdit) {
					// Update existing review in state
					setReviews((prevReviews) => prevReviews.map((r) => (r.id === review.id ? { ...review } : r)));
					toast.success("Review updated successfully!");
				} else {
					// Add new review to state
					setReviews((prevReviews) => [{ ...review }, ...prevReviews]);
					toast.success("Review submitted successfully!");
				}
				onClose();
			} else {
				toast.error(response.data.message || "Failed to submit review.");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to submit review.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{reviewToEdit ? "Edit Review" : "Rate Your Mentor"}</DialogTitle>
					<DialogDescription>{reviewToEdit ? `Edit your feedback for your session with ${mentor.firstName} ${mentor.lastName}.` : `Share your feedback for your session with ${mentor.firstName} ${mentor.lastName}.`}</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="flex justify-center gap-1">
						{[1, 2, 3, 4, 5].map((star) => (
							<Star
								key={star}
								className={`h-6 w-6 cursor-pointer ${star <= (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
								onClick={() => setRating(star)}
								onMouseEnter={() => setHoverRating(star)}
								onMouseLeave={() => setHoverRating(0)}
							/>
						))}
					</div>
					<div>
						<label htmlFor="feedback" className="text-sm font-medium">
							Your Feedback
						</label>
						<Textarea id="feedback" placeholder="Share your experience..." value={feedback} onChange={(e) => setFeedback(e.target.value)} className="mt-1" rows={4} />
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button onClick={handleSubmitReview} disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : reviewToEdit ? "Update Review" : "Submit Review"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// Mentor Details Page Component
export function MentorDetailsPage() {
	const [isAvatarOpen, setIsAvatarOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [reviews, setReviews] = useState<ReviewDTO[]>([]);
	const [reviewsLoading, setReviewsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [selectedRating, setSelectedRating] = useState<number | null>(null);
	const [reviewToEdit, setReviewToEdit] = useState<ReviewDTO | null>(null);
	const { mentorId } = useParams<{ mentorId: string }>();
	const { mentor, loading } = useMentor(mentorId as string);
	const user = useSelector((state: RootState) => state.userAuth.user);
	const [_selectedDay, setSelectedDay] = useState<WeekDay>(WeekDay.Monday);
	const reviewsPerPage = 5;

	// Fetch reviews with pagination and optional rating filter
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
	}, [mentorId, currentPage, selectedRating]);

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

	// Handle edit review
	const handleEditReview = (review: ReviewDTO) => {
		setReviewToEdit(review);
		setIsModalOpen(true);
	};

	// Handle delete review
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

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen min-w-full bg-gray-50">
				<div className="text-center flex flex-col gap-2">
					<motion.div className="mx-auto text-muted-foreground" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
						<User className="h-16 w-16" />
					</motion.div>
					<div>
						<h2 className="text-2xl font-semibold text-gray-800">Loading Profile...</h2>
						<p className="text-gray-500">Please wait while we fetch the mentor's profile.</p>
					</div>
				</div>
			</div>
		);
	}

	if (!mentor) {
		return (
			<div className="container py-8 px-10 md:px-20 xl:px-25">
				<Card>
					<CardContent className="pt-6 text-center">
						<User className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
						<h2 className="text-xl font-semibold mb-2">Mentor Not Found</h2>
						<p className="text-muted-foreground">The mentor profile could not be found.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container py-8 px-10 md:px-20 xl:px-25">
			<div className="flex flex-col gap-8">
				{/* Mentor Header */}
				<div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
					<Dialog open={isAvatarOpen} onOpenChange={setIsAvatarOpen}>
						<DialogTrigger asChild>
							<button className="focus:outline-none">
								<Avatar className="h-32 w-32 border-4 border-primary/20 hover:opacity-80 transition-opacity cursor-pointer">
									<AvatarImage src={mentor.avatar ?? ""} alt={`${mentor.firstName || "Mentor"} ${mentor.lastName || ""}`} />
									<AvatarFallback>{mentor.firstName?.charAt(0) || "U"}</AvatarFallback>
								</Avatar>
							</button>
						</DialogTrigger>
						<DialogContent className="max-w-md">
							<img src={mentor.avatar ?? "https://via.placeholder.com/400"} alt={`${mentor.firstName || "Mentor"} ${mentor.lastName || ""}`} className="w-full h-auto rounded-lg" />
						</DialogContent>
					</Dialog>
					<div className="flex flex-1 flex-col gap-4 text-center md:text-left">
						<div>
							<div className="flex flex-col items-center gap-2 md:flex-row md:items-center">
								<h1 className="text-3xl font-bold">
									{mentor.firstName || "Unknown"} {mentor.lastName || "Mentor"}
								</h1>
								<div className="flex items-center">
									<Star className="ml-2 mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
									<span className="font-medium">{mentor.averageRating ?? "N/A"}</span>
								</div>
							</div>
							<p className="text-xl text-muted-foreground">{mentor.professionalTitle || "No title provided"}</p>
						</div>
						<div className="flex flex-wrap justify-center gap-2 md:justify-start">
							{mentor.skills && mentor.skills.length > 0 ? (
								mentor.skills.map((skill: string) => (
									<Badge key={skill} variant="secondary">
										{skill}
									</Badge>
								))
							) : (
								<p className="text-sm text-muted-foreground">No skills listed</p>
							)}
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-3"></div>
					</div>
					<div className="flex flex-col gap-3">
						<Button className="w-full" asChild disabled={!mentor.userId}>
							<Link to={`/request-session/${mentor.userId || ""}`}>Request Session</Link>
						</Button>
						<Button variant="outline" className="w-full">
							<MessageSquare className="mr-2 h-4 w-4" />
							Message
						</Button>
					</div>
				</div>

				{/* Main Content */}
				<Tabs defaultValue="about" className="w-full">
					<TabsList className="w-full justify-start">
						<TabsTrigger value="about">About</TabsTrigger>
						<TabsTrigger value="experience">Experience</TabsTrigger>
						<TabsTrigger value="reviews">Reviews</TabsTrigger>
						<TabsTrigger value="availability">Availability</TabsTrigger>
					</TabsList>

					<TabsContent value="about" className="mt-6">
						<div className="grid gap-6 md:grid-cols-3">
							<div className="md:col-span-2">
								<Card>
									<CardHeader>
										<CardTitle>About Me</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="leading-relaxed">{mentor.bio || "No biography provided."}</p>
										<div className="mt-8 grid gap-6 sm:grid-cols-2">
											<div className="flex items-start gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
													<Award className="h-5 w-5 text-primary" />
												</div>
												<div>
													<h3 className="font-medium">Expertise</h3>
													<p className="text-sm text-muted-foreground">{mentor.skills && mentor.skills.length > 0 ? mentor.skills.join(", ") : "No skills listed"}</p>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
													<Briefcase className="h-5 w-5 text-primary" />
												</div>
												<div>
													<h3 className="font-medium">Experience</h3>
													<p className="text-sm text-muted-foreground">{mentor.yearsExperience ?? "Not specified"}</p>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
													<GraduationCap className="h-5 w-5 text-primary" />
												</div>
												<div>
													<h3 className="font-medium">Education</h3>
													<p className="text-sm text-muted-foreground max-w-2xs">
														{mentor.educations && mentor.educations.length > 0
															? mentor.educations.map((edu) => `${edu.degree || "Unknown"} from ${edu.institution || "Unknown"} (${edu.startYear || "N/A"}-${edu.endYear || "N/A"})`).join(", ")
															: "No education listed"}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
													<Clock className="h-5 w-5 text-primary" />
												</div>
												<div>
													<h3 className="font-medium">Availability</h3>
													{/* <p className="text-sm text-muted-foreground">{mentor.availability?.join(", ") || "Not specified"}</p> */}
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
													<Heart className="h-5 w-5 text-primary" />
												</div>
												<div>
													<h3 className="font-medium">Interests</h3>
													<p className="text-sm text-muted-foreground">{mentor.interests && mentor.interests.length > 0 ? mentor.interests.join(", ") : "No interests listed"}</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
							<div>
								<Card>
									<CardHeader>
										<CardTitle>Session Preferences</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<span className="font-medium">Rate</span>
												<span>{mentor.pricing === "free" ? "Free" : mentor.pricing === "paid" ? `${mentor.hourlyRate || "Contact for details"}/hr` : "Free or Paid"}</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="font-medium">Session Length</span>
												<span>60 minutes</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="font-medium">Session Type</span>
												<div className="flex items-center gap-1">
													<span>{mentor.sessionTypes?.join(", ") || "Not specified"}</span>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span className="font-medium">Format</span>
												<div className="flex items-center gap-1">
													<Users className="h-4 w-4" />
													<span>{mentor.sessionFormat === "one-on-one" ? "One-on-One" : mentor.sessionFormat === "group" ? "Group" : "Not specified"}</span>
												</div>
											</div>
											<div className="pt-4">
												<Button className="w-full" asChild disabled={!mentor.userId}>
													<Link to={`/request-session/${mentor.userId || ""}`}>Request a Session</Link>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="experience" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Professional Experience</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-8">
									{mentor.workExperiences && mentor.workExperiences.length > 0 ? (
										mentor.workExperiences.map(
											(
												work: {
													jobTitle: string;
													company: string;
													startDate: string;
													endDate: string | null;
													currentJob: boolean;
													description: string;
												},
												index: number
											) => (
												<div key={index} className="relative border-l-2 border-muted pl-6">
													<div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ${index === 0 ? "bg-primary" : "bg-muted"}`}></div>
													<div>
														<h3 className="font-bold">{work.jobTitle || "Unknown Position"}</h3>
														<p className="text-sm text-muted-foreground">
															{work.company || "Unknown Company"} • {work.startDate || "N/A"} - {work.endDate || "Present"}
														</p>
														<p className="mt-2">{work.description || "No description provided"}</p>
													</div>
												</div>
											)
										)
									) : (
										<p className="text-muted-foreground">No work experience listed</p>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="reviews" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Reviews</CardTitle>
								<CardDescription>Feedback from mentees about their sessions with {mentor.firstName || "this mentor"}</CardDescription>
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
												variant="outline"
												className="mt-4"
												onClick={() => {
													setReviewToEdit(null);
													setIsModalOpen(true);
												}}>
												Rate Mentor
											</Button>
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
					</TabsContent>

					<TabsContent value="availability" className="mt-6">
						<div>
							<Card className="w-full shadow-lg">
								<CardHeader>
									<CardTitle className="text-2xl font-bold text-gray-800">Available Time Slots</CardTitle>
									<CardDescription className="text-gray-600">View the mentor's available times for sessions</CardDescription>
								</CardHeader>
								<CardContent>
									<Tabs defaultValue={WeekDay.Monday} onValueChange={(value) => setSelectedDay(value as WeekDay)}>
										<TabsList className="grid w-full grid-cols-7 gap-2 mb-6">
											{Object.values(WeekDay).map((day) => (
												<TabsTrigger key={day} value={day} className="text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-indigo-100 relative">
													{day.slice(0, 3)}
													{mentor.availability[day]?.length > 0 && <span className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full" />}
												</TabsTrigger>
											))}
										</TabsList>
										{Object.entries(mentor.availability).map(([day, times]) => (
											<TabsContent key={day} value={day} className="min-h-[150px]">
												<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
													{times.length > 0 ? (
														times.map((time, _index) => (
															<div key={`${day}-${time}`} className="flex items-center justify-start gap-2 px-4 py-2 border border-gray-200 rounded-md bg-gray-50">
																<Clock className="h-4 w-4 text-primary" />
																<span className="text-sm font-medium">{formatTime(time)}</span>
															</div>
														))
													) : (
														<p className="col-span-2 sm:col-span-3 text-gray-500 italic">No availability on {day}</p>
													)}
												</div>
											</TabsContent>
										))}
									</Tabs>
									<div className="mt-8">
										<Button className="w-full" asChild disabled={!mentor.userId}>
											<Link to={`/request-session/${mentor.userId}`}>Request Session</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>

				<MentorReviewModal
					isOpen={isModalOpen}
					onClose={() => {
						setIsModalOpen(false);
						setReviewToEdit(null);
					}}
					mentor={{ id: mentor.id, firstName: mentor.firstName, lastName: mentor.lastName }}
					setReviews={setReviews}
					reviewToEdit={reviewToEdit}
				/>
			</div>
		</div>
	);
}

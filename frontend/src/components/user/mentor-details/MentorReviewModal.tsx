import axiosInstance from "@/api/config/api.config";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/store/store";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { IReviewDTO } from "@/interfaces/review.interface";

// Define interface for modal props
interface MentorReviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	setReviews: React.Dispatch<React.SetStateAction<IReviewDTO[]>>;
	mentor: {
		id: string;
		firstName: string;
		lastName: string;
	};
	reviewToEdit?: IReviewDTO | null;
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
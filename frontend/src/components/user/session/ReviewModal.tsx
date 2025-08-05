import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/api/config/api.config";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ISessionUserDTO } from "@/interfaces/session.interface";
import { formatDate, formatTime } from "@/utility/time-data-formatter";

export function ReviewModal({ isOpen, onClose, session }: { isOpen: boolean; onClose: () => void; session: ISessionUserDTO }) {
	const [rating, setRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);
	const [feedback, setFeedback] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const user = useSelector((state: RootState) => state.userAuth.user);

	// Submit review
	const handleSubmitReview = async () => {
		if (!user?.id || !session.id) {
			toast.error("User or session not found.");
			return;
		}
		if (rating === 0) {
			toast.error("Please provide a rating.");
			return;
		}
		setIsSubmitting(true);
		try {
			const response = await axiosInstance.post("/user/reviews/create", {
				reviewerId: user.id,
				sessionId: session.id,
				mentorId: session.mentor._id,
				rating,
				comment: feedback,
			});
			if (response.data.success) {
				toast.success("Review submitted!");
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
					<DialogTitle>Leave a Review</DialogTitle>
					<DialogDescription>
						Share feedback for your session with {session.mentor.firstName} {session.mentor.lastName} on {formatDate(session.date)} at `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="flex justify-center gap-1">
						{[1, 2, 3, 4, 5].map((star) => (
							<Star
								key={star}
								className={`h-9 w-9 cursor-pointer ${star <= (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
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
						{isSubmitting ? "Submitting..." : "Submit Review"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

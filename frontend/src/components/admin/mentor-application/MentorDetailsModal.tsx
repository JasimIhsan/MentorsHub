import { memo } from "react";
import { IMentorDTO } from "@/interfaces/mentor.interface";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/custom/alert";

interface MentorDetailsModalProps {
	mentor: IMentorDTO;
	onClose: () => void;
	updateMentorStatus: (userId: string, status: "approved" | "rejected", rejectionReason?: string) => void;
}

export const MentorDetailsModal = memo(function MentorDetailsModal({ mentor, onClose, updateMentorStatus }: MentorDetailsModalProps) {
	const [rejectionReason, setRejectionReason] = useState("");
	const [isRejecting, setIsRejecting] = useState(false);

	// Generate initials for AvatarFallback from fullName
	const getInitials = (fullName: string) => {
		if (!fullName) return "N/A";
		const names = fullName.trim().split(" ");
		return names
			.map((name) => name.charAt(0))
			.slice(0, 2)
			.join("")
			.toUpperCase();
	};

	// Format dates for display
	const formatDate = (date: Date | string | null | undefined) => {
		if (!date) return "N/A";
		const d = date instanceof Date ? date : new Date(date);
		return d.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleApprove = () => {
		updateMentorStatus(mentor.userId, "approved");
		onClose();
	};

	const handleReject = () => {
		if (isRejecting && !rejectionReason.trim()) {
			toast.error("Please provide a rejection reason.");
			return;
		}
		updateMentorStatus(mentor.userId, "rejected", rejectionReason.trim() || undefined);
		onClose();
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-lg md:max-w-4xl">
				<DialogHeader>
					<DialogTitle className="text-2xl font-semibold">Mentor Application Details</DialogTitle>
				</DialogHeader>
				<div className="space-y-8 py-6">
					{/* Header: Avatar and Personal Info */}
					<div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 bg-muted/50 p-6 rounded-lg">
						<Avatar className="h-20 w-20">
							<AvatarImage src={mentor.avatar ?? undefined} alt={mentor.firstName || "Mentor"} className="object-cover" />
							<AvatarFallback className="text-xl font-medium bg-primary/10">{getInitials(mentor.firstName)}</AvatarFallback>
						</Avatar>
						<div className="text-center sm:text-left">
							<h2 className="text-xl font-bold text-foreground">{`${mentor.firstName} ${mentor.lastName}` || "N/A"}</h2>
							<div className="mt-2 space-y-1">
								<p className="text-sm text-muted-foreground">
									<span className="font-medium">Email: </span>
									{mentor.email || "N/A"}
								</p>
							</div>
						</div>
					</div>

					{/* Main Content: Grid Layout */}
					<div className="grid gap-8 md:grid-cols-3">
						{/* Application Information */}
						{/* <div className="space-y-4">
							<h3 className="text-lg font-medium text-foreground border-b pb-2">Application Information</h3>
							<div className="space-y-3">
								<div>
									<Label className="text-sm font-medium text-muted-foreground">Status</Label>
									<p className="text-foreground capitalize">{mentor.mentorRequestStatus || "N/A"}</p>
								</div>
								{mentor.mentorRequestStatus === "rejected" && mentor.rejectionReason && (
									<div>
										<Label className="text-sm font-medium text-muted-foreground">Rejection Reason</Label>
										<p className="text-foreground">{mentor.rejectionReason}</p>
									</div>
								)}
							</div>
						</div> */}

						{/* Profile Details */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium text-foreground border-b pb-2">Profile Details</h3>
							<div className="space-y-3">
								{mentor.bio && (
									<div>
										<Label className="text-sm font-medium text-muted-foreground">Bio</Label>
										<p className="text-foreground">{mentor.bio}</p>
									</div>
								)}
								{mentor.skills && mentor.skills.length > 0 && (
									<div>
										<Label className="text-sm font-medium text-muted-foreground">Skills</Label>
										<p className="text-foreground">{mentor.skills.join(", ") || "N/A"}</p>
									</div>
								)}
								{mentor.interests && mentor.interests.length > 0 && (
									<div>
										<Label className="text-sm font-medium text-muted-foreground">Interests</Label>
										<p className="text-foreground">{mentor.interests.join(", ") || "N/A"}</p>
									</div>
								)}
							</div>
						</div>

						{/* Application Metadata */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium text-foreground border-b pb-2">Application Metadata</h3>
							<div className="space-y-3">
								<div>
									<Label className="text-sm font-medium text-muted-foreground">Created At</Label>
									<p className="text-foreground">{formatDate(mentor.createdAt)}</p>
								</div>
								<div>
									<Label className="text-sm font-medium text-muted-foreground">Updated At</Label>
									<p className="text-foreground">{formatDate(mentor.updatedAt)}</p>
								</div>
							</div>
						</div>

						{/* Badges */}
						{mentor.badges && mentor.badges.length > 0 && (
							<div className="space-y-4">
								<h3 className="text-lg font-medium text-foreground border-b pb-2">Badges</h3>
								<div className="flex flex-wrap gap-2">
									{mentor.badges.map((badge, index) => (
										<Badge key={index} variant="secondary" className="text-sm">
											{badge}
										</Badge>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Rejection Reason Input (shown when rejecting) */}
					{mentor.mentorRequestStatus === "pending" && isRejecting && (
						<div className="space-y-2">
							<Label htmlFor="rejectionReason" className="text-sm font-medium text-muted-foreground">
								Rejection Reason
							</Label>
							<Input id="rejectionReason" placeholder="Enter reason for rejection..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
						</div>
					)}
				</div>

				{/* Footer: Action Buttons */}
				<DialogFooter className="mt-6">
					{mentor.mentorRequestStatus === "pending" && (
						<>
							<Alert
								triggerElement={
									<Button variant="default" disabled={isRejecting} aria-label="Approve mentor application">
										Approve
									</Button>
								}
								contentTitle="Confirm Approval"
								contentDescription={`Are you sure you want to approve ${mentor.firstName || "this mentor"}'s application? This action will grant them mentor status.`}
								actionText="Approve"
								onConfirm={handleApprove}
							/>

							{isRejecting ? (
								<Alert
									triggerElement={
										<Button variant="destructive" disabled={!rejectionReason.trim()} aria-label="Confirm rejection">
											Confirm Rejection
										</Button>
									}
									contentTitle="Confirm Rejection"
									contentDescription={`Are you sure you want to reject ${mentor.firstName || "this mentor"}'s application? This action cannot be undone.`}
									actionText="Reject"
									onConfirm={handleReject}
								/>
							) : (
								<Button variant="destructive" onClick={() => setIsRejecting(true)} aria-label="Reject mentor application">
									Reject
								</Button>
							)}
						</>
					)}
					<DialogClose asChild>
						<Button variant="outline" onClick={onClose} aria-label="Close modal">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
});

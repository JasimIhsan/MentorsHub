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
			month: "short",
			day: "numeric",
		});
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-lg md:max-w-5xl max-h-[90vh] overflow-y-auto">
				<DialogHeader className="py-3">
					<DialogTitle className="text-xl font-semibold">Mentor Application Details</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-4">
					{/* Header: Avatar and Personal Info */}
					<div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 bg-muted/50 p-4 rounded-lg">
						<Avatar className="h-16 w-16">
							<AvatarImage src={mentor.avatar ?? undefined} alt={mentor.firstName || "Mentor"} className="object-cover" />
							<AvatarFallback className="text-lg font-medium bg-primary/10">{getInitials(`${mentor.firstName} ${mentor.lastName}`)}</AvatarFallback>
						</Avatar>
						<div className="text-center sm:text-left">
							<h2 className="text-lg font-bold text-foreground">{`${mentor.firstName} ${mentor.lastName}` || "N/A"}</h2>
							<div className="mt-1 space-y-1">
								<p className="text-xs text-muted-foreground">
									<span className="font-medium">Email: </span>
									{mentor.email || "N/A"}
								</p>
								<p className="text-xs text-muted-foreground">
									<span className="font-medium">Professional Title: </span>
									{mentor.professionalTitle || "N/A"}
								</p>
							</div>
						</div>
					</div>

					{/* Main Content: Grid Layout */}
					<div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
						{/* Application Information */}
						<div className="space-y-2">
							<h3 className="text-base font-medium text-foreground border-b pb-1">Application Information</h3>
							<div className="space-y-2">
								<div>
									<Label className="text-xs font-medium text-muted-foreground">Status</Label>
									<p className="text-sm text-foreground capitalize">{mentor.mentorRequestStatus || "N/A"}</p>
								</div>
								<div>
									<Label className="text-xs font-medium text-muted-foreground">Pricing</Label>
									<p className="text-sm text-foreground capitalize">{mentor.pricing || "N/A"}</p>
								</div>
								<div>
									<Label className="text-xs font-medium text-muted-foreground">Hourly Rate</Label>
									<p className="text-sm text-foreground">₹ {mentor.hourlyRate || "N/A"}/-</p>
								</div>
								<div>
									<Label className="text-xs font-medium text-muted-foreground">Session Format</Label>
									<p className="text-sm text-foreground capitalize">{mentor.sessionFormat || "N/A"}</p>
								</div>
							</div>
						</div>

						{/* Profile Details */}
						<div className="space-y-2">
							<h3 className="text-base font-medium text-foreground border-b pb-1">Profile Details</h3>
							<div className="space-y-2">
								<div>
									<Label className="text-xs font-medium text-muted-foreground">Bio</Label>
									<p className="text-sm text-foreground">{mentor.bio || "N/A"}</p>
								</div>
								<div>
									<Label className="text-xs font-medium text-muted-foreground">Primary Expertise</Label>
									<p className="text-sm text-foreground capitalize">{mentor.primaryExpertise || "N/A"}</p>
								</div>
								<div>
									<Label className="text-xs font-medium text-muted-foreground">Skills</Label>
									<p className="text-sm text-foreground">{mentor.skills?.join(", ") || "N/A"}</p>
								</div>
								<div>
									<Label className="text-xs font-medium text-muted-foreground">Interests</Label>
									<p className="text-sm text-foreground">{mentor.interests?.join(", ") || "N/A"}</p>
								</div>
								<div>
									<Label className="text-xs font-medium text-muted-foreground">Languages</Label>
									<p className="text-sm text-foreground">{mentor.languages?.join(", ") || "N/A"}</p>
								</div>
								<div>
									<Label className="text-xs font-medium text-muted-foreground">Years of Experience</Label>
									<p className="text-sm text-foreground">{mentor.yearsExperience || "N/A"}</p>
								</div>
							</div>
						</div>

						{/* Education */}
						<div className="space-y-2">
							<h3 className="text-base font-medium text-foreground border-b pb-1">Education</h3>
							{mentor.educations && mentor.educations.length > 0 ? (
								mentor.educations.map((edu, index) => (
									<div key={index} className="space-y-1">
										<p className="text-sm text-foreground font-medium">
											{edu.degree || "N/A"} - {edu.institution || "N/A"}
										</p>
										<p className="text-xs text-muted-foreground">
											({edu.startYear || "N/A"} - {edu.endYear || "Present"})
										</p>
									</div>
								))
							) : (
								<p className="text-sm text-foreground">No education details provided</p>
							)}
						</div>

						{/* Work Experience */}
						<div className="space-y-2">
							<h3 className="text-base font-medium text-foreground border-b pb-1">Work Experience</h3>
							{mentor.workExperiences && mentor.workExperiences.length > 0 ? (
								mentor.workExperiences.map((exp, index) => (
									<div key={index} className="space-y-1">
										<p className="text-sm text-foreground font-medium">
											{exp.jobTitle || "N/A"} at {exp.company || "N/A"}
										</p>
										<p className="text-xs text-muted-foreground">
											{exp.startDate || "N/A"} - {exp.endDate || "Present"}
										</p>
										<p className="text-xs text-foreground">{exp.description || "No description provided"}</p>
									</div>
								))
							) : (
								<p className="text-sm text-foreground">No work experience provided</p>
							)}
						</div>

						{/* Certifications */}
						<div className="space-y-2">
							<h3 className="text-base font-medium text-foreground border-b pb-1">Certifications</h3>
							{mentor.certifications && mentor.certifications.length > 0 ? (
								mentor.certifications.map((cert, index) => (
									<div key={index} className="space-y-1">
										<p className="text-sm text-foreground font-medium">
											{cert.name || "N/A"} - {cert.issuingOrg || "N/A"}
										</p>
										<p className="text-xs text-muted-foreground">Issued: {cert.issueDate || "N/A"}</p>
									</div>
								))
							) : (
								<p className="text-sm text-foreground">No certifications provided</p>
							)}
						</div>

						{/* Application Metadata */}
						<div className="space-y-2">
							<h3 className="text-base font-medium text-foreground border-b pb-1">Application Metadata</h3>
							<div className="space-y-2">
								<div>
									<Label className="text-xs font-medium text-muted-foreground">Created At</Label>
									<p className="text-sm text-foreground">{formatDate(mentor.createdAt)}</p>
								</div>
								<div>
									<Label className="text-xs font-medium text-muted-foreground">Updated At</Label>
									<p className="text-sm text-foreground">{formatDate(mentor.updatedAt)}</p>
								</div>
								<div>
									<Label className="text-xs font-medium text-muted-foreground">Sessions Completed</Label>
									<p className="text-sm text-foreground">{mentor.sessionCompleted || 0}</p>
								</div>
								<div>
									<Label className="text-xs font-medium text-muted-foreground">Average Rating</Label>
									<p className="text-sm text-foreground">
										{mentor.averageRating || 0} ({mentor.totalReviews || 0} reviews)
									</p>
								</div>
							</div>
						</div>

						{/* Badges */}
						{mentor.badges && mentor.badges.length > 0 && (
							<div className="space-y-2">
								<h3 className="text-base font-medium text-foreground border-b pb-1">Badges</h3>
								<div className="flex flex-wrap gap-2">
									{mentor.badges.map((badge, index) => (
										<Badge key={index} variant="secondary" className="text-xs">
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
							<Label htmlFor="rejectionReason" className="text-xs font-medium text-muted-foreground">
								Rejection Reason
							</Label>
							<Input id="rejectionReason" placeholder="Enter reason for rejection..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="text-sm" />
						</div>
					)}
				</div>

				{/* Footer: Action Buttons */}
				<DialogFooter className="mt-4">
					{mentor.mentorRequestStatus === "pending" && (
						<>
							<Alert
								triggerElement={
									<Button variant="default" disabled={isRejecting} aria-label="Approve mentor application" size="sm">
										Approve
									</Button>
								}
								contentTitle="Confirm Approval"
								contentDescription={`Are you sure you want to approve ${mentor.firstName || "this mentor"}'s application? This action will grant them mentor status.`}
								actionText="Approve"
								onConfirm={() => {
									updateMentorStatus(mentor.userId, "approved");
									onClose();
								}}
							/>
							{isRejecting ? (
								<Alert
									triggerElement={
										<Button variant="destructive" disabled={!rejectionReason.trim()} aria-label="Confirm rejection" size="sm">
											Confirm Rejection
										</Button>
									}
									contentTitle="Confirm Rejection"
									contentDescription={`Are you sure you want to reject ${mentor.firstName || "this mentor"}'s application? This action cannot be undone.`}
									actionText="Reject"
									onConfirm={() => {
										if (!rejectionReason.trim()) {
											toast.error("Please provide a rejection reason.");
											return;
										}
										updateMentorStatus(mentor.userId, "rejected", rejectionReason.trim());
										onClose();
									}}
								/>
							) : (
								<Button variant="destructive" onClick={() => setIsRejecting(true)} aria-label="Reject mentor application" size="sm">
									Reject
								</Button>
							)}
						</>
					)}
					<DialogClose asChild>
						<Button variant="outline" onClick={onClose} aria-label="Close modal" size="sm">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
});

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, IndianRupee } from "lucide-react";
import { ISessionUserDTO, ISessionMentorDTO } from "@/interfaces/session.interface";
import { formatDate, formatTime } from "@/utility/time-data-formatter";

interface SessionDetailsModalProps {
	session: ISessionUserDTO | ISessionMentorDTO;
	onClose: () => void;
}

export function SessionDetailsModal({ session, onClose }: SessionDetailsModalProps) {
	const isMentorSession = "participants" in session;
	const mentor = isMentorSession ? { firstName: "Mentor", lastName: "", avatar: "" } : session.mentor;

	// Generate initials for AvatarFallback
	const getInitials = (firstName: string, lastName: string) => {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-lg md:max-w-4xl">
				<DialogHeader>
					<DialogTitle className="text-2xl font-semibold">Session Details</DialogTitle>
				</DialogHeader>
				<div className="space-y-8 py-6">
					{/* Header: Session Topic and Mentor Info */}
					<div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 bg-muted/50 p-6 rounded-lg">
						<Avatar className="h-20 w-20">
							<AvatarImage src={mentor.avatar} alt={`${mentor.firstName} ${mentor.lastName}`} className="object-cover" />
							<AvatarFallback className="text-xl font-medium bg-primary/10">{getInitials(mentor.firstName, mentor.lastName)}</AvatarFallback>
						</Avatar>
						<div className="text-center sm:text-left">
							<h2 className="text-xl font-bold text-foreground">{session.topic}</h2>
							<div className="mt-2 space-y-1">
								<p className="text-sm text-muted-foreground">
									<span className="font-medium">Mentor: </span>
									{`${mentor.firstName} ${mentor.lastName}`}
								</p>
								<p className="text-sm text-muted-foreground">
									<span className="font-medium">Format: </span>
									{session.sessionFormat === "one-on-one" ? "One-on-One" : "Group"}
								</p>
							</div>
						</div>
					</div>

					{/* Main Content: Grid Layout */}
					<div className="grid gap-8 md:grid-cols-3">
						{/* Session Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium text-foreground border-b pb-2">Session Information</h3>
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<CalendarDays className="h-4 w-4 text-muted-foreground" />
									<div>
										<Label className="text-sm font-medium text-muted-foreground">Date</Label>
										<p className="text-foreground">{formatDate(session.date)}</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<div>
										<Label className="text-sm font-medium text-muted-foreground">Time</Label>
										<p className="text-foreground">
											{`${formatTime(session.startTime)} - ${formatTime(session.endTime)}`} ({session.hours} hours)
										</p>
									</div>
								</div>
								
							</div>
						</div>

						{/* Payment Details */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium text-foreground border-b pb-2">Payment Details</h3>
							<div className="space-y-3">
								<div>
									<Label className="text-sm font-medium text-muted-foreground">Pricing</Label>
									<p className="text-foreground flex items-center gap-1">
										<IndianRupee className="h-4 w-4" />
										{session.pricing === "free" ? "Free" : `${session.totalAmount?.toFixed(2) || 0}`}
									</p>
								</div>
								<div>
									<Label className="text-sm font-medium text-muted-foreground">Payment Status</Label>
									<p className="text-foreground capitalize">{session.paymentStatus || "N/A"}</p>
								</div>
								{session.paymentId && (
									<div>
										<Label className="text-sm font-medium text-muted-foreground">Payment ID</Label>
										<p className="text-foreground">{session.paymentId}</p>
									</div>
								)}
							</div>
						</div>

						{/* Session Metadata */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium text-foreground border-b pb-2">Session Metadata</h3>
							<div className="space-y-3">
								<div>
									<Label className="text-sm font-medium text-muted-foreground">Status</Label>
									<Badge variant={session.status === "completed" ? "outline" : "default"} className={`capitalize ${session.status === "completed" ? "bg-primary/5 text-primary" : "bg-primary text-primary-foreground"}`}>
										{session.status}
									</Badge>
								</div>
								<div>
									<Label className="text-sm font-medium text-muted-foreground">Created At</Label>
									<p className="text-foreground">{formatDate(session.createdAt)}</p>
								</div>
								{session.rejectReason && (
									<div>
										<Label className="text-sm font-medium text-muted-foreground">Reject Reason</Label>
										<p className="text-foreground">{session.rejectReason}</p>
									</div>
								)}
							</div>
						</div>

						{/* Participants (Mentor Perspective Only) */}
						{isMentorSession && (session as ISessionMentorDTO).participants.length > 0 && (
							<div className="space-y-4">
								<h3 className="text-lg font-medium text-foreground border-b pb-2">Participants</h3>
								<div className="space-y-3">
									{(session as ISessionMentorDTO).participants.map((participant) => (
										<div key={participant._id} className="flex items-center gap-3">
											<Avatar className="h-10 w-10">
												<AvatarImage src={participant.avatar} alt={`${participant.firstName} ${participant.lastName}`} />
												<AvatarFallback>{getInitials(participant.firstName, participant.lastName)}</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium">{`${participant.firstName} ${participant.lastName}`}</p>
												<p className="text-sm text-muted-foreground">Payment: {participant.paymentStatus || "N/A"}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Message */}
						{session.message && (
							<div className="space-y-4">
								<h3 className="text-lg font-medium text-foreground border-b pb-2">Message</h3>
								<p className="text-foreground">{session.message}</p>
							</div>
						)}
					</div>
				</div>
				<DialogFooter className="mt-6">
					<DialogClose asChild>
						<Button variant="default" onClick={onClose}>
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

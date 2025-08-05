import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { ISessionMentorDTO } from "@/interfaces/session.interface";
import { formatDate, formatTime } from "@/utility/time-data-formatter";

interface RequestDetailsDialogProps {
	selectedRequest: ISessionMentorDTO | null;
	status: string;
	setSelectedRequest: (request: ISessionMentorDTO | null) => void;
	handleApprove: (requestId: string) => void;
	handleReject: (requestId: string) => void;
}

export const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({ selectedRequest, status, setSelectedRequest, handleApprove, handleReject }) => {
	return (
		<Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-2xl">Session Request Details</DialogTitle>
					<DialogDescription>Review the details of this session request below</DialogDescription>
				</DialogHeader>

				{selectedRequest && (
					<div className="space-y-2">
						<div className="flex items-center gap-4 border-b pb-3">
							<Avatar className="h-14 w-14">
								<AvatarImage src={selectedRequest.participants[0].avatar ?? "/placeholder.svg"} alt={`${selectedRequest.participants[0].firstName} ${selectedRequest.participants[0].lastName}`} />
							</Avatar>
							<div>
								<h3 className="text-lg font-semibold">{`${selectedRequest.participants[0].firstName} ${selectedRequest.participants[0].lastName}`}</h3>
								<p className="text-sm text-muted-foreground">{selectedRequest.sessionFormat}</p>
							</div>
						</div>

						<div className="space-y-2">
							<h4 className="text-md font-semibold text-foreground">Session Details</h4>
							<div className="grid grid-cols-1 gap-1">
								<div>
									<span className="text-sm font-medium text-muted-foreground">Topic</span>
									<p className="text-sm">{selectedRequest.topic}</p>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<span className="text-sm font-medium text-muted-foreground">Session Format</span>
										<p className="text-sm">{selectedRequest.sessionFormat}</p>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<span className="text-sm font-medium text-muted-foreground">Date & Time</span>
										<p className="text-sm">
											{formatDate(selectedRequest.date)} - {`${formatTime(selectedRequest.startTime)} - ${formatTime(selectedRequest.endTime)}`}
										</p>
									</div>
									<div>
										<span className="text-sm font-medium text-muted-foreground">Duration</span>
										<p className="text-sm">{`${selectedRequest.hours} hour${selectedRequest.hours > 1 ? "s" : ""}`}</p>
									</div>
								</div>
								<div>
									<span className="text-sm font-medium text-muted-foreground">Message</span>
									<p className="text-sm text-foreground">{selectedRequest.message}</p>
								</div>
							</div>
						</div>

						<div className="space-y-2 border-t pt-2">
							<h4 className="text-md font-semibold text-foreground">Payment Details</h4>
							<div className="grid grid-cols-1 gap-2">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<span className="text-sm font-medium text-muted-foreground">Pricing</span>
										<p className="text-sm">{selectedRequest.pricing}</p>
									</div>
									<div>
										<span className="text-sm font-medium text-muted-foreground">Total Amount</span>
										<p className="text-sm">₹ {selectedRequest.totalAmount} /-</p>
									</div>
								</div>
								<div>
									<span className="text-sm font-medium text-muted-foreground">Payment Status</span>
									<p className="text-sm">{selectedRequest.participants[0].paymentStatus}</p>
								</div>
							</div>
						</div>
					</div>
				)}

				<DialogFooter className="mt-6">
					{status === "pending" ? (
						<div className="flex w-full gap-2 justify-end">
							<Button variant="destructive" size="sm" onClick={() => handleReject(selectedRequest?.id as string)}>
								<X className="h-4 w-4 mr-1" />
								Reject
							</Button>
							<Button size="sm" onClick={() => handleApprove(selectedRequest?.id as string)}>
								<Check className="h-4 w-4 mr-1" />
								Approve
							</Button>
						</div>
					) : (
						<Button onClick={() => setSelectedRequest(null)}>Close</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

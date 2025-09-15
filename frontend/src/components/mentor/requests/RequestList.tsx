import { useCallback, useState } from "react";
import { Calendar } from "lucide-react";
import { RequestCard } from "./RequestCard";
import { RequestDetailsDialog } from "./RequestDetailsDailog"; // Fixed typo
import { ConfirmationDialog } from "./ConfirmationDialog";
import { toast } from "sonner";
import { ISessionMentorDTO } from "@/interfaces/session.interface";
import { updateSessionStatatusAPI } from "@/api/session.api.service";
import { RequestCardSkeleton } from "./RequestListSkeleton";
import { calculateEndTime } from "@/utility/calculate.endTime";

interface RequestListProps {
	requests: ISessionMentorDTO[];
	isLoading: boolean;
	status: string;
	confirmationDialog: { isOpen: boolean; type: "approve" | "reject" | null; requestId: string | null; rejectReason: string };
	setConfirmationDialog: React.Dispatch<
		React.SetStateAction<{
			isOpen: boolean;
			type: "approve" | "reject" | null;
			requestId: string | null;
			rejectReason: string;
		}>
	>;
	setRequests: React.Dispatch<React.SetStateAction<ISessionMentorDTO[]>>;
}

// Check if two time ranges overlap
function isOverlapping(start1: string, end1: string, start2: string, end2: string): boolean {
	return start1 < end2 && start2 < end1;
}

export const RequestList: React.FC<RequestListProps> = ({ requests, isLoading, status, confirmationDialog, setConfirmationDialog, setRequests }) => {
	const [selectedRequest, setSelectedRequest] = useState<ISessionMentorDTO | null>(null);

	const handleApprove = useCallback(
		(requestId: string) => {
			setConfirmationDialog({ isOpen: true, type: "approve", requestId, rejectReason: "" });
		},
		[setConfirmationDialog]
	);

	const handleReject = useCallback(
		(requestId: string) => {
			setConfirmationDialog({ isOpen: true, type: "reject", requestId, rejectReason: "" });
		},
		[setConfirmationDialog]
	);

	const handleConfirmAction = useCallback(
		async (requestId: string | null, type: "approve" | "reject" | null, rejectReason: string) => {
			if (!requestId || !type) return;

			try {
				let response;
				if (type === "approve") {
					response = await updateSessionStatatusAPI(requestId, "approved");
					toast.success(response.message);

					// ✅ Find approved request details to calculate overlapping
					const approvedRequest = requests.find((r) => r.id === requestId);
					if (approvedRequest) {
						const { date, startTime, hours, mentor } = approvedRequest;

						// Calculate endTime if not present
						const endTime = approvedRequest.endTime || calculateEndTime(startTime, hours);

						// ✅ Remove approved & overlapping requests from UI
						setRequests((prev) =>
							prev.filter((r) =>
								r.id === requestId // keep approved?
									? false // remove approved request
									: r.mentor !== mentor || r.date !== date || !isOverlapping(r.startTime, r.endTime || calculateEndTime(r.startTime, r.hours), startTime, endTime)
							)
						);
					}
				} else {
					if (!rejectReason.trim()) {
						toast.error("Please provide a reason for rejection.");
						return;
					}
					response = await updateSessionStatatusAPI(requestId, "rejected", rejectReason);
					toast.success(response.message);

					// Remove only the rejected request
					setRequests((prev) => prev.filter((r) => r.id !== requestId));
				}

				setConfirmationDialog({ isOpen: false, type: null, requestId: null, rejectReason: "" });
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			}
		},
		[requests, setRequests, setConfirmationDialog]
	);

	return (
		<>
			{isLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{Array.from({ length: 3 }).map((_, index) => (
						<RequestCardSkeleton key={index} />
					))}
				</div>
			) : requests.length === 0 ? (
				<div className="text-center py-12">
					<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
						<Calendar className="h-6 w-6 text-muted-foreground" />
					</div>
					<h3 className="text-lg font-semibold">No {status} requests</h3>
					<p className="text-muted-foreground">{status === "pending" ? "You're all caught up! No pending requests to review." : status === "approved" ? "No approved requests yet." : "No rejected requests."}</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{requests.map((request) => (
						<RequestCard key={request.id} request={request} status={status} setSelectedRequest={setSelectedRequest} handleApprove={handleApprove} handleReject={handleReject} />
					))}
				</div>
			)}

			<RequestDetailsDialog selectedRequest={selectedRequest} status={status} setSelectedRequest={setSelectedRequest} handleApprove={handleApprove} handleReject={handleReject} />

			<ConfirmationDialog
				isOpen={confirmationDialog.isOpen}
				type={confirmationDialog.type}
				requestId={confirmationDialog.requestId}
				rejectReason={confirmationDialog.rejectReason}
				setConfirmationDialog={setConfirmationDialog}
				handleConfirmAction={handleConfirmAction}
			/>
		</>
	);
};

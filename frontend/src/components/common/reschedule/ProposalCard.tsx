import { Alert } from "@/components/custom/alert";
import { Button } from "@/components/ui/button";
import { IProposalDTO } from "@/interfaces/reschedule.interface";
import { formatDate, formatTime } from "@/utility/time-data-formatter";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

export function ProposalCard({
	proposal,
	title,
	variant = "default",
	showActions = false,
	onAccept,
	onReject,
}: {
	proposal: IProposalDTO;
	title: string;
	variant?: "default" | "highlight" | "counter";
	showActions?: boolean;
	onAccept?: () => void;
	onReject?: () => void;
}) {
	const bgClass = variant === "highlight" ? "bg-blue-50 border-blue-200" : variant === "counter" ? "bg-orange-50 border-orange-200" : "bg-gray-50";
	const titleColor = variant === "highlight" ? "text-blue-900" : variant === "counter" ? "text-orange-900" : "text-gray-900";

	console.log(`show actions in proposal card : `, showActions);

	return (
		<div className={`p-4 rounded-lg border ${bgClass}`}>
			<h4 className={`font-medium ${titleColor} mb-3`}>{title}</h4>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
				<div className="flex items-center gap-2">
					<Calendar className={`w-4 h-4 ${variant === "highlight" ? "text-blue-600" : variant === "counter" ? "text-orange-600" : "text-gray-600"}`} />
					<div>
						<p className="text-sm font-medium">Date</p>
						<p className="text-sm text-gray-700">{proposal.proposedDate ? formatDate(proposal.proposedDate) : "-"}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Clock className={`w-4 h-4 ${variant === "highlight" ? "text-blue-600" : variant === "counter" ? "text-orange-600" : "text-gray-600"}`} />
					<div>
						<p className="text-sm font-medium">Time</p>
						<p className="text-sm text-gray-700">{proposal.proposedStartTime && proposal.proposedEndTime ? `${formatTime(proposal.proposedStartTime)} - ${formatTime(proposal.proposedEndTime)}` : "-"}</p>
					</div>
				</div>
			</div>
			{proposal.message && (
				<div className="mt-3 py-3">
					<p className="text-sm font-medium text-gray-700">Message:</p>
					<p className="text-sm text-gray-900 italic pl-4">"{proposal.message}"</p>
				</div>
			)}
			{showActions && (
				<div className="flex gap-2 mt-3">
					{onAccept && (
						<Alert
							triggerElement={
								<Button size="sm" className="bg-green-600 hover:bg-green-700">
									<CheckCircle className="w-3 h-3 mr-1" />
									Accept
								</Button>
							}
							actionText="Accept Proposal"
							contentTitle="Accept Proposal"
							contentDescription="Are you sure you want to accept this proposal?"
							onConfirm={onAccept}
						/>
					)}
					{onReject && (
						<Alert
							triggerElement={
								<Button variant="destructive" size="sm">
									<XCircle className="w-4 h-4 mr-2" />
									Cancel
								</Button>
							}
							actionText="Cancel Session"
							contentTitle="Cancel Session"
							contentDescription="Are you sure you want to cancel this session?"
							onConfirm={onReject}
						/>
					)}
				</div>
			)}
		</div>
	);
}

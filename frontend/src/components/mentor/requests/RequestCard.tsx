import { memo } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Check, X } from "lucide-react";
import { ISessionMentorDTO } from "@/interfaces/session.interface";
import { formatTime } from "@/utility/time-data-formatter";

interface RequestCardProps {
	request: ISessionMentorDTO;
	status: string;
	setSelectedRequest: (request: ISessionMentorDTO) => void;
	handleApprove: (requestId: string) => void;
	handleReject: (requestId: string) => void;
}

export const RequestCard: React.FC<RequestCardProps> = memo(({ request, status, setSelectedRequest, handleApprove, handleReject }) => {
	const participant = request.participants[0]; // Assuming one participant for one-on-one sessions

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between items-start">
					<div className="flex items-center gap-3">
						<Avatar className="h-12 w-12">
							<AvatarImage src={participant.avatar} alt={`${participant.firstName} ${participant.lastName}`} />
						</Avatar>
						<div>
							<h3 className="text-lg font-semibold">{`${participant.firstName} ${participant.lastName}`}</h3>
							<p className="text-sm text-muted-foreground">{request.sessionFormat}</p>
						</div>
					</div>
					<Badge variant={request.pricing === "paid" ? "default" : "outline"}>{request.pricing}</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 gap-1">
					<div className="space-y-1">
						<span className="text-sm font-medium text-muted-foreground">Topic</span>
						<p className="font-medium">{request.topic}</p>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<span className="text-sm font-medium text-muted-foreground">Format</span>
							<p className="text-sm">{request.sessionFormat}</p>
						</div>
					</div>
					<div className="space-y-1">
						<span className="text-sm font-medium text-muted-foreground">Date & Time</span>
						<div className="flex items-center gap-1 text-sm">
							<Clock className="h-4 w-4 text-muted-foreground" />
							<span className="text-muted-foreground">{`${formatTime(request.startTime)} - ${formatTime(request.endTime)}`}</span>
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				{status === "pending" ? (
					<div className="flex items-center gap-2 w-full">
						<Button variant="outline" className="flex-1" onClick={() => setSelectedRequest(request)}>
							View Details
						</Button>
						<Button size="icon" variant="outline" className="h-9 w-9" onClick={() => handleApprove(request.id)}>
							<Check className="h-4 w-4 text-green-500" />
							<span className="sr-only">Approve</span>
						</Button>
						<Button size="icon" variant="outline" className="h-9 w-9" onClick={() => handleReject(request.id)}>
							<X className="h-4 w-4 text-red-500" />
							<span className="sr-only">Reject</span>
						</Button>
					</div>
				) : (
					<Button variant="outline" className="w-full" onClick={() => setSelectedRequest(request)}>
						View Details
					</Button>
				)}
			</CardFooter>
		</Card>
	);
});

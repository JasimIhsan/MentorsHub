import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";
import { ISessionMentorDTO } from "@/interfaces/ISessionDTO";
import { formatDate } from "@/utility/time-data-formatter";
import { Link } from "react-router-dom";

interface SessionRequestsPreviewProps {
	requests: ISessionMentorDTO[];
	isLoading: boolean;
}

export function SessionRequestsPreview({ requests, isLoading }: SessionRequestsPreviewProps) {
	if (isLoading) {
		return (
			<div className="space-y-4">
				{[...Array(3)].map((_, index) => (
					<div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
						<div className="flex items-center gap-3">
							<Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-32 bg-gray-200" />
								<Skeleton className="h-3 w-48 bg-gray-200" />
								<div className="flex items-center gap-1">
									<Skeleton className="h-3 w-3 bg-gray-200" />
									<Skeleton className="h-3 w-24 bg-gray-200" />
								</div>
							</div>
						</div>
						<Skeleton className="h-9 w-24 bg-gray-200" />
					</div>
				))}
				<Skeleton className="h-9 w-full bg-gray-200" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{requests.map((request) => (
				<div key={request.id} className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarImage src={request.participants[0].avatar || "/placeholder.svg"} alt={request.participants[0].firstName} />
							<AvatarFallback>{request.participants[0].firstName.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<div className="font-medium">{`${request.participants[0].firstName} ${request.participants[0].lastName}`}</div>
							<div className="text-sm text-muted-foreground">{request.topic}</div>
							<div className="flex items-center gap-1 mt-1">
								<Clock className="h-3 w-3 text-muted-foreground" />
								<span className="text-xs text-muted-foreground">{formatDate(request.date)}</span>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Link to={`/mentor/requests?status=pending`}>
							<Button>View Request</Button>
						</Link>
					</div>
				</div>
			))}
			<Link to={"/mentor/requests"}>
				<Button variant="outline" className="w-full">
					View All Requests
				</Button>
			</Link>
		</div>
	);
}

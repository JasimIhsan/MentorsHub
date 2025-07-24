import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Clock, Video } from "lucide-react";
import { ISessionMentorDTO } from "@/interfaces/session.interface";
import { formatDate, formatTime } from "@/utility/time-data-formatter";
import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { toast } from "sonner";

interface UpcomingSessionsListProps {
	sessions: ISessionMentorDTO[];
	isLoading: boolean;
}

export function UpcomingSessionsList({ sessions, isLoading }: UpcomingSessionsListProps) {
	const navigate = useNavigate();

	// Handle navigation to video call
	const handleStartSession = useCallback(
		(sessionId: string) => {
			try {
				navigate(`/video-call/${sessionId}`);
			} catch (err: any) {
				toast.error(err.response?.data?.message || "Failed to start session.");
			}
		},
		[navigate]
	);

	if (isLoading) {
		return (
			<div className="space-y-4 flex flex-col justify-between">
				{[...Array(3)].map((_, index) => (
					<div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
						<div className="flex items-center gap-3">
							<Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-32 bg-gray-200" />
								<Skeleton className="h-3 w-48 bg-gray-200" />
								<div className="flex items-center gap-2">
									<Skeleton className="h-3 w-3 bg-gray-200" />
									<Skeleton className="h-3 w-24 bg-gray-200" />
									<Skeleton className="h-3 w-3 bg-gray-200" />
									<Skeleton className="h-3 w-20 bg-gray-200" />
									<Skeleton className="h-5 w-16 bg-gray-200" />
								</div>
							</div>
						</div>
						<Skeleton className="h-8 w-24 bg-gray-200" />
					</div>
				))}
				<Skeleton className="h-9 w-full bg-gray-200" />
			</div>
		);
	}

	return (
		<div className="space-y-4 flex flex-col justify-between">
			{sessions.length === 0 ? (
				<p>No sessions found</p>
			) : (
				sessions.map((session) => (
					<div key={session.id} className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
						<div className="flex items-center gap-3">
							<Avatar>
								<AvatarImage src={session.participants[0]?.avatar || "/placeholder.svg"} alt={`${session.participants[0]?.firstName} ${session.participants[0]?.lastName}`} />
								<AvatarFallback>
									{session.participants[0]?.firstName?.charAt(0)}
									{session.participants[0]?.lastName?.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div>
								<div className="font-medium">
									{session.participants[0]?.firstName} {session.participants[0]?.lastName}
								</div>
								<div className="text-sm text-muted-foreground">{session.topic}</div>
								<div className="flex items-center gap-1 mt-1">
									<span className="text-xs text-muted-foreground flex gap-1 items-center">
										<CalendarDays className="h-3 w-3 text-muted-foreground" />
										{formatDate(session.date)}
									</span>
									<span className="text-xs text-muted-foreground flex gap-1 items-center">
										<Clock className="h-3 w-3 text-muted-foreground" />
										{formatTime(session.time)}
									</span>
									<span className="text-xs text-muted-foreground flex gap-1 items-center">({session.hours}h)</span>
									{session.sessionFormat === "video" && (
										<Badge variant="outline" className="ml-2 text-[10px] h-5">
											<Video className="h-3 w-3 mr-1" />
											Video
										</Badge>
									)}
								</div>
							</div>
						</div>
						<Button size="sm" variant="outline" onClick={() => handleStartSession(session.id)}>
							Start Session
						</Button>
					</div>
				))
			)}
			<Link to="/mentor/upcoming-sessions">
				<Button variant="outline" className="w-full">
					View Full Schedule
				</Button>
			</Link>
		</div>
	);
}

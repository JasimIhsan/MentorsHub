// components/sessions/SessionCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Video, IndianRupee, MessageSquare } from "lucide-react";
import { ISessionMentorDTO } from "@/interfaces/ISessionDTO";
import SessionParticipants from "./SessionParticipants";
import SessionActions from "./SessionActions";

interface SessionCardProps {
	session: ISessionMentorDTO;
	onStartSession: () => void;
	setSelectedSession: (session: ISessionMentorDTO) => void;
	handleUpdateSession: (sessionId: string) => void;
}

export function SessionCard({ session, onStartSession, setSelectedSession, handleUpdateSession }: SessionCardProps) {
	const formatTime = (time: string) => {
		const [hour, minute] = time.split(":").map(Number);
		const ampm = hour >= 12 ? "PM" : "AM";
		const hour12 = hour % 12 || 12;
		return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
	};

	return (
		<Card className="overflow-hidden p-0">
			<CardContent className="p-6">
				<div className="flex flex-col md:flex-row gap-6">
					<div className="flex-1">
						<div className="flex justify-between items-center">
							<h3 className="font-bold text-xl text-primary cursor-pointer hover:underline" onClick={() => setSelectedSession(session)}>
								{session.topic}
							</h3>
						</div>
						<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex items-center gap-2">
								<CalendarDays className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{new Date(session.date).toLocaleString("en-US", { dateStyle: "medium" })}</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">
									{formatTime(session.time)} ({session.hours} hours)
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Video className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{session.sessionFormat}</span>
							</div>
							<div className="flex items-center gap-2">
								<IndianRupee className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{session.pricing === "free" ? "Free" : `${session.totalAmount?.toFixed(2) || 0}`}</span>
							</div>
							<div className="flex items-center gap-2">
								<MessageSquare className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{session.sessionType}</span>
							</div>
						</div>
					</div>
					<div className="flex justify-center items-center gap-2">
						<Badge variant={session.status === "completed" ? "outline" : "default"} className={`${session.status === "completed" ? "bg-primary/5 text-primary" : "bg-primary text-primary-foreground"} capitalize`}>
							{session.status}
						</Badge>
						<SessionParticipants participants={session.participants} />
						<SessionActions session={session} onStartSession={onStartSession} handleUpdateSession={handleUpdateSession} setSelectedSession={setSelectedSession} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

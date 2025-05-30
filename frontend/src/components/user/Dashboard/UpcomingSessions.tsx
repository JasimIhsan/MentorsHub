// src/components/dashboard/UpcomingSessions.tsx
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Video, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { CustomHeader } from "@/components/custom/header";
import { Session } from "@/interfaces/interfaces";

interface UpcomingSessionsProps {
	sessions: Session[];
}

const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({ sessions }) => {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CustomHeader head="Upcoming Sessions" description="Your scheduled mentorship sessions" />
					</div>
					<Button variant="ghost" size="sm" asChild>
						<Link to="/sessions">View All</Link>
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{sessions.map((session) => (
						<div key={session.id} className="flex items-start gap-4 rounded-lg border p-4">
							<Avatar className="h-12 w-12">
								<AvatarImage src={session.mentorAvatar} alt={session.mentorName} />
								<AvatarFallback>{session.mentorName.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<div className="flex items-center justify-between">
									<h3 className="font-semibold">{session.title}</h3>
									{session.isPaid ? <Badge>Paid</Badge> : <Badge variant="outline">Free</Badge>}
								</div>
								<p className="text-sm text-muted-foreground">with {session.mentorName}</p>
								<div className="mt-2 flex flex-wrap items-center gap-2">
									<div className="flex items-center gap-1">
										<CalendarDays className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">{session.date}</span>
									</div>
									<div className="flex items-center gap-1">
										<Clock className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">{session.time}</span>
									</div>
									<div className="flex items-center gap-1">
										{session.type === "video" ? <Video className="h-4 w-4 text-muted-foreground" /> : <MessageSquare className="h-4 w-4 text-muted-foreground" />}
										<span className="text-sm">{session.type === "video" ? "Video Call" : "Chat"}</span>
									</div>
								</div>
							</div>
							<Button>Join Session</Button>
						</div>
					))}
					{sessions.length === 0 && (
						<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
							<CalendarDays className="mb-2 h-8 w-8 text-muted-foreground" />
							<p className="text-center text-muted-foreground">No upcoming sessions</p>
							<Button className="mt-4" asChild>
								<Link to="/browse">Find a Mentor</Link>
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default UpcomingSessions;

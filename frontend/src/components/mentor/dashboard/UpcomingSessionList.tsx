import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Video } from "lucide-react";

export function UpcomingSessionsList() {
	const sessions = [
		{
			id: "sess-1",
			mentee: {
				name: "Maria Garcia",
				avatar: "/placeholder.svg?height=40&width=40",
				initials: "MG",
			},
			topic: "JavaScript Advanced Concepts",
			scheduledTime: "Today, 1:00 PM",
			duration: "60 min",
			type: "video",
		},
		{
			id: "sess-2",
			mentee: {
				name: "James Wilson",
				avatar: "/placeholder.svg?height=40&width=40",
				initials: "JW",
			},
			topic: "Code Review Session",
			scheduledTime: "Today, 4:30 PM",
			duration: "45 min",
			type: "video",
		},
		{
			id: "sess-3",
			mentee: {
				name: "Emily Davis",
				avatar: "/placeholder.svg?height=40&width=40",
				initials: "ED",
			},
			topic: "Career Path Discussion",
			scheduledTime: "Tomorrow, 11:00 AM",
			duration: "30 min",
			type: "video",
		},
	];

	return (
		<div className="space-y-4">
			{sessions.map((session) => (
				<div key={session.id} className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarImage src={session.mentee.avatar || "/placeholder.svg"} alt={session.mentee.name} />
							<AvatarFallback>{session.mentee.initials}</AvatarFallback>
						</Avatar>
						<div>
							<div className="font-medium">{session.mentee.name}</div>
							<div className="text-sm text-muted-foreground">{session.topic}</div>
							<div className="flex items-center gap-1 mt-1">
								<Clock className="h-3 w-3 text-muted-foreground" />
								<span className="text-xs text-muted-foreground">
									{session.scheduledTime} ({session.duration})
								</span>
								{session.type === "video" && (
									<Badge variant="outline" className="ml-2 text-[10px] h-5">
										<Video className="h-3 w-3 mr-1" />
										Video
									</Badge>
								)}
							</div>
						</div>
					</div>
					<Button size="sm" variant="outline">
						Join
					</Button>
				</div>
			))}

			<Button variant="outline" className="w-full">
				View Full Schedule
			</Button>
		</div>
	);
}

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, X } from "lucide-react";

export function SessionRequestsPreview() {
	const requests = [
		{
			id: "req-1",
			mentee: {
				name: "Alex Johnson",
				avatar: "/placeholder.svg?height=40&width=40",
				initials: "AJ",
			},
			topic: "React Fundamentals",
			proposedTime: "Today, 3:00 PM",
			urgency: "high",
			plan: "Pro Plan",
		},
		{
			id: "req-2",
			mentee: {
				name: "Sarah Williams",
				avatar: "/placeholder.svg?height=40&width=40",
				initials: "SW",
			},
			topic: "Career Guidance",
			proposedTime: "Tomorrow, 10:00 AM",
			urgency: "medium",
			plan: "Basic Plan",
		},
		{
			id: "req-3",
			mentee: {
				name: "Michael Chen",
				avatar: "/placeholder.svg?height=40&width=40",
				initials: "MC",
			},
			topic: "Interview Preparation",
			proposedTime: "Jul 18, 2:30 PM",
			urgency: "low",
			plan: "Premium Plan",
		},
	];

	return (
		<div className="space-y-4">
			{requests.map((request) => (
				<div key={request.id} className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarImage src={request.mentee.avatar || "/placeholder.svg"} alt={request.mentee.name} />
							<AvatarFallback>{request.mentee.initials}</AvatarFallback>
						</Avatar>
						<div>
							<div className="font-medium">{request.mentee.name}</div>
							<div className="text-sm text-muted-foreground">{request.topic}</div>
							<div className="flex items-center gap-1 mt-1">
								<Clock className="h-3 w-3 text-muted-foreground" />
								<span className="text-xs text-muted-foreground">{request.proposedTime}</span>
								<Badge variant={request.urgency === "high" ? "destructive" : request.urgency === "medium" ? "default" : "outline"} className="ml-2 text-[10px] h-5">
									{request.plan}
								</Badge>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
							<Check className="h-4 w-4 text-green-500" />
							<span className="sr-only">Approve</span>
						</Button>
						<Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
							<X className="h-4 w-4 text-red-500" />
							<span className="sr-only">Reject</span>
						</Button>
					</div>
				</div>
			))}

			<Button variant="outline" className="w-full">
				View All Requests
			</Button>
		</div>
	);
}

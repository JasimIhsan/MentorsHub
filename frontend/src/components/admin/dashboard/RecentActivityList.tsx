import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const activities = [
	{
		id: 1,
		user: {
			name: "Sarah Johnson",
			avatar: "/placeholder.svg",
			initials: "SJ",
		},
		action: "completed a session",
		target: "JavaScript Fundamentals",
		time: "10 minutes ago",
		type: "session",
	},
	{
		id: 2,
		user: {
			name: "Michael Chen",
			avatar: "/placeholder.svg",
			initials: "MC",
		},
		action: "registered as a mentor",
		target: "",
		time: "25 minutes ago",
		type: "registration",
	},
	{
		id: 3,
		user: {
			name: "Emily Rodriguez",
			avatar: "/placeholder.svg",
			initials: "ER",
		},
		action: "made a payment",
		target: "$75.00",
		time: "1 hour ago",
		type: "payment",
	},
	{
		id: 4,
		user: {
			name: "David Kim",
			avatar: "/placeholder.svg",
			initials: "DK",
		},
		action: "booked a session",
		target: "UX Design Principles",
		time: "2 hours ago",
		type: "booking",
	},
	{
		id: 5,
		user: {
			name: "Lisa Wang",
			avatar: "/placeholder.svg",
			initials: "LW",
		},
		action: "left a review",
		target: "5 stars",
		time: "3 hours ago",
		type: "review",
	},
];

export function RecentActivityList() {
	return (
		<div className="space-y-4">
			{activities.map((activity) => (
				<div key={activity.id} className="flex items-center gap-4">
					<Avatar className="h-9 w-9">
						<AvatarImage src={activity.user.avatar} alt={activity.user.name} />
						<AvatarFallback>{activity.user.initials}</AvatarFallback>
					</Avatar>
					<div className="flex-1 space-y-1">
						<p className="text-sm font-medium leading-none">
							<span className="font-semibold">{activity.user.name}</span> {activity.action} {activity.target && <span className="font-medium">{activity.target}</span>}
						</p>
						<p className="text-xs text-muted-foreground">{activity.time}</p>
					</div>
					<ActivityBadge type={activity.type} />
				</div>
			))}
		</div>
	);
}

function ActivityBadge({ type }: { type: string }) {
	switch (type) {
		case "session":
			return (
				<Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
					Session
				</Badge>
			);
		case "registration":
			return (
				<Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
					Registration
				</Badge>
			);
		case "payment":
			return (
				<Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
					Payment
				</Badge>
			);
		case "booking":
			return (
				<Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
					Booking
				</Badge>
			);
		case "review":
			return (
				<Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
					Review
				</Badge>
			);
		default:
			return (
				<Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
					Activity
				</Badge>
			);
	}
}

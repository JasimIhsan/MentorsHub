import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, CheckCircle, XCircle, Calendar } from "lucide-react";
import { CustomHeader } from "@/components/custom/header";
import { INotification } from "@/interfaces/INotification";
import { formatRelativeTime } from "@/utility/format-relative-time";

interface NotificationsProps {
	userId: string;
	notifications: INotification[];
	markAsRead: (id: string) => void;
	markAllAsRead: (userId: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, markAllAsRead, markAsRead, userId }) => {
	const getNotificationStyles = (type: INotification["type"]) => {
		switch (type) {
			case "info":
				return { bg: "bg-blue-100", text: "text-blue-600", icon: <Bell className="h-5 w-5" /> };
			case "warning":
				return { bg: "bg-yellow-100", text: "text-yellow-600", icon: <AlertTriangle className="h-5 w-5" /> };
			case "success":
				return { bg: "bg-green-100", text: "text-green-600", icon: <CheckCircle className="h-5 w-5" /> };
			case "error":
				return { bg: "bg-red-100", text: "text-red-600", icon: <XCircle className="h-5 w-5" /> };
			case "reminder":
				return { bg: "bg-purple-100", text: "text-purple-600", icon: <Calendar className="h-5 w-5" /> };
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CustomHeader head="Notifications" description="Stay updated with your mentorship activities" />
					</div>
					<Button variant="ghost" size="sm" onClick={() => markAllAsRead(userId)}>
						Mark All as Read
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{notifications.map((notification) => {
						const { bg, text, icon } = getNotificationStyles(notification.type);
						return (
							<div key={notification.id} className="flex items-start gap-4 rounded-lg border p-4">
								<div className={`flex h-10 w-10 items-center justify-center rounded-full ${bg} ${text}`}>{icon}</div>
								<div className="flex-1">
									<p className="font-medium">{notification.title}</p>
									<p className="text-sm">{notification.message}</p>
									<p className="text-sm text-muted-foreground">{formatRelativeTime(notification.createdAt)}</p>
									{notification.link && (
										<a href={notification.link} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
											View Details
										</a>
									)}
								</div>
								<Button variant="ghost" size="sm" disabled={notification.isRead} onClick={() => markAsRead(notification.id)}>
									{notification.isRead ? "Read" : "Mark as Read"}
								</Button>
							</div>
						);
					})}
					{notifications.length === 0 && (
						<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
							<p className="text-center text-muted-foreground">No Notifications</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default Notifications;

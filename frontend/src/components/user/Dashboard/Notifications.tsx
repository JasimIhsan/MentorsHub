// src/components/dashboard/Notifications.tsx
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Users, Award, BookOpen } from "lucide-react";
import { CustomHeader } from "@/components/custorm/header";
import { Notification } from "@/interfaces/interfaces";

interface NotificationsProps {
	notifications: Notification[];
}

const Notifications: React.FC<NotificationsProps> = ({ notifications }) => {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CustomHeader head="Notifications" description="Stay updated with your mentorship activities" />
					</div>
					<Button variant="ghost" size="sm">
						Mark All as Read
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{notifications.map((notification) => (
						<div key={notification.id} className="flex items-start gap-4 rounded-lg border p-4">
							<div
								className={`flex h-10 w-10 items-center justify-center rounded-full ${
									notification.type === "reminder"
										? "bg-blue-100 text-blue-600"
										: notification.type === "availability"
										? "bg-green-100 text-green-600"
										: notification.type === "achievement"
										? "bg-yellow-100 text-yellow-600"
										: "bg-purple-100 text-purple-600"
								}`}>
								{notification.type === "reminder" ? (
									<Bell className="h-5 w-5" />
								) : notification.type === "availability" ? (
									<Users className="h-5 w-5" />
								) : notification.type === "achievement" ? (
									<Award className="h-5 w-5" />
								) : (
									<BookOpen className="h-5 w-5" />
								)}
							</div>
							<div className="flex-1">
								<p className="font-medium">{notification.message}</p>
								<p className="text-sm text-muted-foreground">{notification.time}</p>
							</div>
							<Button variant="ghost" size="sm">
								{notification.action}
							</Button>
						</div>
					))}
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

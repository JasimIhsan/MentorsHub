import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { CustomCardHeader } from "@/components/custom/CustomCardHeader";
import { INotification } from "@/interfaces/notification.interface";
import { formatRelativeTime } from "@/utility/format-relative-time";
import { Link } from "react-router-dom";

interface NotificationsProps {
	userId: string;
	notifications: INotification[];
	markAsRead: (id: string) => void;
	markAllAsRead: (userId: string) => void;
	isLoading: boolean; // Added isLoading prop
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, markAllAsRead, markAsRead, userId, isLoading }) => {

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
						<div>
							<CustomCardHeader head="Notifications" description="Stay updated with your mentorship activities" />
						</div>
						<Skeleton className="bg-gray-200 h-8 w-full sm:w-32" /> {/* Skeleton for Mark All as Read button */}
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{[1, 2, 3].map((_, index) => (
							<div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border p-2 sm:p-4">
								<Skeleton className="bg-gray-200 h-8 w-8 sm:h-10 sm:w-10 rounded-full" /> {/* Skeleton for icon */}
								<div className="flex-1 space-y-1">
									<Skeleton className="bg-gray-200 h-4 w-40" /> {/* Skeleton for title */}
									<Skeleton className="bg-gray-200 h-3 w-60 hidden sm:block" /> {/* Skeleton for message */}
									<Skeleton className="bg-gray-200 h-3 w-20" /> {/* Skeleton for timestamp */}
									<Skeleton className="bg-gray-200 h-3 w-24" /> {/* Skeleton for link */}
								</div>
								<Skeleton className="bg-gray-200 h-8 w-full sm:w-24 mt-2 sm:mt-0" /> {/* Skeleton for Mark as Read button */}
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
					<div>
						<CustomCardHeader head="Notifications" description="Stay updated with your mentorship activities" />
					</div>
					<Button variant="ghost" size="sm" onClick={() => markAllAsRead(userId)} className="w-full sm:w-auto">
						Mark All as Read
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{notifications.slice(0, 4).map((notification) => {
						// const { bg, text, icon } = getNotificationStyles(notification.type);
						return (
							<div key={notification.id} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border p-2 sm:p-4">
								{/* <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full ${bg} ${text}`}>{icon}</div> */}
								<div className="flex-1 space-y-1">
									<p className="font-medium text-sm sm:text-base">{notification.title}</p>
									<p className="text-xs text-muted-foreground hidden sm:block">{notification.message}</p>
									<p className="text-xs sm:text-sm text-muted-foreground">{formatRelativeTime(notification.createdAt)}</p>
									{notification.link && (
										<Link to={notification.link} className="text-xs sm:text-sm text-blue-600 hover:underline">
											View Details
										</Link>
									)}
								</div>
								<Button variant="ghost" size="sm" disabled={notification.isRead} onClick={() => markAsRead(notification.id)} className="mt-2 sm:mt-0">
									{notification.isRead ? "Read" : "Mark as Read"}
								</Button>
							</div>
						);
					})}
					{notifications.length === 0 && (
						<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-4 sm:p-8 text-center">
							<p className="text-xs sm:text-sm text-muted-foreground">No Notifications</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default Notifications;

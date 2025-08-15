import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle"; // Assuming a Toggle component from shadcn/ui
import { useNotifications } from "@/hooks/useNotification";
import { RootState } from "@/store/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Info, AlertTriangle, CheckCircle, XCircle, Bell, Loader2 } from "lucide-react"; // Import icons from lucide-react

// Import notification interface
interface NotificationType {
	id: string;
	recipientId: string;
	title: string;
	message: string;
	type: "info" | "warning" | "success" | "error" | "reminder";
	link?: string;
	isRead: boolean;
	createdAt: Date | string;
}

// Component for individual notification item
const NotificationItem: React.FC<{
	notification: NotificationType;
	onMarkAsRead: (id: string) => void;
}> = ({ notification, onMarkAsRead }) => {
	// Map notification types to icons
	const typeIcons: Record<string, React.ReactElement> = {
		info: <Info className="w-5 h-5 text-blue-500" />,
		warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
		success: <CheckCircle className="w-5 h-5 text-green-500" />,
		error: <XCircle className="w-5 h-5 text-red-500" />,
		reminder: <Bell className="w-5 h-5 text-purple-500" />,
	};

	return (
		<div className="p-4 border-l-4 border-gray-200 hover:bg-muted/50 cursor-pointer flex justify-between items-start rounded-md shadow-sm" onClick={() => !notification.isRead && onMarkAsRead(notification.id)}>
			<div className="flex items-start gap-3">
				{/* Icon for notification type */}
				<div className="mt-1">{typeIcons[notification.type]}</div>
				<div>
					<h3 className="font-semibold text-sm">{notification.title}</h3>
					<p className="text-sm text-muted-foreground">{notification.message}</p>
					<p className="text-xs text-muted-foreground mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
					{notification.link && (
						<a href={notification.link} className="text-blue-500 hover:underline text-sm">
							View Details
						</a>
					)}
				</div>
			</div>
			<span className={`text-xs ${notification.isRead ? "text-muted-foreground" : "text-blue-600"}`}>{notification.isRead ? "Read" : "Unread"}</span>
		</div>
	);
};

// Main Notifications Page Component
export const NotificationsPage: React.FC = () => {
	// State management
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(1);
	const [filterRead, setFilterRead] = useState<boolean | null>(null); // null: all, true: read, false: unread
	const userId = useSelector((state: RootState) => state.userAuth.user?.id);
	const limit = 10;
	const { notifications, isLoading, error, markAsRead, markAllAsRead, totalPages } = useNotifications(userId as string, {
		page,
		limit,
		search: searchQuery,
		isRead: filterRead ?? undefined,
	});

	// Handle search input
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
		setPage(1); // Reset to first page on new search
	};

	// Handle page change
	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setPage(newPage);
		}
	};

	// Handle read/unread filter
	const handleFilterChange = (value: boolean | null) => {
		setFilterRead(value);
		setPage(1); // Reset to first page on filter change
	};

	return (
		<div className="w-full py-8 px-10 md:px-20 xl:px-25">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-4xl font-semibold">Notifications</h1>
				{notifications.length > 0 && (
					<Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={markAllAsRead}>
						Mark All as Read
					</Button>
				)}
			</div>

			{/* Search and Filter Bar */}
			<div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
				<Input type="text" value={searchQuery} onChange={handleSearch} placeholder="Search notifications..." className="w-full sm:w-1/2" />
				<div className="flex gap-2">
					<Toggle pressed={filterRead === null} onPressedChange={() => handleFilterChange(null)} className="text-xs">
						All
					</Toggle>
					<Toggle pressed={filterRead === false} onPressedChange={() => handleFilterChange(false)} className="text-xs">
						Unread
					</Toggle>
					<Toggle pressed={filterRead === true} onPressedChange={() => handleFilterChange(true)} className="text-xs">
						Read
					</Toggle>
				</div>
			</div>

			{/* Error State */}
			{error && <div className="p-3 text-center text-sm text-red-500">{error}</div>}

			{/* Loading State */}
			{isLoading && (
				<div className="p-3 flex justify-center items-center">
					<Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading notifications...
				</div>
			)}

			{/* Notifications List */}
			{!isLoading && notifications.length === 0 && <div className="p-3 text-center text-sm text-muted-foreground">No notifications</div>}
			{!isLoading && notifications.length > 0 && (
				<div className="space-y-4">
					{notifications.map((notification) => (
						<NotificationItem key={notification.id} notification={notification} onMarkAsRead={markAsRead} />
					))}
				</div>
			)}

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<div className="flex justify-center items-center gap-4 mt-6">
					<Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
						Previous
					</Button>
					<span className="text-sm text-muted-foreground">
						Page {page} of {totalPages}
					</span>
					<Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
						Next
					</Button>
				</div>
			)}
		</div>
	);
};

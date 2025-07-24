import { Bell, CheckCircle2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNotifications } from "@/hooks/useNotification";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { INotification } from "@/interfaces/notification.interface";
import { formatRelativeTime } from "@/utility/format-relative-time";

// Define the NotificationItem component with type-based background colors for unread only
interface NotificationItemProps {
	notification: INotification;
	onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
	const { title, message, type = "info", link, isRead, createdAt, id } = notification;

	// Set background color: light gray for unread, white for read
	const background = isRead ? "bg-white" : type === "info" ? "bg-blue-50" : type === "error" ? "bg-red-50" : "bg-gray-100/50";

	const ItemContent = (
		<div className={`flex items-start gap-3 p-3 hover:bg-muted cursor-pointer ${background}`}>
			<div className="flex-1 space-y-1">
				<div className="flex items-center justify-between">
					<p className={`text-sm font-medium ${!isRead ? "font-bold" : ""}`}>{title}</p>
				</div>
				<p className="text-xs text-muted-foreground">{message}</p>
				<p className="text-xs text-muted-foreground">{formatRelativeTime(createdAt)}</p>
			</div>
			<div>
				{!isRead && id && (
					<Button
						variant="ghost"
						size="icon"
						className="h-10 w-10 rounded-full p-0 hover:bg-blue-100"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onMarkAsRead(id);
						}}>
						<CheckCircle2 className="h-10 w-10 text-blue-500" />
						<span className="sr-only">Mark as read</span>
					</Button>
				)}
			</div>
		</div>
	);

	return link ? (
		<Link to={link} className="block">
			{ItemContent}
		</Link>
	) : (
		ItemContent
	);
};

// NotificationDropdown component with More options dropdown and filter
export const NotificationDropdown: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
	const user = useSelector((state: RootState) => state.userAuth.user);
	const { notifications, markAsRead, markAllAsRead, unreadCount, isLoading } = useNotifications(user?.id || "");

	// Filter notifications based on filter state
	const filteredNotifications = notifications.filter((n) => {
		if (filter === "all") return true;
		if (filter === "unread") return !n.isRead;
		if (filter === "read") return n.isRead;
		return true;
	});

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className="relative">
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">{unreadCount}</Badge>}
					<span className="sr-only">Notifications</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80 md:w-120">
				<div className="flex items-center justify-between px-3 py-2">
					<DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<MoreHorizontal className="h-5 w-5" />
								<span className="sr-only">More options</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={markAllAsRead}>Mark all as read</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => setFilter("all")}>Show all</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilter("read")}>Show read</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilter("unread")}>Show unread</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<DropdownMenuSeparator />
				<div className="max-h-80 overflow-y-auto" style={{ scrollbarGutter: "stable both-edges" }}>
					{isLoading ? (
						<div className="p-3 text-center text-sm text-muted-foreground">Loading notifications...</div>
					) : filteredNotifications.length > 0 ? (
						filteredNotifications.map((n) => <NotificationItem key={n.id} notification={n} onMarkAsRead={markAsRead} />)
					) : (
						<div className="p-3 text-center text-sm text-muted-foreground">{filter === "unread" ? "No unread notifications" : filter === "read" ? "No read notifications" : "No notifications"}</div>
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

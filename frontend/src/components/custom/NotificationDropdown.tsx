import { Bell, Info, AlertTriangle, CheckCircle, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNotifications } from "@/hooks/useNotification";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { INotification } from "@/interfaces/INotification";
import { formatRelativeTime } from "@/utility/format-relative-time";

// Define the NotificationItem component (unchanged)
interface NotificationItemProps {
	notification: INotification;
	onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
	const { title, message, type = "info", link, isRead, createdAt, id } = notification;

	const icons = {
		info: <Info className="h-5 w-5 text-blue-500" />,
		warning: <AlertTriangle className="h-5 w-5 text-amber-600" />,
		success: <CheckCircle className="h-5 w-5 text-green-500" />,
		error: <XCircle className="h-5 w-5 text-red-500" />,
		reminder: <Bell className="h-5 w-5 text-yellow-500" />,
	};

	const ItemContent = (
		<div className={`flex items-start gap-3 p-3 hover:bg-muted cursor-pointer ${!isRead ? "bg-blue-50/50" : ""}`}>
			<div className="mt-1">{icons[type]}</div>
			<div className="flex-1 space-y-1">
				<div className="flex items-center justify-between">
					<p className={`text-sm font-medium ${!isRead ? "font-bold" : ""}`}>{title}</p>
					{!isRead && id && (
						<Button
							variant="ghost"
							size="icon"
							className="h-5 w-5 rounded-full p-0 hover:bg-blue-100"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onMarkAsRead(id);
							}}>
							<CheckCircle2 className="h-5 w-5 text-blue-500" />
							<span className="sr-only">Mark as read</span>
						</Button>
					)}
				</div>
				<p className="text-xs text-muted-foreground">{message}</p>
				<p className="text-xs text-muted-foreground">{formatRelativeTime(createdAt)}</p>
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

// NotificationDropdown component with improved scrollbar handling
export const NotificationDropdown: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const user = useSelector((state: RootState) => state.userAuth.user);
	const { notifications, markAsRead, markAllAsRead, unreadCount, isLoading } = useNotifications(user?.id || "");

	const handleViewAll = () => {
		setIsOpen(false);
	};

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
					{notifications.length > 0 && (
						<Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={markAllAsRead}>
							Mark All as Read
						</Button>
					)}
				</div>
				<DropdownMenuSeparator />
				<div className="max-h-80 overflow-y-auto" style={{ scrollbarGutter: "stable both-edges" }}>
					{isLoading ? (
						<div className="p-3 text-center text-sm text-muted-foreground">Loading notifications...</div>
					) : notifications.length > 0 ? (
						notifications.map((n) => <NotificationItem key={n.id} notification={n} onMarkAsRead={markAsRead} />)
					) : (
						<div className="p-3 text-center text-sm text-muted-foreground">No notifications</div>
					)}
				</div>
				<DropdownMenuSeparator />
				<Button asChild className="w-full" variant="ghost" onClick={handleViewAll}>
					<Link to="/notifications">View all notifications</Link>
				</Button>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

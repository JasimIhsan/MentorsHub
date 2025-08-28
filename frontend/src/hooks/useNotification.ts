import { useSocket } from "@/context/SocketContext";
import { fetchNotificationsThunk, markNotificationAsReadThunk, markAllNotificationsAsReadThunk } from "@/store/slices/notificationSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Interface for pagination options
interface PaginationOptions {
	page?: number;
	limit?: number;
	search?: string;
	isRead?: boolean;
}


export function useNotifications(userId: string, options: PaginationOptions = {}) {
	const dispatch = useDispatch<AppDispatch>();
	const { socket } = useSocket();
	const { notifications, unreadCount, isLoading, error, totalPages } = useSelector((state: RootState) => state.notifications);

	const { page = 1, limit = 10, search = "", isRead } = options;

	useEffect(() => {
		if (!userId) return;

		// Subscribe to new notifications via socket
		// const unsubscribe = socket.onNewNotification("receive-notification", (notification: INotification) => {
		// 	dispatch(addNotification(notification));
		// });

		// Fetch notifications with pagination and filters
		dispatch(
			fetchNotificationsThunk({
				userId,
				page,
				limit,
				search,
				isRead,
			})
		);

		return () => {
			// unsubscribe();
		};
	}, [dispatch, socket, userId, page, limit, search, isRead]);

	// Mark a single notification as read
	const markAsRead = (id: string) => dispatch(markNotificationAsReadThunk(id));

	// Mark all notifications as read
	const markAllAsRead = () => dispatch(markAllNotificationsAsReadThunk(userId));

	return {
		notifications,
		unreadCount,
		isLoading,
		error,
		totalPages,
		markAsRead,
		markAllAsRead,
	};
}

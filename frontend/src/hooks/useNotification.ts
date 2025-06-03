import { useDispatch, useSelector } from "react-redux";
import { fetchNotificationsThunk, markNotificationAsReadThunk, markAllNotificationsAsReadThunk, addNotification } from "@/store/slices/notificationSlice";
import { useEffect } from "react";
import { RootState, AppDispatch } from "@/store/store";
import { INotification } from "@/interfaces/INotification";
import { useSocket } from "@/context/SocketContext";

export function useNotifications(userId: string) {
	const dispatch = useDispatch<AppDispatch>();
	const { notifications, unreadCount, isLoading, error } = useSelector((state: RootState) => state.notifications);
	const { socket } = useSocket();

	useEffect(() => {
		if (!userId) return;

		// Listen for real-time notifications
		const unsubscribe = socket.onNewNotification("receive-notification", (notification: INotification) => {
			console.log(`Received real-time notification: ${JSON.stringify(notification)}`);
			dispatch(addNotification(notification));
		});

		// Fetch initial notifications
		dispatch(fetchNotificationsThunk(userId));

		return () => {
			unsubscribe();
		};
	}, [userId, dispatch, socket]);

	const markAsRead = (id: string) => {
		dispatch(markNotificationAsReadThunk(id));
	};

	const markAllAsRead = () => {
		dispatch(markAllNotificationsAsReadThunk(userId));
	};

	return { notifications, unreadCount, isLoading, error, markAsRead, markAllAsRead };
}

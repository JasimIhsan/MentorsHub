import { getUserNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "@/api/notification.api.service";
import { INotification } from "@/interfaces/INotification";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

export function useNotifications(userId: string) {
	const [notifications, setNotifications] = useState<INotification[]>([]);
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const [socket, setSocket] = useState<Socket | null>(null);

	// Initialize Socket.IO connection
	useEffect(() => {
		// Replace with your Socket.IO server URL (e.g., from environment variable)
		const socketInstance = io("http://localhost:5858", {
			auth: { userId },
		});

		setSocket(socketInstance);

		// Handle connection errors
		socketInstance.on("connect_error", (error) => {
			console.error("Socket.IO connection error:", error);
			toast.error("Failed to connect to notification service");
		});

		// Listen for incoming notifications
		socketInstance.on("receive-notification", (notification: INotification) => {
			setNotifications((prev) => {
				// Prevent duplicates by checking if notification ID already exists
				if (prev.some((n) => n.id === notification.id)) {
					return prev;
				}
				// Prepend new notification and keep only the latest 5
				const updatedNotifications = [notification, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
				return updatedNotifications;
			});
			if (!notification.isRead) {
				setUnreadCount((prev) => prev + 1);
			}
			toast.success("New notification received");
		});

		// Cleanup on unmount
		return () => {
			socketInstance.disconnect();
			setSocket(null);
		};
	}, [userId]);

	// Fetch initial notifications
	useEffect(() => {
		const loadNotifications = async () => {
			try {
				const data = await getUserNotifications(userId);
				const sortedNotifications = data.sort((a: INotification, b: INotification) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
				setNotifications(sortedNotifications);
				setUnreadCount(sortedNotifications.filter((n: INotification) => !n.isRead).length);
			} catch (error) {
				toast.error("Failed to load notifications");
				console.error("Error fetching notifications:", error);
			}
		};
		loadNotifications();
	}, [userId]);

	// Mark all notifications as read
	const handleMarkAllRead = async () => {
		try {
			await markAllNotificationsAsRead(userId);
			setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
			setUnreadCount(0);
			toast.success("All notifications marked as read");
		} catch (error) {
			toast.error("Failed to mark notifications as read");
			console.error("Error marking all notifications as read:", error);
		}
	};

	// Mark individual notification as read
	const handleMarkNotificationRead = async (notificationId: string | undefined) => {
		if (!notificationId) return;
		try {
			await markNotificationAsRead(notificationId);
			setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)));
			setUnreadCount(notifications.filter((n) => !n.isRead && n.id !== notificationId).length);
			toast.success("Notification marked as read");
		} catch (error) {
			toast.error("Failed to mark notification as read");
			console.error("Error marking notification as read:", error);
		}
	};

	return {
		notifications,
		unreadCount,
		handleMarkAllRead,
		handleMarkNotificationRead,
	};
}

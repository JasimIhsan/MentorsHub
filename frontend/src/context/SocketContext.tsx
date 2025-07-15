// import { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import { socketService, SocketEvents } from "@/services/socket.service";

// interface SocketContextType {
// 	socket: SocketEvents;
// 	isConnected: boolean;
// }

// const SocketContext = createContext<SocketContextType | undefined>(undefined);

// interface SocketProviderProps {
// 	userId: string;
// 	children: ReactNode;
// }

// export function SocketProvider({ userId, children }: SocketProviderProps) {
// 	const [isConnected, setIsConnected] = useState(socketService.isConnected());

// 	useEffect(() => {
// 		if (userId) {
// 			socketService.initialize(userId);
// 		}

// 		const unsubscribe = socketService.onConnectionChange(setIsConnected);

// 		return () => {
// 			unsubscribe();
// 			if (!userId) {
// 				console.log(`userID : `, userId); // showed as undifined when reloading
// 				console.log('Disconnecting socket from SocketProvider');
// 				socketService.disconnect();
// 			}
// 		};
// 	}, [userId]);

// 	const value: SocketContextType = {
// 		socket: {
// 			onNewNotification: (event, callback) => socketService.onNewNotification(event, callback),
// 			onVideoCallEvent: (event, callback) => socketService.onVideoCallEvent(event, callback),
// 			onMessageEvent: (event, callback) => socketService.onMessageEvent(event, callback),
// 			emit: (event, data) => socketService.emit(event, data),
// 			disconnect: () => socketService.disconnect(),
// 			onConnectionChange: (callback) => socketService.onConnectionChange(callback),
// 			on: (event, callback) => socketService.on(event, callback),
// 			off: (event, callback) => socketService.off(event, callback),
// 		},
// 		isConnected,
// 	};

// 	return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
// }

// export function useSocket() {
// 	const context = useContext(SocketContext);
// 	if (!context) {
// 		throw new Error("useSocket must be used within a SocketProvider");
// 	}
// 	return context;
// }

import { Bell, CircleAlert, CircleCheckBig, CircleX, Info } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";

interface IOnlineUsers {
	userId: string;
	status: string;
}

interface ISocketContextType {
	socket: Socket | null;
	isConnected: boolean;
	onlineUsers: IOnlineUsers[];
	disconnectSocket: () => void;
}

interface NotificationPayload {
	title: string;
	message: string;
	type: "success" | "error" | "info" | "warning" | "reminder";
	link?: string;
	createdAt: number;
}

const SocketContext = createContext<ISocketContextType | undefined>(undefined);

export const SocketProvider = ({ children, userId }: { children: React.ReactNode; userId: string }) => {
	const [isConnected, setIsConnected] = useState(false);
	const [onlineUsers, setOnlineUsers] = useState<IOnlineUsers[]>([]);
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		if (!userId || socketRef.current) return;

		const socket = io("http://localhost:5858", {
			auth: { userId },
		});
		socketRef.current = socket;

		socket.on("connect", () => {
			console.log("✅ Connected as", socket.id);
			setIsConnected(true);
			socket.emit("get-online-users");
		});

		socket.on("online-users", (payload) => {
			console.log("Online users updated:", payload);
			setOnlineUsers(payload);
		});

		socket.on("notify-user", (payload: NotificationPayload) => {
			console.log('payload 📖📖: ', payload);
			toast(payload.title, {
				description: payload.message,
				icon: getIcon(payload.type),
				className: "text-black",
				position: "top-center",
				
				style: {
					animation: "slideIn 0.3s ease-out, slideOut 0.3s ease-in 3.7s forwards",
				},
			});
		});

		socket.on("disconnect", () => {
			console.log("❌ Disconnected");
			setIsConnected(false);
			setOnlineUsers([]);
		});

		socket.on("connect_error", (err) => {
			console.error("❌ Connection error:", err.message);
		});
	});

	const disconnectSocket = () => {
		if (socketRef.current) {
			socketRef.current.disconnect();
			socketRef.current = null;
			setIsConnected(false);
			setOnlineUsers([]);
		}
	};

	return (
		<SocketContext.Provider
			value={{
				socket: socketRef.current,
				isConnected,
				onlineUsers,
				disconnectSocket,
			}}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) throw new Error("useSocket must be used within a SocketProvider");
	return context;
};

// Map notification types to icons (using Heroicons)
export const getIcon = (type: "success" | "error" | "info" | "warning" | "reminder") => {
	switch (type) {
		case "success":
			return <CircleCheckBig className="w-6 h-6 pr-2 text-green-500" />;
		case "error":
			return <CircleX className="w-6 h-6 pr-2 text-red-500" />;
		case "info":
			return <Info className="w-6 h-6 pr-2 text-blue-500" />;
		case "warning":
			return <CircleAlert className="w-6 h-6 pr-2 text-yellow-500" />;
		case "reminder":
			return <Bell className="w-6 h-6 pr-2 text-purple-500" />;
		default:
			return null;
	}
};

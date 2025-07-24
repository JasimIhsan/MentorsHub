import { INotification } from "@/interfaces/notification.interface";
import { handleIncomingNotification } from "@/utility/handleIncomingNotification";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io, type Socket } from "socket.io-client";

interface IOnlineUsers {
	userId: string;
	status: string;
}

interface ISocketContextType {
	socket: Socket | null;
	isConnected: boolean;
	onlineUsers: IOnlineUsers[];
	disconnectSocket: () => void;
	isUserOnline: (userId: string) => boolean;
}

const SocketContext = createContext<ISocketContextType | undefined>(undefined);

export const SocketProvider = ({ children, userId }: { children: React.ReactNode; userId: string }) => {
	const [isConnected, setIsConnected] = useState(false);
	const [onlineUsers, setOnlineUsers] = useState<IOnlineUsers[]>([]);
	const socketRef = useRef<Socket | null>(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();

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

		socket.on("notify-user", (notification: INotification) => {
			handleIncomingNotification(notification, dispatch, navigate);
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

	const isUserOnline = (userId: string) => onlineUsers.some((user) => user.userId === userId && user.status === "online");

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
				isUserOnline,
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

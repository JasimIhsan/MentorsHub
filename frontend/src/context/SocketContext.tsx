import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { socketService, SocketEvents } from "@/services/socket.service";

interface SocketContextType {
	socket: SocketEvents;
	isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
	userId: string;
	children: ReactNode;
}

export function SocketProvider({ userId, children }: SocketProviderProps) {
	const [isConnected, setIsConnected] = useState(socketService.isConnected());

	useEffect(() => {
		if (userId) {
			socketService.initialize(userId);
		}

		const unsubscribe = socketService.onConnectionChange(setIsConnected);

		return () => {
			unsubscribe();
			if (!userId) {
				console.log(`userID : `, userId); // showed as undifined when reloading
				console.log('Disconnecting socket from SocketProvider');
				socketService.disconnect();
			}
		};
	}, [userId]);

	const value: SocketContextType = {
		socket: {
			onNewNotification: (event, callback) => socketService.onNewNotification(event, callback),
			onVideoCallEvent: (event, callback) => socketService.onVideoCallEvent(event, callback),
			onMessageEvent: (event, callback) => socketService.onMessageEvent(event, callback),
			emit: (event, data) => socketService.emit(event, data),
			disconnect: () => socketService.disconnect(),
			onConnectionChange: (callback) => socketService.onConnectionChange(callback),
			on: (event, callback) => socketService.on(event, callback),
			off: (event, callback) => socketService.off(event, callback),
		},
		isConnected,
	};

	return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return context;
}

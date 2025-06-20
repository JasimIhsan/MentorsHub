import { io, Socket } from "socket.io-client";
import { INotification } from "@/interfaces/INotification";

interface SocketEvents {
	onNewNotification: (event: string, callback: (notification: INotification) => void) => () => void;
	onVideoCallEvent: (event: string, callback: (data: any) => void) => () => void;
	onMessageEvent: (event: string, callback: (data: any) => void) => () => void;
	emit: (event: string, data?: any) => void;
	disconnect: () => void;
	onConnectionChange: (callback: (isConnected: boolean) => void) => () => void;
	on: (event: string, callback: (data: any) => void) => () => void; // Updated to return cleanup function
	off: (event: string, callback?: (data: any) => void) => void; // Keep void as per Socket.IO
}

class SocketService {
	private static instance: SocketService;
	private socket: Socket | null = null;
	private isInitialized = false;
	private connectionCallbacks: ((isConnected: boolean) => void)[] = [];

	private constructor() {}

	public static getInstance(): SocketService {
		if (!SocketService.instance) {
			SocketService.instance = new SocketService();
		}
		return SocketService.instance;
	}

	public initialize(userId: string): void {
		if (this.isInitialized || !userId) return;

		const socketUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5858";

		this.socket = io(socketUrl, {
			withCredentials: true,
			transports: ["websocket"],
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			query: { userId },
		});

		this.socket.on("connect", () => {
			console.log("Socket connected:", this.socket?.id);
			this.socket?.emit("join", userId);
			this.socket?.emit("register-user", userId);
			this.socket?.emit("get-online-users");
			this.notifyConnectionChange(true);
		});

		this.socket.on("connect_error", (err) => {
			console.error("Socket connect_error:", err.message);
			this.notifyConnectionChange(false);
		});

		this.socket.on("disconnect", () => {
			console.log("Socket disconnected");
			this.notifyConnectionChange(false);
		});

		

		this.isInitialized = true;
	}

	private notifyConnectionChange(isConnected: boolean): void {
		this.connectionCallbacks.forEach((callback) => callback(isConnected));
	}

	public onNewNotification(event: string, callback: (notification: INotification) => void): () => void {
		this.socket?.on(event, callback);
		return () => this.socket?.off(event, callback);
	}

	public onVideoCallEvent(event: string, callback: (data: any) => void): () => void {
		this.socket?.on(event, callback);
		return () => this.socket?.off(event, callback);
	}

	public onMessageEvent(event: string, callback: (data: any) => void): () => void {
		this.socket?.on(event, callback);
		return () => this.socket?.off(event, callback);
	}

	public onConnectionChange(callback: (isConnected: boolean) => void): () => void {
		this.connectionCallbacks.push(callback);
		callback(this.isConnected());
		return () => {
			this.connectionCallbacks = this.connectionCallbacks.filter((cb) => cb !== callback);
		};
	}

	public emit(event: string, data: any): void {
		if (this.socket?.connected) {
			this.socket.emit(event, data);
		} else {
			console.warn(`Cannot emit event ${event}: Socket is not connected`);
		}
	}

	public isConnected(): boolean {
		return !!this.socket?.connected;
	}

	public on(event: string, callback: (data: any) => void): () => void {
		this.socket?.on(event, callback);
		return () => this.socket?.off(event, callback);
	}

	public off(event: string, callback?: (data: any) => void): void {
		this.socket?.off(event, callback);
	}

	public disconnect(): void {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
			this.isInitialized = false;
			this.connectionCallbacks = [];
		}
	}
}

export const socketService = SocketService.getInstance();
export type { SocketEvents };

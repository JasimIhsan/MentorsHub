import { Server, Socket } from "socket.io";

export function handleSignaling(io: Server, socket: Socket) {
	socket.on("join-room", (roomId: string, userData: { name: string; isMentor: boolean }) => {
		socket.join(roomId);
		socket.to(roomId).emit("user-joined", socket.id, userData);
		console.log(`User ${socket.id} joined room ${roomId}`);

		socket.on("send-offer", (data) => {
			socket.to(data.target).emit("receive-offer", {
				offer: data.offer,
				sender: socket.id,
			});
		});

		socket.on("send-answer", (data) => {
			socket.to(data.target).emit("receive-answer", {
				answer: data.answer,
				sender: socket.id,
			});
		});

		socket.on("send-ice-candidate", (data) => {
			socket.to(data.target).emit("receive-ice-candidate", {
				candidate: data.candidate,
				sender: socket.id,
			});
		});

		socket.on("user-join-request", (data: { sessionId: string; userId: string; userName: string }) => {
			socket.to(data.sessionId).emit("user-join-request", data);
			console.log(`Join request from ${data.userName} for session ${data.sessionId}`);
		});

		socket.on("approve-join", (data: { userId: string; sessionId: string }) => {
			socket.to(data.sessionId).emit("approve-join", { userId: data.userId });
		});

		socket.on("reject-join", (data: { userId: string; sessionId: string }) => {
			socket.to(data.sessionId).emit("reject-join", { userId: data.userId });
		});

		socket.on("session-started", (data: { sessionId: string }) => {
			socket.to(data.sessionId).emit("session-started", { sessionId: data.sessionId });
			console.log(`Session ${data.sessionId} started`);
		});

		socket.on("disconnect", () => {
			socket.broadcast.emit("user-left", socket.id);
			console.log(`User ${socket.id} disconnected`);
		});
	});
}

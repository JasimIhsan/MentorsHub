import { Server, Socket } from "socket.io";
import { Model } from "mongoose";
import { ISessionDocument } from "../database/models/session/session.model";

// Define types for session and active call storage
interface SessionParticipant {
    userId: string;
    peerId: string;
    socketId: string;
    role: "mentor" | "user";
    isApproved?: boolean;
    name: string;
    avatar?: string;
}

interface Sessions {
    [sessionId: string]: SessionParticipant[];
}

interface ActiveCalls {
    [sessionId: string]: string;
}

const sessions: Sessions = {};
const activeCalls: ActiveCalls = {};

const initializeSocket = (io: Server, SessionModel: Model<ISessionDocument>) => {
    io.on("connection", (socket: Socket) => {
        console.log(`✅ User connected: ${socket.id}`);

        socket.on("join-session", async ({ sessionId, userId, peerId, role, name, avatar }: {
            sessionId: string;
            userId: string;
            peerId: string;
            role: "mentor" | "user";
            name: string;
            avatar?: string;
        }) => {
            console.log(`Received join-session: sessionId=${sessionId}, userId=${userId}, socketId=${socket.id}, peerId=${peerId}`);

            try {
                const session = await SessionModel.findById(sessionId);
                if (!session) {
                    socket.emit("error", { message: "Session not found" });
                    return;
                }

                if (!["upcoming", "ongoing"].includes(session.status)) {
                    socket.emit("error", { message: "Session payment is not completed" });
                    return;
                }

                if (!sessions[sessionId]) {
                    sessions[sessionId] = [];
                }

                if (role === "mentor") {
                    if (session.mentorId.toString() !== userId) {
                        socket.emit("error", { message: "You are not the mentor for this session" });
                        return;
                    }

                    const mentorIndex = sessions[sessionId].findIndex((p) => p.userId === userId && p.role === "mentor");
                    if (mentorIndex !== -1) {
                        sessions[sessionId][mentorIndex] = {
                            ...sessions[sessionId][mentorIndex],
                            socketId: socket.id,
                            peerId,
                            name,
                            avatar,
                        };
                    } else {
                        sessions[sessionId].push({
                            userId,
                            peerId,
                            socketId: socket.id,
                            role,
                            isApproved: true,
                            name,
                            avatar,
                        });
                    }

                    activeCalls[sessionId] = socket.id;
                    socket.join(sessionId);
                    socket.data.sessionId = sessionId;
                    socket.data.userId = userId;
                    socket.data.role = role;

                    console.log(`👩‍🎓 Mentor ${userId} joined session ${sessionId}`);
                } else {
                    const userIndex = sessions[sessionId].findIndex((p) => p.userId === userId);
                    if (userIndex !== -1) {
                        sessions[sessionId][userIndex] = {
                            ...sessions[sessionId][userIndex],
                            socketId: socket.id,
                            peerId,
                            name,
                            avatar,
                        };
                    } else {
                        sessions[sessionId].push({
                            userId,
                            peerId,
                            socketId: socket.id,
                            role,
                            isApproved: false,
                            name,
                            avatar,
                        });
                    }

                    socket.data.sessionId = sessionId;
                    socket.data.userId = userId;
                    socket.data.role = role;

                    const mentor = sessions[sessionId].find((p) => p.role === "mentor");
                    if (mentor) {
                        io.to(mentor.socketId).emit("join-request", {
                            userId,
                            sessionId,
                            peerId,
                            name,
                            avatar,
                        });
                    } else {
                        socket.emit("error", { message: "Mentor not available. Please wait." });
                    }

                    console.log(`🫴 User ${userId} requested to join session ${sessionId}`);
                }
            } catch (error: any) {
                console.error(`Error in join-session: ${error.message}`);
                socket.emit("error", { message: "Failed to join session" });
            }
        });

        socket.on("approve-join", ({ userId, sessionId, approve, mentorPeerId }: {
            userId: string;
            sessionId: string;
            approve: boolean;
            mentorPeerId: string;
        }) => {
            if (socket.data.role !== "mentor") {
                socket.emit("error", { message: "Only mentors can approve joins" });
                return;
            }

            const sessionParticipants = sessions[sessionId];
            if (!sessionParticipants) {
                socket.emit("error", { message: "Session not found" });
                return;
            }

            const user = sessionParticipants.find((p) => p.userId === userId);
            if (!user) {
                socket.emit("error", { message: "User not found in session" });
                return;
            }

            if (approve) {
                user.isApproved = true;
                io.to(user.socketId).emit("join-approved", { sessionId, mentorPeerId });
                const userSocket = io.sockets.sockets.get(user.socketId);
                if (userSocket) {
                    userSocket.join(sessionId);
                }
                io.to(sessionId).emit("user-joined", { peerId: user.peerId, name: user.name, avatar: user.avatar });
                console.log(`User ${userId} approved for session ${sessionId}`);
            } else {
                const userSocket = io.sockets.sockets.get(user.socketId);
                if (userSocket) {
                    io.to(user.socketId).emit("join-rejected", { message: "Mentor rejected your join request" });
                }
                sessions[sessionId] = sessionParticipants.filter((p) => p.userId !== userId);
                console.log(`🫴❌ User ${userId} rejected for session ${sessionId}`);
            }
        });

        socket.on("mute-status", ({ userId, isMuted }: { userId: string; isMuted: boolean }) => {
            socket.to(socket.data.sessionId).emit("mute-status", { userId, isMuted });
        });

        socket.on("video-status", ({ userId, isVideoOn }: { userId: string; isVideoOn: boolean }) => {
            socket.to(socket.data.sessionId).emit("video-status", { userId, isVideoOn });
        });

        socket.on("hand-raise-status", ({ userId, isHandRaised }: { userId: string; isHandRaised: boolean }) => {
            socket.to(socket.data.sessionId).emit("hand-raise-status", { userId, isHandRaised });
        });

        socket.on("disconnect", (reason) => {
            const { sessionId, userId, role } = socket.data as { sessionId?: string; userId?: string; role?: "mentor" | "user" };

            if (sessionId && sessions[sessionId]) {
                const user = sessions[sessionId].find((participant) => participant.userId === userId);
                sessions[sessionId] = sessions[sessionId].filter((participant) => participant.userId !== userId);

                if (role === "mentor" && activeCalls[sessionId]) {
                    delete activeCalls[sessionId];
                }

                if (sessions[sessionId].length === 0) {
                    delete sessions[sessionId];
                }

                socket.to(sessionId).emit("user-disconnected", { name: user?.name, avatar: user?.avatar });
            }
            console.log(`❌ User disconnected: ${socket.id}, reason: ${reason}`);
        });

        socket.on("reconnect-session", async ({ sessionId, userId, peerId, role, name, avatar }: {
            sessionId: string;
            userId: string;
            peerId: string;
            role: "mentor" | "user";
            name: string;
            avatar?: string;
        }) => {
            try {
                const session = await SessionModel.findById(sessionId);
                if (!session) {
                    socket.emit("error", { message: "Session does not exist" });
                    return;
                }

                if (!sessions[sessionId]) {
                    socket.emit("error", { message: "Session is no longer active" });
                    return;
                }

                const existingParticipantIndex = sessions[sessionId].findIndex((p) => p.userId === userId);
                if (existingParticipantIndex !== -1) {
                    sessions[sessionId][existingParticipantIndex] = {
                        ...sessions[sessionId][existingParticipantIndex],
                        peerId,
                        socketId: socket.id,
                        name,
                        avatar,
                    };
                } else {
                    sessions[sessionId].push({
                        userId,
                        peerId,
                        socketId: socket.id,
                        role,
                        isApproved: role === "mentor" ? true : false,
                        name,
                        avatar,
                    });
                }

                socket.data.sessionId = sessionId;
                socket.data.userId = userId;
                socket.data.role = role;

                if (role === "mentor") {
                    activeCalls[sessionId] = socket.id;
                    const users = sessions[sessionId].filter((p) => p.role === "user" && p.isApproved);
                    for (const user of users) {
                        io.to(user.socketId).emit("join-approved", { sessionId, mentorPeerId: peerId });
                    }
                }

                socket.join(sessionId);
                socket.emit("reconnect-success", { sessionId });

                if (role === "user" && sessions[sessionId].find((p) => p.userId === userId)?.isApproved) {
                    const mentor = sessions[sessionId].find((p) => p.role === "mentor");
                    if (mentor) {
                        socket.emit("join-approved", { sessionId, mentorPeerId: mentor.peerId });
                    }
                }

                console.log(`User ${userId} reconnected to session ${sessionId}`);
            } catch (error: any) {
                socket.emit("error", { message: "Failed to reconnect" });
            }
        });

        socket.on("error", (error: Error) => {
            console.error(`Socket error for ${socket.id}: ${error.message}`);
            socket.emit("error", { message: error.message });
        });

        socket.on("connect_error", (error: Error) => {
            console.error(`Connect error for ${socket.id}: ${error.message}`);
        });
    });
};

export default initializeSocket;
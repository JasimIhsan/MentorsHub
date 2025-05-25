import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Peer, { MediaConnection } from "peerjs";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, ScreenShareIcon, HandIcon, ListIcon, PhoneOffIcon, UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/api/config/api.config";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const VideoCallPage = () => {
	const { sessionId } = useParams<{ sessionId: string }>();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [peer, setPeer] = useState<Peer | null>(null);
	const [call, setCall] = useState<MediaConnection | null>(null);
	const [isMuted, setIsMuted] = useState(false);
	const [isVideoOn, setIsVideoOn] = useState(true);
	const [isRemoteMuted, setIsRemoteMuted] = useState(false);
	const [isRemoteVideoOn, setIsRemoteVideoOn] = useState(true);
	const [isRemoteHandRaised, setIsRemoteHandRaised] = useState(false);
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const waitingVideoRef = useRef<HTMLVideoElement>(null);
	const localStreamRef = useRef<MediaStream | null>(null);
	const user = useSelector((state: RootState) => state.auth.user);
	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isHandRaised, setIsHandRaised] = useState(false);
	const [activeSpeaker, setActiveSpeaker] = useState<"local" | "remote" | null>(null);
	const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "reconnecting">("disconnected");
	const [joinRequests, setJoinRequests] = useState<{ userId: string; sessionId: string; peerId: string; name: string; avatar?: string }[]>([]);
	const [showJoinRequestDrawer, setShowJoinRequestDrawer] = useState(false);
	const [isUserWaiting, setIsUserWaiting] = useState(false);
	const [isRejected, setIsRejected] = useState(false);
	const [role, setRole] = useState<"mentor" | "user" | null>(null);
	const [hasRequestedJoin, setHasRequestedJoin] = useState(false);
	const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);

	const navigate = useNavigate();

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				localStreamRef.current = stream;
				if (isUserWaiting && waitingVideoRef.current) {
					waitingVideoRef.current.srcObject = stream;
					waitingVideoRef.current.play().catch((err) => console.error("Error playing waiting video:", err));
					stream.getAudioTracks().forEach((track) => (track.enabled = !isMuted));
					stream.getVideoTracks().forEach((track) => (track.enabled = isVideoOn)); // Note: Changed to isVideoOn
				} else if (!isUserWaiting && localVideoRef.current) {
					localVideoRef.current.srcObject = stream;
					localVideoRef.current.play().catch((err) => console.error("Error playing local video:", err));
					stream.getAudioTracks().forEach((track) => (track.enabled = !isMuted));
					stream.getVideoTracks().forEach((track) => (track.enabled = isVideoOn));
				}
				setupAudioLevelDetection(stream, "local");
			})
			.catch((error) => {
				console.error("Error accessing media devices:", error);
				toast.error("Failed to access camera or microphone. Please check permissions.");
			});

		return () => {
			if (localStreamRef.current) {
				localStreamRef.current.getTracks().forEach((track) => track.stop());
				localStreamRef.current = null;
			}
		};
	}, [isUserWaiting, isMuted, isVideoOn]);

	useEffect(() => {
		if (!isUserWaiting && localStreamRef.current && localVideoRef.current) {
			localVideoRef.current.srcObject = localStreamRef.current;
		}
	}, [isUserWaiting]);

	useEffect(() => {
		if (!user) {
			toast.error("Please login first. Redirecting...");
			navigate("/authenticate", { replace: true });
			return;
		}

		let newSocket: Socket | null = null;
		let newPeer: Peer | null = null;

		const determineRole = async (): Promise<"mentor" | "user" | null> => {
			try {
				const response = await axiosInstance.get(`/user/sessions/${sessionId}`);
				const session = response.data.session;
				console.log("Session data:", session); // Debug log
				if (session.mentorId._id === user.id) {
					setRole("mentor");
					console.log("Role set to mentor for user:", user.id);
					return "mentor";
				} else {
					setRole("user");
					setIsUserWaiting(true);
					console.log("Role set to user for user:", user.id);
					return "user";
				}
			} catch (error) {
				console.error("Error determining role:", error);
				toast.error("Failed to verify session role");
				navigate("/sessions", { replace: true });
				return null;
			}
		};

		const initializeConnections = async () => {
			const determinedRole = await determineRole();
			if (!determinedRole) return;

			newSocket = io("http://localhost:5858", {
				withCredentials: true,
				transports: ["websocket"],
				reconnection: true,
				reconnectionAttempts: 5,
				reconnectionDelay: 1000,
			});
			setSocket(newSocket);

			newPeer = new Peer({
				host: "0.peerjs.com",
				secure: true,
			});

			newPeer.on("open", (peerId) => {
				console.log(`PeerJS connected with ID: ${peerId}`);
				// console.log("Emitting join-session with:", { sessionId, userId: user.id, peerId, role: determinedRole });
				if (determinedRole === "mentor") {
					newSocket?.emit("join-session", {
						sessionId,
						userId: user.id,
						peerId,
						role: determinedRole,
						name: (user.firstName || "") + " " + (user.lastName || ""),
						avatar: user.avatar,
					});
					setConnectionStatus("connected");
				}
			});

			newPeer.on("error", (error) => {
				console.error("PeerJS error:", error);
				setConnectionStatus("disconnected");
				toast.error("Peer connection error. Attempting to reconnect...");
				attemptReconnect(newSocket, newPeer, determinedRole);
			});

			newSocket.on("connect", () => {
				console.log("Socket.IO connected");
				setConnectionStatus("connected");
			});

			newSocket.on("connect_error", (err) => {
				console.error("Socket.IO connect_error:", err.message);
				setConnectionStatus("disconnected");
				toast.error("Lost connection to server. Reconnecting...");
				attemptReconnect(newSocket, newPeer, determinedRole);
			});

			setPeer(newPeer);
		};

		initializeConnections();

		return () => {
			if (newSocket) newSocket.disconnect();
			if (newPeer) newPeer.destroy();
		};
	}, [sessionId, user, navigate]);

	useEffect(() => {
		if (!peer || !socket) return;

		peer.on("call", (incomingCall) => {
			if (localStreamRef.current) {
				console.log("Received incoming call from:", incomingCall.peer);
				incomingCall.answer(localStreamRef.current);
				setCall(incomingCall);

				incomingCall.on("stream", (remoteStream) => {
					if (remoteVideoRef.current) {
						console.log("Assigning remote stream to remoteVideoRef");
						remoteVideoRef.current.srcObject = remoteStream;
						setupAudioLevelDetection(remoteStream, "remote");
					} else {
						console.error("remoteVideoRef.current is not available");
						toast.error("Failed to display remote video");
					}
				});
				incomingCall.on("error", (err) => {
					console.error("Call error:", err);
					toast.error("Error in video call");
				});
			} else {
				console.error("localStreamRef.current is not available");
				toast.error("Local stream not available");
			}
		});

		socket.on("user-joined", ({ peerId, name, avatar }: { peerId: string; name: string; avatar?: string }) => {
			if (peer && localStreamRef.current && role === "mentor") {
				console.log(`Initiating call to peerId: ${peerId}`);
				initiateCall(peerId, 0);
				toast.success(
					<div className="flex items-center gap-2">
						<Avatar className="w-6 h-6">{avatar ? <AvatarImage src={avatar} alt={name} /> : <AvatarFallback className="bg-gray-300 text-white text-xs">{name[0]?.toUpperCase() || "U"}</AvatarFallback>}</Avatar>
						<span>{`${name} has joined the session`}</span>
					</div>
				);
			}
		});

		socket.on("join-approved", ({ mentorPeerId }: { mentorPeerId: string | null }) => {
			setIsUserWaiting(false);
			setIsRejected(false);
			toast.success("You have been approved to join the session!");
			if (role === "user" && peer && localStreamRef.current && mentorPeerId) {
				console.log(`User initiating call to mentor peerId: ${mentorPeerId}`);
				initiateCall(mentorPeerId, 0);
			}
		});

		socket.on("join-rejected", ({ message }: { message: string }) => {
			setIsUserWaiting(false);
			setHasRequestedJoin(false);
			setIsRejected(true);
			setRejectionMessage(message);
			toast.error(message);
			setTimeout(() => {
				navigate("/sessions", { replace: true });
			}, 5000);
		});

		socket.on("user-disconnected", ({ userId }: { userId: string }) => {
			toast.info(`User ${userId} has disconnected`);
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = null;
			}
		});

		socket.on("mute-status", ({ isMuted }: { isMuted: boolean }) => {
			setIsRemoteMuted(isMuted);
		});

		socket.on("video-status", ({ isVideoOn }: { isVideoOn: boolean }) => {
			setIsRemoteVideoOn(isVideoOn);
		});

		socket.on("hand-raise-status", ({ isHandRaised }: { isHandRaised: boolean }) => {
			setIsRemoteHandRaised(isHandRaised);
		});

		socket.on("error", ({ message }: { message: string }) => {
			toast.error(message);
			navigate("/dashboard", { replace: true });
		});

		socket.on("join-request", ({ userId, sessionId: requestSessionId, peerId, name, avatar }: { userId: string; sessionId: string; peerId: string; name: string; avatar: string }) => {
			console.log("Received join-request:", { userId, requestSessionId, peerId, role, name, avatar }); // Debug log
			if (role === "mentor" && requestSessionId === sessionId) {
				setJoinRequests((prev) => {
					const newRequest = { userId, sessionId: requestSessionId, peerId, name, avatar };
					if (prev.some((req) => req.userId === userId)) {
						console.log("Duplicate join request ignored for user:", userId);
						return prev;
					}
					console.log("Adding new join request:", newRequest);
					return [...prev, newRequest];
				});
				setShowJoinRequestDrawer(true);
				// toast.info(
				// 	<div className="flex items-center gap-2">
				// 		<Avatar className="w-6 h-6">{avatar ? <AvatarImage src={avatar} alt={name} /> : <AvatarFallback className="bg-gray-300 text-white text-xs">{name[0]?.toUpperCase() || "U"}</AvatarFallback>}</Avatar>
				// 		<span>{`${name} has requested to join the session`}</span>
				// 	</div>
				// );
			} else {
				console.log("Ignoring join-request: not a mentor or session mismatch", { role, requestSessionId, sessionId });
			}
		});

		socket.on("reconnect-success", () => {
			setConnectionStatus("connected");
			toast.success("Reconnected to session!");
		});

		return () => {
			socket.off("user-joined");
			socket.off("user-disconnected");
			socket.off("mute-status");
			socket.off("video-status");
			socket.off("hand-raise-status");
			socket.off("error");
			socket.off("join-request");
			socket.off("join-approved");
			socket.off("join-rejected");
			socket.off("reconnect-success");
			peer.off("call");
		};
	}, [peer, socket, role, sessionId, navigate]);

	const initiateCall = (peerId: string, retryCount: number) => {
		if (retryCount >= 3) {
			console.error(`Failed to initiate call to peerId: ${peerId} after 3 retries`);
			toast.error("Failed to connect video call");
			return;
		}
		if (!peer || !localStreamRef.current) {
			console.error("Cannot initiate call: peer or local stream missing");
			setTimeout(() => initiateCall(peerId, retryCount + 1), 2000);
			return;
		}
		const outgoingCall = peer.call(peerId, localStreamRef.current);
		if (outgoingCall) {
			setCall(outgoingCall);
			outgoingCall.on("stream", (remoteStream) => {
				if (remoteVideoRef.current) {
					console.log("Assigning remote stream from outgoing call");
					remoteVideoRef.current.srcObject = remoteStream;
					setupAudioLevelDetection(remoteStream, "remote");
				} else {
					console.error("remoteVideoRef.current is not available, retrying...");
					setTimeout(() => initiateCall(peerId, retryCount + 1), 2000);
				}
			});
			outgoingCall.on("error", (err) => {
				console.error("Outgoing call error:", err);
				toast.error("Error initiating video call");
				setTimeout(() => initiateCall(peerId, retryCount + 1), 2000);
			});
		} else {
			console.error("Failed to initiate call to peerId:", peerId);
			setTimeout(() => initiateCall(peerId, retryCount + 1), 2000);
		}
	};

	const attemptReconnect = (socket: Socket | null, peer: Peer | null, determinedRole: "mentor" | "user" | null) => {
		if (!socket || !peer || !determinedRole) return;
		setConnectionStatus("reconnecting");
		const reconnectInterval = setInterval(() => {
			if (connectionStatus === "connected") {
				clearInterval(reconnectInterval);
				return;
			}
			console.log(`Attempting to reconnect for session ${sessionId}`);
			socket.emit("reconnect-session", {
				sessionId,
				userId: user?.id,
				peerId: peer.id,
				role: determinedRole,
			});
		}, 5000);
	};

	const setupAudioLevelDetection = (stream: MediaStream, type: "local" | "remote") => {
		const audioContext = new AudioContext();
		const source = audioContext.createMediaStreamSource(stream);
		const analyser = audioContext.createAnalyser();
		analyser.fftSize = 512;
		source.connect(analyser);

		const dataArray = new Uint8Array(analyser.frequencyBinCount);
		let isDetecting = true;

		const detectAudioLevel = () => {
			if (!isDetecting) return;
			analyser.getByteFrequencyData(dataArray);
			const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
			if (average > 25) {
				setActiveSpeaker(type);
			} else if (activeSpeaker === type) {
				setActiveSpeaker(null);
			}
			requestAnimationFrame(detectAudioLevel);
		};
		detectAudioLevel();

		return () => {
			isDetecting = false;
			source.disconnect();
			audioContext.close();
		};
	};

	const toggleMute = () => {
		if (localStreamRef.current) {
			const audioTracks = localStreamRef.current.getAudioTracks();
			audioTracks.forEach((track) => {
				track.enabled = !track.enabled;
			});
			setIsMuted(!isMuted);
			socket?.emit("mute-status", { userId: user?.id, isMuted: !isMuted });
		}
	};

	const toggleVideo = () => {
		if (localStreamRef.current) {
			const videoTracks = localStreamRef.current.getVideoTracks();
			videoTracks.forEach((track) => {
				track.enabled = !track.enabled;
			});
			setIsVideoOn(!isVideoOn);
			socket?.emit("video-status", { userId: user?.id, isVideoOn: !isVideoOn });
		}
	};

	const toggleRaiseHand = () => {
		setIsHandRaised(!isHandRaised);
		socket?.emit("hand-raise-status", { userId: user?.id, isHandRaised: !isHandRaised });
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
		toast.info(isSidebarOpen ? "Sidebar hidden" : "Sidebar shown");
	};

	const toggleScreenShare = async () => {
		if (!isScreenSharing) {
			try {
				const screenStream = await navigator.mediaDevices.getDisplayMedia({
					video: true,
					audio: true,
				});
				localStreamRef.current = screenStream;
				if (localVideoRef.current) {
					localVideoRef.current.srcObject = screenStream;
				}
				if (call && peer && localStreamRef.current) {
					const outgoingCall = peer.call(call.peer, localStreamRef.current);
					setCall(outgoingCall);
				}
				setIsScreenSharing(true);
			} catch (error) {
				console.error("Error starting screen share:", error);
				toast.error("Failed to start screen sharing");
			}
		} else {
			localStreamRef.current?.getTracks().forEach((track) => track.stop());
			try {
				const cameraStream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});
				localStreamRef.current = cameraStream;
				if (localVideoRef.current) {
					localVideoRef.current.srcObject = cameraStream;
				}
				if (call && peer && localStreamRef.current) {
					const outgoingCall = peer.call(call.peer, localStreamRef.current);
					setCall(outgoingCall);
				}
				setIsScreenSharing(false);
			} catch (error) {
				console.error("Error reverting to camera:", error);
				toast.error("Failed to revert to camera");
			}
		}
	};

	const endCall = () => {
		if (call) call.close();
		if (localStreamRef.current) {
			localStreamRef.current.getTracks().forEach((track) => track.stop());
			localStreamRef.current = null;
		}
		if (socket) socket.disconnect();
		if (peer) peer.destroy();
		navigate("/sessions", { replace: true });
	};

	const handleJoinRequest = (request: { userId: string; sessionId: string; peerId: string }, approve: boolean) => {
		console.log("Handling join request:", { request, approve }); // Debug log
		socket?.emit("approve-join", {
			userId: request.userId,
			sessionId: request.sessionId,
			approve,
			mentorPeerId: peer?.id,
		});
		setJoinRequests((prev) => {
			const newRequests = prev.filter((req) => req.userId !== request.userId);
			console.log("Updated joinRequests:", newRequests); // Debug log
			if (newRequests.length === 0) {
				setShowJoinRequestDrawer(false);
			}
			return newRequests;
		});
		toast.info(approve ? `Approved join request for user ${request.userId}` : `Rejected join request for user ${request.userId}`);
	};

	const handleAskToJoin = () => {
		if (hasRequestedJoin) {
			toast.info("Join request already sent");
			return;
		}
		if (socket && peer && user) {
			console.log(`Asking user ${user.id} to join session ${sessionId}`);
			socket.emit("join-session", {
				sessionId,
				userId: user.id,
				peerId: peer.id,
				role,
				name: (user.firstName || "") + " " + (user.lastName || ""),
				avatar: user.avatar,
			});
			setHasRequestedJoin(true);
			// toast.info(`Sent join request to session`);
		}
	};

	const renderRemotePlaceholder = () => {
		if (isRemoteVideoOn) return null;
		return (
			<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-primary/50 to-primary/80 rounded-2xl">
				<div className="w-24 h-24 rounded-full bg-primary/90 flex items-center justify-center text-white text-4xl">{"U"}</div>
			</div>
		);
	};

	const renderLocalPlaceholder = () => {
		if (isVideoOn) return null;
		return (
			<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-primary/50 to-primary/80 rounded-2xl">
				<div className="w-24 h-24 rounded-full bg-primary/90 flex items-center justify-center text-white text-4xl">{"You"}</div>
			</div>
		);
	};

	if (isUserWaiting) {
		return (
			<WaitingRoom
				isRejected={isRejected}
				rejectionMessage={rejectionMessage}
				videoRef={waitingVideoRef}
				isMuted={isMuted}
				isVideoOn={isVideoOn}
				hasRequestedJoin={hasRequestedJoin}
				onToggleMute={toggleMute}
				onToggleVideo={toggleVideo}
				onAskToJoin={handleAskToJoin}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col">
			<div className="flex-1 relative">
				<div className={cn("absolute top-2 right-2 px-3 py-1 rounded-full text-sm", connectionStatus === "connected" ? "bg-green-500 text-white" : connectionStatus === "reconnecting" ? "bg-yellow-500 text-white" : "bg-red-500 text-white")}>
					{connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
				</div>
				<h1>SocketId: {socket?.id}</h1>
				<div className="flex justify-center items-center h-[calc(100vh-6rem)] space-x-4 p-8">
					<div className="relative flex-1 max-w-[50%]">
						<video ref={remoteVideoRef} autoPlay className="object-contain rounded-2xl w-full h-auto" />
						{renderRemotePlaceholder()}
						<span className="absolute bottom-2 left-2 text-white bg-black/60 px-2 py-1 rounded text-sm flex items-center gap-2">
							Remote
							{isRemoteMuted ? <MicOffIcon className="inline h-4 w-4" /> : <MicIcon className="inline h-4 w-4" />}
						</span>
						{isRemoteHandRaised && (
							<span className={`absolute bottom-2 right-2 p-1.5 rounded-full animate-bounce ${isRemoteVideoOn ? "bg-primary text-white" : "bg-white"}`}>
								<HandIcon className="h-5 w-5" />
							</span>
						)}
					</div>

					<div className="relative flex-1 max-w-[50%]">
						<video ref={localVideoRef} autoPlay muted className="object-cover rounded-2xl w-full h-auto" />
						{renderLocalPlaceholder()}
						<span className="absolute bottom-2 left-2 text-white bg-black/60 px-2 py-1 rounded text-sm flex items-center gap-2">
							{user?.firstName || "You"}
							{isMuted ? <MicOffIcon className="inline h-4 w-4" /> : <MicIcon className="inline h-4 w-4" />}
						</span>
						{isHandRaised && (
							<span className={`absolute bottom-2 right-2 p-1.5 rounded-full animate-bounce ${isVideoOn ? "bg-primary text-white" : "bg-white"}`}>
								<HandIcon className="h-5 w-5" />
							</span>
						)}
					</div>
				</div>

				<ControlBar
					isMuted={isMuted}
					isVideoOn={isVideoOn}
					isScreenSharing={isScreenSharing}
					isSidebarOpen={isSidebarOpen}
					isHandRaised={isHandRaised}
					role={role}
					joinRequestsCount={joinRequests.length}
					onToggleMute={toggleMute}
					onToggleVideo={toggleVideo}
					onToggleScreenShare={toggleScreenShare}
					onToggleSidebar={toggleSidebar}
					onToggleRaiseHand={toggleRaiseHand}
					onEndCall={endCall}
					onOpenJoinRequests={() => setShowJoinRequestDrawer(true)}
				/>

				{role === "mentor" && (
					<JoinRequestDrawer
						isOpen={showJoinRequestDrawer}
						onClose={() => setShowJoinRequestDrawer(false)}
						joinRequests={joinRequests}
						onApprove={(request) => handleJoinRequest(request, true)}
						onReject={(request) => handleJoinRequest(request, false)}
					/>
				)}
			</div>
		</div>
	);
};

interface WaitingRoomProps {
	isRejected: boolean;
	rejectionMessage: string | null;
	videoRef: React.RefObject<HTMLVideoElement | null>;
	isMuted: boolean;
	isVideoOn: boolean;
	hasRequestedJoin: boolean;
	onToggleMute: () => void;
	onToggleVideo: () => void;
	onAskToJoin: () => void;
}

const WaitingRoom = ({ isRejected, rejectionMessage, videoRef, isMuted, isVideoOn, hasRequestedJoin, onToggleMute, onToggleVideo, onAskToJoin }: WaitingRoomProps) => {
	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full transform transition-all hover:scale-[1.02]">
				{isRejected ? (
					<div className="text-center">
						<h2 className="text-3xl font-bold text-red-600 mb-4">Join Request Rejected</h2>
						<p className="text-gray-700 mb-4">{rejectionMessage || "The mentor has rejected your join request."}</p>
						<p className="text-gray-500">You will be redirected to the sessions page in a few seconds.</p>
					</div>
				) : (
					<>
						<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Prepare to Join Session</h2>
						<div className="relative mb-6 rounded-2xl overflow-hidden shadow-inner aspect-video">
							{isVideoOn ? (
								<video ref={videoRef} autoPlay muted className="w-full h-full object-cover" onError={(e) => console.error("Video error:", e)} />
							) : (
								<div className="absolute inset-0 flex items-center justify-center bg-gray-300 rounded-2xl">
									<div className="w-32 h-32 rounded-full bg-gray-400 flex items-center justify-center text-white text-5xl font-semibold">U</div>
								</div>
							)}
							<span className="absolute bottom-2 left-2 text-white bg-black/70 px-3 py-1 rounded-lg text-sm flex items-center gap-2">
								You
								{isMuted ? <MicOffIcon className="h-4 w-4" /> : <MicIcon className="h-4 w-4" />}
							</span>
						</div>
						<div className="flex justify-center gap-4 mb-6">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant={isMuted ? "destructive" : "secondary"} size="icon" onClick={onToggleMute} className="rounded-full h-12 w-12 bg-gray-100 hover:bg-gray-200">
											{isMuted ? <MicOffIcon className="text-gray-900" /> : <MicIcon className="text-gray-900" />}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>{isMuted ? "Unmute" : "Mute"}</p>
									</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant={isVideoOn ? "secondary" : "destructive"} size="icon" onClick={onToggleVideo} className="rounded-full h-12 w-12 bg-gray-100 hover:bg-gray-200">
											{isVideoOn ? <VideoIcon className="text-gray-900" /> : <VideoOffIcon className="text-gray-900" />}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>{isVideoOn ? "Turn off camera" : "Turn on camera"}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						{hasRequestedJoin ? (
							<div className="text-center">
								<Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
								<p className="text-gray-700 text-lg">Waiting for mentor approval...</p>
								<p className="text-gray-500 text-sm mt-2">Please wait while the mentor reviews your request.</p>
							</div>
						) : (
							<Button onClick={onAskToJoin} className="w-full text-white py-3 rounded-lg text-lg font-semibold" disabled={hasRequestedJoin}>
								Ask to Join Session
							</Button>
						)}
					</>
				)}
			</div>
		</div>
	);
};

interface JoinRequestDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	joinRequests: { userId: string; sessionId: string; peerId: string; name: string; avatar?: string }[];
	onApprove: (request: { userId: string; sessionId: string; peerId: string }) => void;
	onReject: (request: { userId: string; sessionId: string; peerId: string }) => void;
}

const JoinRequestDrawer = ({ isOpen, onClose, joinRequests, onApprove, onReject }: JoinRequestDrawerProps) => {
	return (
		<Drawer
			open={isOpen}
			onOpenChange={(open) => {
				if (!open && joinRequests.length > 0) return;
				onClose();
			}}
			direction="right">
			<DrawerContent className="w-[400px] h-full fixed right-0 top-0">
				<DrawerHeader>
					<DrawerTitle>Join Requests</DrawerTitle>
				</DrawerHeader>
				<div className="p-4 space-y-4 overflow-auto flex-1">
					{joinRequests.length === 0 ? (
						<p className="text-center text-sm text-muted-foreground">No pending join requests.</p>
					) : (
						joinRequests.map((request) => (
							<div key={request.userId} className="flex items-center justify-between p-2 border-b">
								<div className="flex items-center gap-2">
									<Avatar className="h-10 w-10">
										<AvatarImage src={request.avatar} alt={request.name} />
										<AvatarFallback>{request.name[0]}</AvatarFallback>
									</Avatar>
									<p className="font-medium">{request.name}</p>
								</div>
								<div className="flex gap-2">
									<Button size="sm" onClick={() => onApprove(request)}>
										Approve
									</Button>
									<Button size="sm" variant="destructive" onClick={() => onReject(request)}>
										Reject
									</Button>
								</div>
							</div>
						))
					)}
				</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline" onClick={onClose}>
							Close
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

interface ControlBarProps {
	isMuted: boolean;
	isVideoOn: boolean;
	isScreenSharing: boolean;
	isSidebarOpen: boolean;
	isHandRaised: boolean;
	role: "mentor" | "user" | null;
	joinRequestsCount: number;
	onToggleMute: () => void;
	onToggleVideo: () => void;
	onToggleScreenShare: () => void;
	onToggleSidebar: () => void;
	onToggleRaiseHand: () => void;
	onEndCall: () => void;
	onOpenJoinRequests: () => void;
}

function ControlBar({ isMuted, isVideoOn, isScreenSharing, isSidebarOpen, isHandRaised, role, joinRequestsCount, onToggleMute, onToggleVideo, onToggleScreenShare, onToggleSidebar, onToggleRaiseHand, onEndCall, onOpenJoinRequests }: ControlBarProps) {
	return (
		<div className="fixed bottom-0 left-0 right-0 flex justify-center p-4 z-10">
			<div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg px-4 py-2 border border-gray-200 flex items-center gap-2">
				<TooltipProvider>
					<div className="flex items-center gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant={isMuted ? "destructive" : "secondary"} size="icon" onClick={onToggleMute} className="rounded-full h-12 w-12">
									{isMuted ? <MicOffIcon /> : <MicIcon />}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>{isMuted ? "Unmute" : "Mute"}</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant={isVideoOn ? "secondary" : "destructive"} size="icon" onClick={onToggleVideo} className="rounded-full h-12 w-12">
									{isVideoOn ? <VideoIcon /> : <VideoOffIcon />}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>{isVideoOn ? "Turn off camera" : "Turn on camera"}</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant={isScreenSharing ? "destructive" : "secondary"} size="icon" onClick={onToggleScreenShare} className="rounded-full h-12 w-12">
									<ScreenShareIcon />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>{isScreenSharing ? "Stop sharing" : "Share screen"}</p>
							</TooltipContent>
						</Tooltip>
					</div>
					<div className="h-8 w-px bg-gray-200 mx-2"></div>
					<div className="flex items-center gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant={isHandRaised ? "default" : "secondary"} size="icon" onClick={onToggleRaiseHand} className="rounded-full h-10 w-10">
									<HandIcon className={cn("h-5 w-5", isHandRaised && "text-white")} />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>{isHandRaised ? "Lower hand" : "Raise hand"}</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant={isSidebarOpen ? "default" : "secondary"} size="icon" onClick={onToggleSidebar} className="rounded-full h-10 w-10">
									<ListIcon className={cn("h-5 w-5", isSidebarOpen && "text-white")} />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>{isSidebarOpen ? "Hide goals" : "Show goals"}</p>
							</TooltipContent>
						</Tooltip>
						{role === "mentor" && (
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant={joinRequestsCount > 0 ? "default" : "secondary"} size="icon" onClick={onOpenJoinRequests} className="rounded-full h-10 w-10 relative">
										<UsersIcon className={cn("h-5 w-5", joinRequestsCount > 0 && "text-white")} />
										{joinRequestsCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{joinRequestsCount}</span>}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>View join requests</p>
								</TooltipContent>
							</Tooltip>
						)}
					</div>
					<div className="h-8 w-px bg-gray-200 mx-2"></div>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="destructive" size="icon" onClick={onEndCall} className="rounded-full h-12 w-12">
								<PhoneOffIcon />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>End call</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
}

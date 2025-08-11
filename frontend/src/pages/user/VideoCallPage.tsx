import { useEffect, useRef, useState } from "react";
import Peer, { MediaConnection } from "peerjs";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { MicIcon, MicOffIcon, HandIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/api/config/api.config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocket } from "@/context/SocketContext";
import { ControlBar } from "@/components/user/video-call/ControllBar";
import { JoinRequestDrawer } from "@/components/user/video-call/JoinRequestModal";
import { WaitingRoom } from "@/components/user/video-call/WaitingRoom";

export const VideoCallPage = () => {
	const { sessionId } = useParams<{ sessionId: string }>();
	const { socket, isConnected } = useSocket();
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
	const user = useSelector((state: RootState) => state.userAuth.user);
	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isHandRaised, setIsHandRaised] = useState(false);
	const [isUserWaiting, setIsUserWaiting] = useState(false);
	const [isRejected, setIsRejected] = useState(false);
	const [joinRequests, setJoinRequests] = useState<{ userId: string; sessionId: string; peerId: string; name: string; avatar?: string }[]>([]);
	const [showJoinRequestDrawer, setShowJoinRequestDrawer] = useState(false);
	const [hasRequestedJoin, setHasRequestedJoin] = useState(false);
	const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
	const [remoteParticipant, setRemoteParticipant] = useState<{ name: string; avatar: string }>({ name: "", avatar: "" });
	const [role, setRole] = useState<"mentor" | "user" | null>(null);
	const [isScreenRecording, setIsScreenRecording] = useState(false); // Track screen recording state
	const screenRecorderRef = useRef<MediaRecorder | null>(null); // Reference to screen MediaRecorder
	const screenRecordedChunksRef = useRef<Blob[]>([]); // Store screen recorded data chunks
	const navigate = useNavigate();

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				localStreamRef.current = stream;
				if (isUserWaiting && waitingVideoRef.current) {
					waitingVideoRef.current.srcObject = stream;
					waitingVideoRef.current.play().catch((err) => console.error("Error playing waiting video:", err));
				} else if (!isUserWaiting && localVideoRef.current) {
					localVideoRef.current.srcObject = stream;
					localVideoRef.current.play().catch((err) => console.error("Error playing local video:", err));
				}
				stream.getAudioTracks().forEach((track) => (track.enabled = !isMuted));
				stream.getVideoTracks().forEach((track) => (track.enabled = isVideoOn));
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
			if (screenRecorderRef.current && screenRecorderRef.current.state === "recording") {
				screenRecorderRef.current.stop();
			}
		};
	}, [isUserWaiting]);

	useEffect(() => {
		if (!socket) return;
		if (user) {
			socket.emit("mute-status", { userId: user.id, isMuted });
		}
	}, [isMuted, socket, user]);

	useEffect(() => {
		if (!socket) return;
		if (user) {
			socket.emit("video-status", { userId: user.id, isVideoOn });
		}
	}, [isVideoOn, socket, user]);

	useEffect(() => {
		if (!user) {
			toast.error("Please login first. Redirecting...");
			navigate("/authenticate", { replace: true });
			return;
		}

		let newPeer: Peer | null = null;

		const determineRole = async (): Promise<"mentor" | "user" | null> => {
			try {
				const response = await axiosInstance.get(`/user/sessions/session/${sessionId}`);
				console.log("response: ", response);
				const session = response.data.session;
				console.log(`mentorId : `, session.mentor._id);
				console.log(`userId : `, user.id);
				if (session.mentor._id === user.id) {
					setRole("mentor");
					return "mentor";
				} else {
					setRole("user");
					setIsUserWaiting(true);
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
			if (!determinedRole || !socket) return;

			newPeer = new Peer({
				host: "0.peerjs.com",
				secure: true,
			});

			newPeer.on("open", (peerId) => {
				if (isConnected && determinedRole === "mentor") {
					socket.emit("join-session", {
						sessionId,
						userId: user.id,
						peerId,
						role: determinedRole,
						name: `${user.firstName || ""} ${user.lastName || ""}`,
						avatar: user.avatar,
					});
				}
			});

			newPeer.on("error", (error) => {
				console.error("PeerJS error:", error);
				toast.error("Peer connection error. Attempting to reconnect...");
				attemptReconnect(newPeer, determinedRole);
			});

			setPeer(newPeer);
		};

		initializeConnections();

		return () => {
			if (newPeer) newPeer.destroy();
		};
	}, [sessionId, user, navigate, socket, isConnected]);

	useEffect(() => {
		if (!peer || !socket || !role) return;

		const unsubscribes: Array<() => void> = [];

		peer.on("call", (incomingCall) => {
			if (localStreamRef.current) {
				incomingCall.answer(localStreamRef.current);
				setCall(incomingCall);

				incomingCall.on("stream", (remoteStream) => {
					if (remoteVideoRef.current) {
						remoteVideoRef.current.srcObject = remoteStream;
					} else {
						toast.error("Failed to display remote video");
					}
				});
				incomingCall.on("error", () => {
					toast.error("Error in video call");
				});
			} else {
				toast.error("Local stream not available");
			}
		});

		// Handle user-joined event
		unsubscribes.push(() => socket.off("user-joined"));
		socket.on("user-joined", ({ peerId, name, avatar }: { peerId: string; name: string; avatar?: string }) => {
			if (peer && localStreamRef.current && role === "mentor") {
				initiateCall(peerId, 0);
				setRemoteParticipant({ name, avatar: avatar as string });
				toast.success(
					<div className="flex items-center gap-2">
						<Avatar className="w-6 h-6">{avatar ? <AvatarImage src={avatar} alt={name} /> : <AvatarFallback className="bg-gray-300 text-white text-xs">{name[0]?.toUpperCase() || "U"}</AvatarFallback>}</Avatar>
						<span>{`${name} has joined the session`}</span>
					</div>
				);
			}
		});

		// Handle join-approved event
		unsubscribes.push(() => socket.off("join-approved"));
		socket.on("join-approved", ({ mentorPeerId }: { mentorPeerId: string | null }) => {
			setIsUserWaiting(false);
			setIsRejected(false);
			toast.success("You have been approved to join the session!");
			if (role === "user" && peer && localStreamRef.current && mentorPeerId) {
				initiateCall(mentorPeerId, 0);
			}
		});

		// Handle join-rejected event
		unsubscribes.push(() => socket.off("join-rejected"));
		socket.on("join-rejected", ({ message }: { message: string }) => {
			setIsUserWaiting(true);
			setHasRequestedJoin(false);
			setIsRejected(true);
			setRejectionMessage(message);
			toast.error(message);
			setTimeout(() => {
				navigate("/sessions", { replace: true });
			}, 5000);
		});

		// Handle user-disconnected event
		unsubscribes.push(() => socket.off("user-disconnected"));
		socket.on("user-disconnected", ({ name, avatar }: { name: string; avatar?: string }) => {
			toast.info(
				<div className="flex items-center gap-2">
					<Avatar className="w-6 h-6">{avatar ? <AvatarImage src={avatar} alt={name} /> : <AvatarFallback className="bg-gray-300 text-white text-xs">{name[0]?.toUpperCase() || "U"}</AvatarFallback>}</Avatar>
					<span>{`${name} has left the session`}</span>
				</div>
			);
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = null;
			}
		});

		// Handle mute-status event
		unsubscribes.push(() => socket.off("mute-status"));
		socket.on("mute-status", ({ isMuted }: { isMuted: boolean }) => {
			setIsRemoteMuted(isMuted);
		});

		// Handle video-status event
		unsubscribes.push(() => socket.off("video-status"));
		socket.on("video-status", ({ isVideoOn }: { isVideoOn: boolean }) => {
			setIsRemoteVideoOn(isVideoOn);
		});

		// Handle hand-raise-status event
		unsubscribes.push(() => socket.off("hand-raise-status"));
		socket.on("hand-raise-status", ({ isHandRaised }: { isHandRaised: boolean }) => {
			setIsRemoteHandRaised(isHandRaised);
		});

		// Handle error event
		unsubscribes.push(() => socket.off("error"));
		socket.on("error", ({ message }: { message: string }) => {
			toast.error(message);
			if (role === "user") navigate("/sessions", { replace: true });
			else navigate("/mentor/upcoming-sessions", { replace: true });
		});

		// Handle join-request event
		unsubscribes.push(() => socket.off("join-request"));
		socket.on("join-request", ({ userId, sessionId: requestSessionId, peerId, name, avatar }: { userId: string; sessionId: string; peerId: string; name: string; avatar?: string }) => {
			if (role === "mentor" && requestSessionId === sessionId) {
				setJoinRequests((prev) => {
					if (prev.some((req) => req.userId === userId)) {
						return prev;
					}
					return [...prev, { userId, sessionId: requestSessionId, peerId, name, avatar }];
				});
				setShowJoinRequestDrawer(true);
			}
		});

		// Handle reconnect-success event
		unsubscribes.push(() => socket.off("reconnect-success"));
		socket.on("reconnect-success", () => {
			toast.success("Reconnected to session!");
		});

		return () => {
			unsubscribes.forEach((unsubscribe) => unsubscribe());
		};
	}, [peer, socket, role, sessionId, navigate]);

	const initiateCall = (peerId: string, retryCount: number) => {
		if (retryCount >= 3) {
			toast.error("Failed to connect video call");
			return;
		}
		if (!peer || !localStreamRef.current) {
			setTimeout(() => initiateCall(peerId, retryCount + 1), 2000);
			return;
		}
		const outgoingCall = peer.call(peerId, localStreamRef.current);
		if (outgoingCall) {
			setCall(outgoingCall);
			outgoingCall.on("stream", (remoteStream) => {
				if (remoteVideoRef.current) {
					remoteVideoRef.current.srcObject = remoteStream;
				} else {
					setTimeout(() => initiateCall(peerId, retryCount + 1), 2000);
				}
			});
			outgoingCall.on("error", () => {
				toast.error("Error initiating video call");
				setTimeout(() => initiateCall(peerId, retryCount + 1), 2000);
			});
		} else {
			setTimeout(() => initiateCall(peerId, retryCount + 1), 2000);
		}
	};

	const attemptReconnect = (peer: Peer | null, determinedRole: "mentor" | "user" | null) => {
		if (!peer || !determinedRole || !socket || !user) return;
		const reconnectInterval = setInterval(() => {
			if (isConnected) {
				clearInterval(reconnectInterval);
				return;
			}
			socket.emit("reconnect-session", {
				sessionId,
				userId: user.id,
				peerId: peer.id,
				role: determinedRole,
			});
		}, 5000);
		return () => clearInterval(reconnectInterval);
	};

	const toggleMute = () => {
		if (localStreamRef.current) {
			const audioTracks = localStreamRef.current.getAudioTracks();
			audioTracks.forEach((track) => (track.enabled = !track.enabled));
			setIsMuted((prev) => !prev);
		}
	};

	const toggleVideo = () => {
		if (localStreamRef.current) {
			const videoTracks = localStreamRef.current.getVideoTracks();
			videoTracks.forEach((track) => (track.enabled = !track.enabled));
			setIsVideoOn((prev) => !prev);
		}
	};

	const toggleRaiseHand = () => {
		if (!socket || !user) return;
		setIsHandRaised((prev) => {
			socket.emit("hand-raise-status", { userId: user?.id, isHandRaised: !prev });
			return !prev;
		});
	};

	const toggleSidebar = () => {
		setIsSidebarOpen((prev) => {
			toast.info(prev ? "Sidebar hidden" : "Sidebar shown");
			return !prev;
		});
	};

	const toggleScreenShare = async () => {
		if (!call || !peer || !localStreamRef.current) return;

		if (!isScreenSharing) {
			try {
				const screenStream = await navigator.mediaDevices.getDisplayMedia({
					video: true,
					audio: true,
				});
				const videoTrack = screenStream.getVideoTracks()[0];
				const senders = call.peerConnection.getSenders();
				const videoSender = senders.find((sender) => sender.track?.kind === "video");
				if (videoSender) {
					await videoSender.replaceTrack(videoTrack);
					localStreamRef.current.getTracks().forEach((track) => track.stop());
					localStreamRef.current = screenStream;
					if (localVideoRef.current) {
						localVideoRef.current.srcObject = screenStream;
					}
					setIsScreenSharing(true);
				}
			} catch (error) {
				console.error("Error starting screen share:", error);
				toast.error("Failed to start screen sharing");
			}
		} else {
			try {
				const cameraStream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});
				const videoTrack = cameraStream.getVideoTracks()[0];
				const senders = call.peerConnection.getSenders();
				const videoSender = senders.find((sender) => sender.track?.kind === "video");
				if (videoSender) {
					await videoSender.replaceTrack(videoTrack);
					localStreamRef.current.getTracks().forEach((track) => track.stop());
					localStreamRef.current = cameraStream;
					if (localVideoRef.current) {
						localVideoRef.current.srcObject = cameraStream;
					}
					setIsScreenSharing(false);
				}
			} catch (error) {
				console.error("Error reverting to camera:", error);
				toast.error("Failed to revert to camera");
			}
		}
	};

	// Start screen recording
	const startScreenRecording = async () => {
		try {
			const screenStream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
				audio: true,
			});
			screenRecordedChunksRef.current = [];
			screenRecorderRef.current = new MediaRecorder(screenStream, { mimeType: "video/webm;codecs=vp8,opus" });

			// Collect data chunks
			screenRecorderRef.current.ondataavailable = (event) => {
				if (event.data.size > 0) {
					screenRecordedChunksRef.current.push(event.data);
				}
			};

			// Handle recording stop and create downloadable file
			screenRecorderRef.current.onstop = () => {
				const blob = new Blob(screenRecordedChunksRef.current, { type: "video/webm" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `screen-recording-${new Date().toISOString()}.webm`;
				a.click();
				URL.revokeObjectURL(url);
				screenRecordedChunksRef.current = [];
				screenStream.getTracks().forEach((track) => track.stop());
			};

			screenRecorderRef.current.start();
			setIsScreenRecording(true);
			toast.success("Screen recording started");
		} catch (error) {
			console.error("Error starting screen recording:", error);
			toast.error("Failed to start screen recording. Please check permissions.");
		}
	};

	// Toggle screen recording
	const toggleScreenRecording = () => {
		if (isScreenRecording && screenRecorderRef.current) {
			screenRecorderRef.current.stop();
			setIsScreenRecording(false);
			toast.info("Screen recording stopped and saved");
		} else {
			startScreenRecording();
		}
	};

	const endCall = () => {
		// 1. Close the peer-to-peer call
		if (call) {
			call.close();
		}

		// 2. Stop local stream (camera/mic)
		if (localStreamRef.current) {
			localStreamRef.current.getTracks().forEach((track) => track.stop());
			localStreamRef.current = null;
		}

		// 3. Stop recording if ongoing
		if (screenRecorderRef.current && screenRecorderRef.current.state === "recording") {
			screenRecorderRef.current.stop();
		}

		// 4. Destroy peer connection
		if (peer) {
			peer.destroy();
		}

		// 5. Emit `leave-session` to server
		if (socket) {
			socket.emit("leave-session");
		}

		// 6. Clear remote video/audio if you're managing them
		if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
		if (waitingVideoRef.current) waitingVideoRef.current.srcObject = null;
		if (localVideoRef.current) localVideoRef.current.srcObject = null;
		if (localStreamRef.current) localStreamRef.current = null;

		setIsScreenSharing(false);
		setIsScreenRecording(false);

		// 7. Navigate based on role
		if (role === "user") {
			navigate("/sessions", { replace: true });
		} else {
			navigate("/mentor/upcoming-sessions", { replace: true });
		}
	};

	const handleJoinRequest = (request: { userId: string; sessionId: string; peerId: string; name: string; avatar?: string }, approve: boolean) => {
		if (!socket) return;
		socket.emit("approve-join", {
			userId: request.userId,
			sessionId: request.sessionId,
			approve,
			mentorPeerId: peer?.id,
		});
		setJoinRequests((prev) => {
			const newRequests = prev.filter((req) => req.userId !== request.userId);
			if (newRequests.length === 0) {
				setShowJoinRequestDrawer(false);
			}
			return newRequests;
		});
		toast.info(
			approve ? (
				<div className="flex items-center gap-2">
					<Avatar className="w-6 h-6">{request.avatar ? <AvatarImage src={request.avatar} alt={request.name} /> : <AvatarFallback className="bg-gray-300 text-white text-xs">{request.name[0]?.toUpperCase() || "U"}</AvatarFallback>}</Avatar>
					<span>{`Approved join request for ${request.name}`}</span>
				</div>
			) : (
				<div className="flex items-center gap-2">
					<Avatar className="w-6 h-6">{request.avatar ? <AvatarImage src={request.avatar} alt={request.name} /> : <AvatarFallback className="bg-gray-300 text-white text-xs">{request.name[0]?.toUpperCase() || "U"}</AvatarFallback>}</Avatar>
					<span>{`Rejected join request for ${request.name}`}</span>
				</div>
			)
		);
	};

	const handleAskToJoin = () => {
		if (!socket) return;

		if (hasRequestedJoin) {
			toast.info("Join request already sent");
			return;
		}
		if (peer && user) {
			socket.emit("join-session", {
				sessionId,
				userId: user.id,
				peerId: peer.id,
				role,
				name: `${user.firstName || ""} ${user.lastName || ""}`,
				avatar: user.avatar,
			});
			setHasRequestedJoin(true);
		}
	};

	const renderRemotePlaceholder = () => {
		if (isRemoteVideoOn) return null;
		return (
			<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-primary/50 to-primary/80 rounded-2xl">
				<Avatar className="w-24 h-24">
					<AvatarImage src={remoteParticipant.avatar} />
					<AvatarFallback>{remoteParticipant.name.slice(0, 1)}</AvatarFallback>
				</Avatar>
			</div>
		);
	};

	const renderLocalPlaceholder = () => {
		if (isVideoOn) return null;
		return (
			<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-primary/50 to-primary/80 rounded-2xl">
				<Avatar className="w-24 h-24">
					<AvatarImage src={user?.avatar as string} />
					<AvatarFallback>{user?.firstName?.slice(0, 1)}</AvatarFallback>
				</Avatar>
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
				<div className={cn("absolute top-2 right-2 px-3 py-1 rounded-full text-sm", isConnected ? "bg-green-500 text-white" : "bg-red-500 text-white")}>{isConnected ? "Connected" : "Disconnected"}</div>
				<div className="flex justify-center items-center h-[calc(100vh-6rem)] space-x-4 p-8">
					<div className="relative flex-1 max-w-[50%]">
						<video ref={remoteVideoRef} autoPlay className="object-contain rounded-2xl w-full h-auto" />
						{renderRemotePlaceholder()}
						<span className="absolute bottom-2 left-2 text-white bg-black/60 px-2 py-1 rounded text-sm flex items-center gap-2">
							{`${remoteParticipant.name}` || "User"}
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
							{`${user?.firstName} ${user?.lastName}` || "You"}
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
					isScreenRecording={isScreenRecording}
					role={role}
					joinRequestsCount={joinRequests.length}
					onToggleMute={toggleMute}
					onToggleVideo={toggleVideo}
					onToggleScreenShare={toggleScreenShare}
					onToggleSidebar={toggleSidebar}
					onToggleRaiseHand={toggleRaiseHand}
					onToggleScreenRecording={toggleScreenRecording}
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

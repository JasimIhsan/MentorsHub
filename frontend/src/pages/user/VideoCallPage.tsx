import { useEffect, useRef, useState } from "react";
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
import { useSocket } from "@/context/SocketContext";

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
		};
	}, [isUserWaiting]);

	useEffect(() => {
		if (user) {
			socket.emit("mute-status", { userId: user.id, isMuted });
		}
	}, [isMuted, socket, user]);

	useEffect(() => {
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
				const response = await axiosInstance.get(`/user/sessions/${sessionId}`);
				const session = response.data.session;
				if (session.mentorId._id === user.id) {
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
			if (!determinedRole) return;

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

		unsubscribes.push(
			socket.onVideoCallEvent("user-joined", ({ peerId, name, avatar }: { peerId: string; name: string; avatar?: string }) => {
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
			})
		);

		unsubscribes.push(
			socket.onVideoCallEvent("join-approved", ({ mentorPeerId }: { mentorPeerId: string | null }) => {
				setIsUserWaiting(false);
				setIsRejected(false);
				toast.success("You have been approved to join the session!");
				if (role === "user" && peer && localStreamRef.current && mentorPeerId) {
					initiateCall(mentorPeerId, 0);
				}
			})
		);

		unsubscribes.push(
			socket.onVideoCallEvent("join-rejected", ({ message }: { message: string }) => {
				setIsUserWaiting(true);
				setHasRequestedJoin(false);
				setIsRejected(true);
				setRejectionMessage(message);
				toast.error(message);
				setTimeout(() => {
					navigate("/sessions", { replace: true });
				}, 5000);
			})
		);

		unsubscribes.push(
			socket.onVideoCallEvent("user-disconnected", ({ userId }: { userId: string }) => {
				toast.info(`User ${userId} has disconnected`);
				if (remoteVideoRef.current) {
					remoteVideoRef.current.srcObject = null;
				}
			})
		);

		unsubscribes.push(
			socket.onVideoCallEvent("mute-status", ({ isMuted }: { isMuted: boolean }) => {
				setIsRemoteMuted(isMuted);
			})
		);

		unsubscribes.push(
			socket.onVideoCallEvent("video-status", ({ isVideoOn }: { isVideoOn: boolean }) => {
				setIsRemoteVideoOn(isVideoOn);
			})
		);

		unsubscribes.push(
			socket.onVideoCallEvent("hand-raise-status", ({ isHandRaised }: { isHandRaised: boolean }) => {
				setIsRemoteHandRaised(isHandRaised);
			})
		);

		unsubscribes.push(
			socket.onVideoCallEvent("error", ({ message }: { message: string }) => {
				toast.error(message);
				if (role === "user") navigate("/sessions", { replace: true });
				else navigate("/mentor/upcoming-sessions", { replace: true });
			})
		);

		unsubscribes.push(
			socket.onVideoCallEvent("join-request", ({ userId, sessionId: requestSessionId, peerId, name, avatar }: { userId: string; sessionId: string; peerId: string; name: string; avatar?: string }) => {
				if (role === "mentor" && requestSessionId === sessionId) {
					setJoinRequests((prev) => {
						if (prev.some((req) => req.userId === userId)) {
							return prev;
						}
						return [...prev, { userId, sessionId: requestSessionId, peerId, name, avatar }];
					});
					setShowJoinRequestDrawer(true);
				}
			})
		);

		unsubscribes.push(
			socket.onVideoCallEvent("reconnect-success", () => {
				toast.success("Reconnected to session!");
			})
		);

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
		if (!peer || !determinedRole || !user) return;
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

	const endCall = () => {
		if (call) call.close();
		if (localStreamRef.current) {
			localStreamRef.current.getTracks().forEach((track) => track.stop());
			localStreamRef.current = null;
		}
		if (peer) peer.destroy();
		if (role === "user") navigate("/sessions", { replace: true });
		else navigate("/mentor/upcoming-sessions", { replace: true });
	};

	const handleJoinRequest = (request: { userId: string; sessionId: string; peerId: string }, approve: boolean) => {
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
		toast.info(approve ? `Approved join request for user ${request.userId}` : `Rejected join request for user ${request.userId}`);
	};

	const handleAskToJoin = () => {
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
			<div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
				{isRejected ? (
					<div className="text-center">
						<h2 className="text-3xl font-bold text-red-600 mb-4">Join Request Rejected</h2>
						<p className="text-gray-700 mb-4">{rejectionMessage || "The mentor has rejected your join request."}</p>
						<p className="text-gray-500">You will be redirected to the sessions page.</p>
					</div>
				) : (
					<>
						<h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Prepare to Join the Call</h2>
						<div className="relative mb-6 rounded-2xl overflow-hidden shadow-inner aspect-video">
							{isVideoOn ? (
								<video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
							) : (
								<div className="absolute inset-0 flex items-center justify-center bg-gray-300 rounded-2xl">
									<div className="w-20 h-20 rounded-full bg-gray-400 flex items-center justify-center text-white text-3xl font-semibold">U</div>
								</div>
							)}
							<span className="absolute bottom-2 left-2 text-white bg-black/60 px-2 py-1 rounded text-sm flex items-center gap-2">
								You
								{isMuted ? <MicOffIcon className="h-4 w-4" /> : <MicIcon className="h-4 w-4" />}
							</span>
						</div>
						<div className="flex justify-center gap-4 mb-6">
							<TooltipProvider>
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
										<p>{isVideoOn ? "Turn off" : "Turn on"} camera</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						{hasRequestedJoin ? (
							<div className="text-center">
								<Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-2" />
								<p className="text-gray-600 text">Waiting for mentor approval...</p>
							</div>
						) : (
							<Button onClick={onAskToJoin} className="w-full py-2 rounded-lg" disabled={hasRequestedJoin}>
								Ask to Join
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
		<Drawer open={isOpen} onClose={onClose} direction="right">
			<DrawerContent className="w-[400px] h-full fixed right-0 top-0">
				<DrawerHeader>
					<DrawerTitle>Join Requests</DrawerTitle>
				</DrawerHeader>
				<div className="p-4 space-y-4 overflow-auto flex-1">
					{joinRequests.length === 0 ? (
						<p className="text-center text-sm text-gray-400">No pending requests.</p>
					) : (
						joinRequests.map((request) => (
							<div key={request.userId} className="flex items-center justify-between p-2 border-b">
								<div className="flex items-center gap-2">
									<Avatar className="h-8 w-8">
										<AvatarImage src={request.avatar} />
										<AvatarFallback>{request.name[0]}</AvatarFallback>
									</Avatar>
									<p className="text-sm font-medium">{request.name}</p>
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
	isMuted?: boolean;
	isVideoOn?: boolean;
	isScreenSharing?: boolean;
	isSidebarOpen?: boolean;
	isHandRaised?: boolean;
	role?: "mentor" | "user" | null;
	joinRequestsCount?: number;
	onToggleMute?: () => void;
	onToggleVideo?: () => void;
	onToggleScreenShare?: () => void;
	onToggleSidebar?: () => void;
	onToggleRaiseHand?: () => void;
	onEndCall?: () => void;
	onOpenJoinRequests?: () => void;
}

const ControlBar = ({
	isMuted,
	isVideoOn,
	isScreenSharing,
	isSidebarOpen,
	isHandRaised,
	role,
	joinRequestsCount = 0,
	onToggleMute,
	onToggleVideo,
	onToggleScreenShare,
	onToggleSidebar,
	onToggleRaiseHand,
	onEndCall,
	onOpenJoinRequests,
}: ControlBarProps) => {
	return (
		<div className="fixed bottom-0 left-0 right-0 flex justify-center p-10 z-10">
			<div className="bg-white/95 rounded-full shadow-lg px-4 py-2 border border-gray-200 flex items-center gap-2">
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
								<p>{isVideoOn ? "Turn off" : "Turn on"} camera</p>
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
								<Button variant={isHandRaised ? "default" : "secondary"} size="icon" onClick={onToggleRaiseHand} className="rounded-full h-12 w-12">
									<HandIcon className={cn("h-5 w-5", isHandRaised && "text-white")} />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>{isHandRaised ? "Lower hand" : "Raise hand"}</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant={isSidebarOpen ? "default" : "secondary"} size="icon" onClick={onToggleSidebar} className="rounded-full h-12 w-12">
									<ListIcon className={cn("h-5 w-5", isSidebarOpen && "text-white")} />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>{isSidebarOpen ? "Hide sidebar" : "Show sidebar"}</p>
							</TooltipContent>
						</Tooltip>
						{role === "mentor" && (
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant={joinRequestsCount > 0 ? "default" : "secondary"} size="icon" onClick={onOpenJoinRequests} className="rounded-full relative h-12 w-12">
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
};

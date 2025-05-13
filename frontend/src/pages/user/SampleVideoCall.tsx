import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Peer, { MediaConnection } from "peerjs";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, ScreenShareIcon, HandIcon, ListIcon, PhoneOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
	const localStreamRef = useRef<MediaStream | null>(null);
	const user = useSelector((state: RootState) => state.auth.user);
	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isHandRaised, setIsHandRaised] = useState(false);
	const [activeSpeaker, setActiveSpeaker] = useState<"local" | "remote" | null>(null);

	// Initialize Socket.IO and PeerJS
	useEffect(() => {
		if (!user) {
			toast.error("Please login first. Redirecting...");
			return;
		}

		const newSocket = io("http://localhost:5858", {
			withCredentials: true,
			transports: ["websocket"],
		});
		setSocket(newSocket);

		const newPeer = new Peer({
			host: "0.peerjs.com",
			secure: true,
		});

		newPeer.on("open", (peerId) => {
			console.log(`PeerJS connected with ID: ${peerId}`);
			newSocket.emit("join-session", { sessionId, userId: user.id, peerId });
		});

		setPeer(newPeer);

		return () => {
			newSocket.disconnect();
			newPeer.destroy();
		};
	}, [sessionId, user]);

	// Setup media stream and audio level detection
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				localStreamRef.current = stream;
				if (localVideoRef.current) {
					localVideoRef.current.srcObject = stream;
				}
				setupAudioLevelDetection(stream, "local");
			})
			.catch((error) => {
				console.error("Error accessing media devices:", error);
				toast.error("Failed to access camera or microphone");
			});

		return () => {
			if (localStreamRef.current) {
				localStreamRef.current.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	// Handle incoming calls and remote status updates
	useEffect(() => {
		if (!peer || !socket) return;

		peer.on("call", (incomingCall) => {
			if (localStreamRef.current) {
				incomingCall.answer(localStreamRef.current);
				setCall(incomingCall);

				incomingCall.on("stream", (remoteStream) => {
					if (remoteVideoRef.current) {
						remoteVideoRef.current.srcObject = remoteStream;
					}
					setupAudioLevelDetection(remoteStream, "remote");
				});
			}
		});

		socket.on("user-joined", ({ peerId }: { peerId: string }) => {
			if (peer && localStreamRef.current) {
				const outgoingCall = peer.call(peerId, localStreamRef.current);
				setCall(outgoingCall);

				outgoingCall.on("stream", (remoteStream) => {
					if (remoteVideoRef.current) {
						remoteVideoRef.current.srcObject = remoteStream;
					}
					setupAudioLevelDetection(remoteStream, "remote");
				});
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

		return () => {
			socket.off("user-joined");
			socket.off("mute-status");
			socket.off("video-status");
			socket.off("hand-raise-status");
			peer.off("call");
		};
	}, [peer, socket]);

	// Audio level detection for active speaker
	const setupAudioLevelDetection = (stream: MediaStream, type: "local" | "remote") => {
		const audioContext = new AudioContext();
		const source = audioContext.createMediaStreamSource(stream);
		const analyser = audioContext.createAnalyser();
		analyser.fftSize = 512;
		source.connect(analyser);

		const dataArray = new Uint8Array(analyser.frequencyBinCount);

		const detectAudioLevel = () => {
			analyser.getByteFrequencyData(dataArray);
			const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
			if (average > 25) {
				setActiveSpeaker(type);
			} else if (activeSpeaker === type) {
				setActiveSpeaker(null); // Fixed: Clear active speaker
			}
			requestAnimationFrame(detectAudioLevel);
		};
		detectAudioLevel();
	};

	// Toggle microphone and emit status
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

	// Toggle video and emit status
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

	// Toggle hand-raise and emit status
	const toggleRaiseHand = () => {
		setIsHandRaised(!isHandRaised);
		socket?.emit("hand-raise-status", { userId: user?.id, isHandRaised: !isHandRaised });
		// toast.info(isHandRaised ? "Hand lowered" : "Hand raised");
	};

	// Toggle sidebar
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
		toast.info(isSidebarOpen ? "Sidebar hidden" : "Sidebar shown");
	};

	// Toggle screen sharing
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

	// End call and cleanup
	const endCall = () => {
		if (call) {
			call.close();
		}
		if (localStreamRef.current) {
			localStreamRef.current.getTracks().forEach((track) => track.stop());
		}
		if (socket) {
			socket.disconnect();
		}
		if (peer) {
			peer.destroy();
		}
	};

	// Placeholder for remote user when video is off
	const renderRemotePlaceholder = () => {
		if (isRemoteVideoOn) return null;
		return (
			<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-primary/50 to-primary/80 rounded-2xl">
				<div className="w-24 h-24 rounded-full bg-primary/90 flex items-center justify-center text-white text-4xl">{"U"}</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col">
			<div className="flex-1 relative">
				<div className="flex justify-center items-center h-[calc(100vh-6rem)] space-x-4 p-8">
					{/* Remote Video Container */}
					<div className="relative flex-1 max-w-[50%]">
						<video ref={remoteVideoRef} autoPlay className="object-contain rounded-2xl w-full h-auto" />
						{renderRemotePlaceholder()}
						<span className="absolute bottom-2 left-2 text-white bg-black/60 px-2 py-1 rounded text-sm flex items-center gap-2">
							Remote
							{isRemoteMuted ? <MicOffIcon className="inline h-4 w-4" /> : <MicIcon className="inline h-4 w-4" />}
						</span>
						{isRemoteHandRaised && (
							<span className={`absolute bottom-2 right-2  p-1.5 rounded-full animate-bounce ${isRemoteVideoOn ? "bg-primary text-white" : "bg-white"}`}>
								<HandIcon className="h-5 w-5" />
							</span>
						)}
					</div>

					{/* Local Video Container */}
					<div className="relative flex-1 max-w-[50%]">
						<video ref={localVideoRef} autoPlay muted className="object-cover rounded-2xl w-full h-auto" />
						<span className="absolute bottom-2 left-2 text-white bg-black/60 px-2 py-1 rounded text-sm flex items-center gap-2">
							{user?.firstName || "You"}
							{isMuted ? <MicOffIcon className="inline h-4 w-4" /> : <MicIcon className="inline h-4 w-4" />}
						</span>
						{isHandRaised && (
							<span className={`absolute bottom-2 right-2  p-1.5 rounded-full animate-bounce ${isVideoOn ? "bg-primary text-white" : "bg-white"}`}>
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
					onToggleMute={toggleMute}
					onToggleVideo={toggleVideo}
					onToggleScreenShare={toggleScreenShare}
					onToggleSidebar={toggleSidebar}
					onToggleRaiseHand={toggleRaiseHand}
					onEndCall={endCall}
				/>
			</div>
		</div>
	);
};

interface ControlBarProps {
	isMuted: boolean;
	isVideoOn: boolean;
	isScreenSharing: boolean;
	isSidebarOpen: boolean;
	isHandRaised: boolean;
	onToggleMute: () => void;
	onToggleVideo: () => void;
	onToggleScreenShare: () => void;
	onToggleSidebar: () => void;
	onToggleRaiseHand: () => void;
	onEndCall: () => void;
}

function ControlBar({ isMuted, isVideoOn, isScreenSharing, isSidebarOpen, isHandRaised, onToggleMute, onToggleVideo, onToggleScreenShare, onToggleSidebar, onToggleRaiseHand, onEndCall }: ControlBarProps) {
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

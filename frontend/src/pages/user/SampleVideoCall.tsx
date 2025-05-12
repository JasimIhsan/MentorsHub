import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Peer, { MediaConnection } from "peerjs";
import { Button } from "@/components/ui/button"; // Assuming you have a UI library
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
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const localStreamRef = useRef<MediaStream | null>(null);
	const user = useSelector((state: RootState) => state.auth.user);
	// const navigate = useNavigate();

	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isHandRaised, setIsHandRaised] = useState(false);

	// Initialize Socket.IO and PeerJS
	useEffect(() => {
		if (!user) {
			toast.error("Please login first. Redirecting...");
			// navigate('/authenticate',{ replace = true});
			return;
		}
		// Connect to your Socket.IO server
		const newSocket = io("http://localhost:5858", {
			withCredentials: true,
			transports: ["websocket"],
		});
		setSocket(newSocket);
		const userId = user?.id;

		const newPeer = new Peer({
			host: "0.peerjs.com",
			secure: true,
		});

		newPeer.on("open", (peerId) => {
			console.log(`PeerJS connected with ID: ${peerId}`);
			newSocket.emit("join-session", { sessionId, userId, peerId });
		});

		setPeer(newPeer);

		// Cleanup
		return () => {
			newSocket.disconnect();
			newPeer.destroy();
		};
	}, [sessionId, user?.id]);

	// Setup media stream
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				localStreamRef.current = stream;
				if (localVideoRef.current) {
					localVideoRef.current.srcObject = stream;
				}
			})
			.catch((error) => {
				console.error("Error accessing media devices:", error);
			});
	}, []);

	// Handle incoming calls
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
				});
			}
		});

		// Handle session join from other user
		socket.on("user-joined", ({ peerId }: { peerId: string }) => {
			if (peer && localStreamRef.current) {
				const outgoingCall = peer.call(peerId, localStreamRef.current);
				setCall(outgoingCall);

				outgoingCall.on("stream", (remoteStream) => {
					if (remoteVideoRef.current) {
						remoteVideoRef.current.srcObject = remoteStream;
					}
				});
			}
		});

		return () => {
			socket.off("user-joined");
		};
	}, [peer, socket]);

	// Toggle microphone
	const toggleMute = () => {
		if (localStreamRef.current) {
			const audioTracks = localStreamRef.current.getAudioTracks();
			audioTracks.forEach((track) => {
				track.enabled = !track.enabled;
			});
			setIsMuted(!isMuted);
		}
	};

	// Toggle video
	const toggleVideo = () => {
		if (localStreamRef.current) {
			const videoTracks = localStreamRef.current.getVideoTracks();
			videoTracks.forEach((track) => {
				track.enabled = !track.enabled;
			});
			setIsVideoOn(!isVideoOn);
		}
	};

	// Toggle sidebar (placeholder)
	const toggleSidebar = () => {
		// TODO: Implement sidebar visibility logic
		setIsSidebarOpen(!isSidebarOpen);
		toast.info(isSidebarOpen ? "Sidebar hidden" : "Sidebar shown");
	};

	// Toggle raise hand (placeholder)
	const toggleRaiseHand = () => {
		// TODO: Implement raise hand logic (e.g., emit event via Socket.IO)
		setIsHandRaised(!isHandRaised);
		toast.info(isHandRaised ? "Hand lowered" : "Hand raised");
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
				// TODO: Update PeerJS call with new stream
				setIsScreenSharing(true);
			} catch (error) {
				console.error("Error starting screen share:", error);
				toast.error("Failed to start screen sharing");
			}
		} else {
			// Stop screen sharing
			localStreamRef.current?.getTracks().forEach((track) => track.stop());
			// Revert to camera stream
			const cameraStream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
			localStreamRef.current = cameraStream;
			if (localVideoRef.current) {
				localVideoRef.current.srcObject = cameraStream;
			}
			// TODO: Update PeerJS call with camera stream
			setIsScreenSharing(false);
		}
	};

	// End call
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

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
			<div className="w-full max-w-4xl">
				<div className="grid grid-cols-2 gap-4 mb-4">
					<div className="relative aspect-video bg-black rounded-lg overflow-hidden">
						<video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
						<span className="absolute bottom-2 left-2 text-white">You</span>
					</div>
					<div className="relative aspect-video bg-black rounded-lg overflow-hidden">
						<video ref={remoteVideoRef} autoPlay className="w-full h-full object-cover" />
						<span className="absolute bottom-2 left-2 text-white">Remote</span>
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

// ControlBar component (same as provided)
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

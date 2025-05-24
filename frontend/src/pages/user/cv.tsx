import { useState, useEffect, useRef, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, ScreenShareIcon, PhoneOffIcon, ListIcon, HandIcon, BrainIcon, StopCircleIcon, PinIcon, CrownIcon, X, CheckCircle, Circle, Disc } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import io, { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createPeerConnection } from "@/utility/webrtc";
import { useParams } from "react-router-dom";

interface Participant {
	id: string;
	name: string;
	isMuted: boolean;
	isVideoOn: boolean;
	isScreenSharing: boolean;
	isMentor: boolean;
	avatarUrl: string;
	stream: MediaStream | null;
	peerConnection: RTCPeerConnection | null;
}

// const iceServers = [
//   { urls: "stun:stun.l.google.com:19302" },
//   { urls: "stun:stun1.l.google.com:19302" },
// ];

const Spinner = ({ size = "lg" }: { size?: "sm" | "md" | "lg" }) => <div className={`animate-spin rounded-full border-t-2 border-primary ${size === "lg" ? "h-12 w-12" : size === "md" ? "h-8 w-8" : "h-4 w-4"}`}></div>;

interface ControlBarProps {
	isMuted: boolean;
	isVideoOn: boolean;
	isScreenSharing: boolean;
	isRecording: boolean;
	isAiNotesActive: boolean;
	isSidebarOpen: boolean;
	isHandRaised: boolean;
	isPremiumSession: boolean;
	onToggleMute: () => void;
	onToggleVideo: () => void;
	onToggleScreenShare: () => void;
	onToggleRecording: () => void;
	onToggleAiNotes: () => void;
	onToggleSidebar: () => void;
	onToggleRaiseHand: () => void;
	onEndCall: () => void;
}

function ControlBar({
	isMuted,
	isVideoOn,
	isScreenSharing,
	isRecording,
	isAiNotesActive,
	isSidebarOpen,
	isHandRaised,
	isPremiumSession,
	onToggleMute,
	onToggleVideo,
	onToggleScreenShare,
	onToggleRecording,
	onToggleAiNotes,
	onToggleSidebar,
	onToggleRaiseHand,
	onEndCall,
}: ControlBarProps) {
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
						{isPremiumSession && (
							<>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant={isAiNotesActive ? "default" : "secondary"} size="icon" onClick={onToggleAiNotes} className="rounded-full h-10 w-10">
											<BrainIcon className={cn("h-5 w-5", isAiNotesActive && "text-white")} />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>{isAiNotesActive ? "Stop AI notes" : "Start AI notes"}</p>
									</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant={isRecording ? "destructive" : "secondary"} size="icon" onClick={onToggleRecording} className="rounded-full h-10 w-10">
											{isRecording ? <StopCircleIcon className="h-5 w-5 text-white" /> : <Disc className="h-5 w-5" />}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>{isRecording ? "Stop recording" : "Start recording"}</p>
									</TooltipContent>
								</Tooltip>
							</>
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

interface GoalsSidebarProps {
	goals: string[];
	onClose: () => void;
	isPremiumSession: boolean;
}

function GoalsSidebar({ goals, onClose, isPremiumSession }: GoalsSidebarProps) {
	const [completedGoals, setCompletedGoals] = useState<number[]>([]);

	const toggleGoalCompletion = (index: number) => {
		setCompletedGoals((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
	};

	return (
		<div className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 z-20 flex flex-col">
			<div className="p-4 border-b border-gray-200 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h2 className="text-lg font-semibold">Session Goals</h2>
					{isPremiumSession && <CrownIcon className="h-4 w-4 text-yellow-400" />}
				</div>
				<Button variant="ghost" size="icon" onClick={onClose}>
					<X className="h-4 w-4" />
				</Button>
			</div>
			<div className="flex-1 overflow-y-auto p-4">
				<ul className="space-y-3">
					{goals.map((goal, index) => (
						<li key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors">
							<Button variant="ghost" size="icon" className="h-6 w-6 mt-0.5" onClick={() => toggleGoalCompletion(index)}>
								{completedGoals.includes(index) ? <CheckCircle className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5" />}
							</Button>
							<span className={completedGoals.includes(index) ? "line-through text-gray-500" : "text-gray-900"}>{goal}</span>
						</li>
					))}
				</ul>
			</div>
			<div className="p-4 border-t border-gray-200">
				<div className="text-sm text-gray-500">
					{completedGoals.length} of {goals.length} goals completed
				</div>
				<div className="w-full bg-gray-100 rounded-full h-2 mt-2">
					<div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${(completedGoals.length / goals.length) * 100}%` }}></div>
				</div>
			</div>
		</div>
	);
}

interface VideoGridProps {
	participants: Participant[];
	activeSpeakerId: string | null;
	pinnedParticipantId: string | null;
	onPinParticipant: (id: string) => void;
	isPremiumSession: boolean;
	isMobile: boolean;
	userId: string;
}

function VideoGrid({ participants, activeSpeakerId, pinnedParticipantId, onPinParticipant, isPremiumSession, isMobile, userId }: VideoGridProps) {
	const [gridLayout, setGridLayout] = useState<string>("");

	useEffect(() => {
		const count = participants.length;
		const hasPinned = pinnedParticipantId !== null;

		if (isMobile) {
			setGridLayout("grid-cols-2 gap-2");
		} else if (hasPinned) {
			setGridLayout("grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4");
		} else if (count <= 2) {
			setGridLayout("grid-cols-1 md:grid-cols-2 gap-4");
		} else if (count <= 4) {
			setGridLayout("grid-cols-1 md:grid-cols-2 gap-4");
		} else if (count <= 6) {
			setGridLayout("grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3");
		} else if (count <= 9) {
			setGridLayout("grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2");
		} else {
			setGridLayout("grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2");
		}
	}, [participants.length, pinnedParticipantId, isMobile]);

	const sortedParticipants = [...participants].sort((a, b) => {
		if (a.id === pinnedParticipantId) return -1;
		if (b.id === pinnedParticipantId) return 1;
		if (a.id === activeSpeakerId) return -1;
		if (b.id === activeSpeakerId) return 1;
		return 0;
	});

	return (
		<div className="h-full w-full p-4 pb-24">
			{pinnedParticipantId && (
				<div className="mb-4 h-[50vh]">
					{sortedParticipants
						.filter((p) => p.id === pinnedParticipantId)
						.map((participant) => (
							<VideoTile
								key={participant.id}
								participant={participant}
								isPinned={true}
								isActive={participant.id === activeSpeakerId}
								onPin={() => onPinParticipant(participant.id)}
								isPremiumSession={isPremiumSession}
								userId={userId}
								className="h-full"
							/>
						))}
				</div>
			)}
			<div className={`grid ${gridLayout} ${pinnedParticipantId ? "h-[30vh]" : "h-full"}`}>
				{sortedParticipants
					.filter((p) => (pinnedParticipantId ? p.id !== pinnedParticipantId : true))
					.map((participant) => (
						<VideoTile key={participant.id} participant={participant} isPinned={false} isActive={participant.id === activeSpeakerId} onPin={() => onPinParticipant(participant.id)} isPremiumSession={isPremiumSession} userId={userId} />
					))}
			</div>
		</div>
	);
}

interface VideoTileProps {
	participant: Participant;
	isPinned: boolean;
	isActive: boolean;
	onPin: () => void;
	isPremiumSession: boolean;
	userId: string;
	className?: string;
}

function VideoTile({ participant, isPinned, isActive, onPin, isPremiumSession, userId, className }: VideoTileProps) {
	const [isHovered, setIsHovered] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current && participant.stream) {
			videoRef.current.srcObject = participant.stream;
		}
	}, [participant.stream]);

	return (
		<div
			className={cn("relative rounded-lg overflow-hidden transition-all duration-300", isActive && !isPinned && "ring-2 ring-primary ring-offset-2", isPinned && "ring-2 ring-primary-600 ring-offset-2", className || "h-full")}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}>
			<div className="bg-gray-200 h-full w-full flex items-center justify-center">
				{participant.isVideoOn && participant.stream ? (
					<video ref={videoRef} autoPlay playsInline muted={participant.id === userId} className="w-full h-full object-cover" />
				) : (
					<div className="flex flex-col items-center justify-center h-full w-full bg-gray-300">
						<div className="h-20 w-20 rounded-full bg-gray-400 flex items-center justify-center text-2xl font-semibold text-gray-800">{participant.name.charAt(0)}</div>
						<div className="mt-2 text-gray-800">{participant.name}</div>
					</div>
				)}
			</div>
			<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="text-white font-medium">{participant.name}</span>
						{participant.isMuted && <MicOffIcon className="h-4 w-4 text-red-500" />}
						{participant.isMentor && isPremiumSession && <CrownIcon className="h-4 w-4 text-yellow-400" />}
					</div>
					{(isHovered || isPinned) && (
						<Button variant={isPinned ? "secondary" : "ghost"} size="icon" className="h-8 w-8 bg-black/40 hover:bg-black/60" onClick={onPin}>
							<PinIcon className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

function VideoCallInterface() {
	const { sessionId } = useParams<{ sessionId: string }>();
	const [participants, setParticipants] = useState<Participant[]>([]);
	const [activeSpeakerId, _setActiveSpeakerId] = useState<string | null>(null);
	const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(null);
	const [isMuted, setIsMuted] = useState(false);
	const [isVideoOn, setIsVideoOn] = useState(true);
	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [isAiNotesActive, setIsAiNotesActive] = useState(false);
	const [isHandRaised, setIsHandRaised] = useState(false);
	const [sessionGoals, _setSessionGoals] = useState<string[]>(["Discuss project goals", "Review timeline", "Assign tasks"]);
	const [isMobile, setIsMobile] = useState(false);
	const [isJoined, setIsJoined] = useState(false);
	const [isWaitingApproval, setIsWaitingApproval] = useState(false);
	const [isSessionStarted, setIsSessionStarted] = useState(false);

	const user = useSelector((state: RootState) => state.auth.user);
	const localStreamRef = useRef<MediaStream | null>(null);
	const socketRef = useRef<Socket | null>(null);
	const userId = user?.id || "user-" + Math.random().toString(36).substring(2, 9);
	const userName = user?.firstName + " " + user?.lastName || "Guest";
	const isPremiumSession = true;

	useEffect(() => {
		socketRef.current = io("http://localhost:5858", { withCredentials: true });

		socketRef.current.on("connect", () => {
			console.log("Connected to socket server:", socketRef.current?.id);
		});

		socketRef.current.on("session-started", ({ sessionId: startedSessionId }) => {
			if (startedSessionId === sessionId) {
				setIsSessionStarted(true);
				toast.info("Session has started! Requesting to join...");
				requestToJoin();
			}
		});

		socketRef.current.on("approve-join", () => {
			setIsWaitingApproval(false);
			joinRoom();
			toast.success("You have been approved to join the session!");
		});

		socketRef.current.on("reject-join", () => {
			setIsWaitingApproval(false);
			setIsJoined(false);
			toast.error("Your join request was rejected.");
		});

		socketRef.current.on("user-joined", async (remoteUserId: string, userData: { name: string; isMentor: boolean }) => {
			if (!localStreamRef.current || remoteUserId === socketRef.current?.id) return;

			const pc = createPeerConnection(socketRef.current!, remoteUserId, localStreamRef.current, (id, stream) => {
				setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, stream, isVideoOn: stream.getVideoTracks().length > 0 } : p)));
			});

			setParticipants((prev) => [
				...prev,
				{
					id: remoteUserId,
					name: userData.name,
					isMuted: true,
					isVideoOn: false,
					isScreenSharing: false,
					isMentor: userData.isMentor,
					avatarUrl: "",
					stream: null,
					peerConnection: pc,
				},
			]);

			try {
				const offer = await pc.createOffer();
				await pc.setLocalDescription(offer);
				socketRef.current?.emit("send-offer", { target: remoteUserId, offer });
			} catch (error) {
				console.error("Error creating offer:", error);
				toast.error("Failed to initiate connection with new user");
			}
		});

		socketRef.current.on("receive-offer", async ({ sender, offer }) => {
			if (!localStreamRef.current) return;

			const pc = createPeerConnection(socketRef.current!, sender, localStreamRef.current, (id, stream) => {
				setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, stream, isVideoOn: stream.getVideoTracks().length > 0 } : p)));
			});

			setParticipants((prev) => [
				...prev,
				{
					id: sender,
					name: `User退休 ${sender.slice(0, 4)}`,
					isMuted: true,
					isVideoOn: false,
					isScreenSharing: false,
					isMentor: false,
					avatarUrl: "",
					stream: null,
					peerConnection: pc,
				},
			]);

			try {
				await pc.setRemoteDescription(new RTCSessionDescription(offer));
				const answer = await pc.createAnswer();
				await pc.setLocalDescription(answer);
				socketRef.current?.emit("send-answer", { target: sender, answer });
			} catch (error) {
				console.error("Error handling offer:", error);
				toast.error("Failed to process connection offer");
			}
		});

		socketRef.current.on("receive-answer", async ({ sender, answer }) => {
			const pc = participants.find((p) => p.id === sender)?.peerConnection;
			if (pc) {
				try {
					await pc.setRemoteDescription(new RTCSessionDescription(answer));
				} catch (error) {
					console.error("Error setting remote description:", error);
				}
			}
		});

		socketRef.current.on("receive-ice-candidate", ({ sender, candidate }) => {
			const pc = participants.find((p) => p.id === sender)?.peerConnection;
			if (pc && candidate) {
				try {
					pc.addIceCandidate(new RTCIceCandidate(candidate));
				} catch (error) {
					console.error("Error adding ICE candidate:", error);
				}
			}
		});

		socketRef.current.on("user-left", (userId: string) => {
			setParticipants((prev) => {
				const participant = prev.find((p) => p.id === userId);
				if (participant?.peerConnection) {
					participant.peerConnection.close();
				}
				return prev.filter((p) => p.id !== userId);
			});
			toast.info(`User ${userId.slice(0, 4)} left the session`);
		});

		return () => {
			socketRef.current?.disconnect();
		};
	}, [participants, sessionId]);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth <= 768);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const requestToJoin = async () => {
		if (!sessionId) {
			toast.error("Invalid session ID");
			return;
		}

		setIsWaitingApproval(true);
		socketRef.current?.emit("user-join-request", {
			sessionId,
			userId,
			userName,
		});
	};

	const joinRoom = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
			localStreamRef.current = stream;
			setIsVideoOn(true);
			setIsMuted(false);

			setParticipants((prev) => [
				...prev,
				{
					id: userId,
					name: userName,
					isMuted: false,
					isVideoOn: true,
					isScreenSharing: false,
					isMentor: false,
					avatarUrl: "",
					stream,
					peerConnection: null,
				},
			]);

			socketRef.current?.emit("join-room", sessionId, { name: userName, isMentor: false });
			setIsJoined(true);
			toast.success("Joined session successfully");
		} catch (error) {
			console.error("Error joining session:", error);
			toast.error("Failed to join session. Please check your camera and microphone permissions.");
			setIsWaitingApproval(false);
		}
	};

	const toggleMute = () => {
		if (localStreamRef.current) {
			localStreamRef.current.getAudioTracks().forEach((track) => {
				track.enabled = !track.enabled;
			});
			setIsMuted(!isMuted);
			setParticipants((prev) => prev.map((p) => (p.id === userId ? { ...p, isMuted: !isMuted } : p)));
			toast.success(isMuted ? "Unmuted" : "Muted");
		}
	};

	const toggleVideo = () => {
		if (localStreamRef.current) {
			localStreamRef.current.getVideoTracks().forEach((track) => {
				track.enabled = !track.enabled;
			});
			setIsVideoOn(!isVideoOn);
			setParticipants((prev) => prev.map((p) => (p.id === userId ? { ...p, isVideoOn: !isVideoOn } : p)));
			toast.success(isVideoOn ? "Camera turned off" : "Camera turned on");
		}
	};

	const toggleScreenShare = async () => {
		if (!isScreenSharing) {
			try {
				const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
				const screenTrack = screenStream.getVideoTracks()[0];

				participants.forEach((p) => {
					if (p.peerConnection) {
						const sender = p.peerConnection.getSenders().find((s) => s.track?.kind === "video");
						if (sender) {
							sender.replaceTrack(screenTrack);
						}
					}
				});

				localStreamRef.current?.getVideoTracks().forEach((track) => track.stop());
				localStreamRef.current = screenStream;
				setIsScreenSharing(true);
				setIsVideoOn(true);
				setParticipants((prev) => prev.map((p) => (p.id === userId ? { ...p, isScreenSharing: true, isVideoOn: true } : p)));
				toast.success("Screen sharing started");

				screenTrack.onended = () => {
					toggleScreenShare();
				};
			} catch (error) {
				console.error("Error starting screen share:", error);
				toast.error("Failed to start screen sharing");
			}
		} else {
			try {
				const webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
				const webcamTrack = webcamStream.getVideoTracks()[0];

				participants.forEach((p) => {
					if (p.peerConnection) {
						const sender = p.peerConnection.getSenders().find((s) => s.track?.kind === "video");
						if (sender) {
							sender.replaceTrack(webcamTrack);
						}
					}
				});

				localStreamRef.current?.getTracks().forEach((track) => track.stop());
				localStreamRef.current = webcamStream;
				setIsScreenSharing(false);
				setIsVideoOn(true);
				setParticipants((prev) => prev.map((p) => (p.id === userId ? { ...p, isScreenSharing: false, isVideoOn: true } : p)));
				toast.success("Screen sharing stopped");
			} catch (error) {
				console.error("Error reverting to webcam:", error);
				toast.error("Failed to revert to webcam");
			}
		}
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const toggleAiNotes = () => {
		setIsAiNotesActive(!isAiNotesActive);
		toast.success(!isAiNotesActive ? "AI Meeting Notes activated" : "AI Meeting Notes deactivated");
	};

	const toggleRecording = () => {
		setIsRecording(!isRecording);
		toast.success(!isRecording ? "Recording started" : "Recording stopped");
	};

	const toggleRaiseHand = () => {
		setIsHandRaised(!isHandRaised);
		toast.success(!isHandRaised ? "Hand raised" : "Hand lowered");
	};

	const pinParticipant = (id: string) => {
		setPinnedParticipantId(id === pinnedParticipantId ? null : id);
	};

	const endCall = () => {
		socketRef.current?.disconnect();
		localStreamRef.current?.getTracks().forEach((track) => track.stop());
		participants.forEach((p) => p.peerConnection?.close());
		setParticipants([]);
		setIsJoined(false);
		setIsWaitingApproval(false);
		toast.success("Call ended");
	};

	if (!isSessionStarted) {
		return (
			<div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
				<Spinner size="lg" />
				<h1 className="text-2xl font-semibold mt-4">Waiting for session to start...</h1>
				<p className="text-sm text-gray-500 mt-2">You will be notified when the mentor starts the session.</p>
			</div>
		);
	}

	if (isWaitingApproval) {
		return (
			<div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
				<Spinner size="lg" />
				<h1 className="text-2xl font-semibold mt-4">Waiting for Mentor Approval...</h1>
				<p className="text-sm text-gray-500 mt-2">Your join request has been sent to the mentor.</p>
			</div>
		);
	}

	if (!isJoined) {
		return (
			<div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
				<h1 className="text-2xl font-semibold mb-4">Join Video Call</h1>
				<Button onClick={requestToJoin}>Request to Join</Button>
			</div>
		);
	}

	return (
		<div className="flex h-full w-full overflow-hidden bg-white">
			<div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "mr-80" : ""}`}>
				<VideoGrid participants={participants} activeSpeakerId={activeSpeakerId} pinnedParticipantId={pinnedParticipantId} onPinParticipant={pinParticipant} isPremiumSession={isPremiumSession} isMobile={isMobile} userId={userId} />
			</div>
			{isSidebarOpen && <GoalsSidebar goals={sessionGoals} onClose={toggleSidebar} isPremiumSession={isPremiumSession} />}
			<ControlBar
				isMuted={isMuted}
				isVideoOn={isVideoOn}
				isScreenSharing={isScreenSharing}
				isRecording={isRecording}
				isAiNotesActive={isAiNotesActive}
				isSidebarOpen={isSidebarOpen}
				isHandRaised={isHandRaised}
				isPremiumSession={isPremiumSession}
				onToggleMute={toggleMute}
				onToggleVideo={toggleVideo}
				onToggleScreenShare={toggleScreenShare}
				onToggleRecording={toggleRecording}
				onToggleAiNotes={toggleAiNotes}
				onToggleSidebar={toggleSidebar}
				onToggleRaiseHand={toggleRaiseHand}
				onEndCall={endCall}
			/>
		</div>
	);
}

function VideoCallLoading() {
	return (
		<div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
			<Spinner size="lg" />
			<p className="mt-4 text-lg text-gray-900">Connecting to your session...</p>
			<p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
		</div>
	);
}

export function VideoCallPage() {
	return (
		<main className="h-screen w-screen overflow-hidden bg-white">
			<Suspense fallback={<VideoCallLoading />}>
				<VideoCallInterface />
			</Suspense>
		</main>
	);
}

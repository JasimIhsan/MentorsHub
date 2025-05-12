import React, { use, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Peer, { MediaConnection } from "peerjs";
import { Button } from "@/components/ui/button"; // Assuming you have a UI library
import { Mic, MicOff, Video, VideoOff, Phone } from "lucide-react";
import { replace, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";

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
				<div className="flex justify-center gap-4">
					<Button onClick={toggleMute} variant={isMuted ? "destructive" : "default"}>
						{isMuted ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
						{isMuted ? "Unmute" : "Mute"}
					</Button>
					<Button onClick={toggleVideo} variant={isVideoOn ? "default" : "destructive"}>
						{isVideoOn ? <Video className="mr-2" /> : <VideoOff className="mr-2" />}
						{isVideoOn ? "Video Off" : "Video On"}
					</Button>
					<Button onClick={endCall} variant="destructive">
						<Phone className="mr-2" />
						End Call
					</Button>
				</div>
			</div>
		</div>
	);
};

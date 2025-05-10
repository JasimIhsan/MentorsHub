import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

interface VideoCallProps {
	sessionId: string;
	onLeave: () => void;
}

interface PeerConnection {
	pc: RTCPeerConnection;
	socketId: string;
	stream: MediaStream;
}

export function VideoCallWrapper() {
	const { sessionId } = useParams<{ sessionId: string }>();
	return <VideoCall sessionId={sessionId!} onLeave={() => window.history.back()} />;
}

export function VideoCall({ sessionId, onLeave }: VideoCallProps) {
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [peerConnections, setPeerConnections] = useState<Record<string, PeerConnection>>({});
	const [isMuted, setIsMuted] = useState(false);
	const [renderTrigger, setRenderTrigger] = useState(0); // Force re-render
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
	const socketRef = useRef<Socket | null>(null);
	const user = useSelector((state: RootState) => state.auth.user);

	useEffect(() => {
		if (!user?.id) {
			toast.error("Please log in to join the video call.");
			setTimeout(() => {
				onLeave();
			}, 3000);
			return;
		}

		// Initialize Socket.IO
		socketRef.current = io("http://localhost:5858", {
			withCredentials: true,
		});

		// Initialize WebRTC
		const init = async () => {
			try {
				// Get local media stream
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});
				console.log("Local stream tracks:", stream.getTracks());
				setLocalStream(stream);
				if (localVideoRef.current) {
					localVideoRef.current.srcObject = stream;
				}

				// Join session
				socketRef.current?.emit("join-session", { sessionId, userId: user.id });
			} catch (err) {
				console.error("Media access error:", err);
				toast.error("Failed to access camera or microphone.");
				onLeave();
			}
		};

		init();

		// Socket.IO event handlers
		const socket = socketRef.current;
		if (!socket) return;

		socket.on("user-joined", ({ socketId }) => {
			console.log(`User joined: ${socketId}`);
			createPeerConnection(socketId);
		});

		socket.on("offer", async ({ offer, from }) => {
			console.log(`Received offer from ${from}`);
			const pc = await handleOffer(offer, from);
			const answer = await pc.createAnswer();
			await pc.setLocalDescription(answer);
			socket.emit("answer", { sessionId, answer, to: from });
		});

		socket.on("answer", ({ answer, from }) => {
			console.log(`Received answer from ${from}`);
			const pc = peerConnections[from]?.pc;
			if (pc) {
				pc.setRemoteDescription(new RTCSessionDescription(answer)).catch((err) => {
					console.error(`Error setting remote description for ${from}:`, err);
				});
			}
		});

		socket.on("ice-candidate", ({ candidate, from }) => {
			console.log(`Received ICE candidate from ${from}`);
			const pc = peerConnections[from]?.pc;
			if (pc && candidate) {
				pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) => {
					console.error(`Error adding ICE candidate from ${from}:`, err);
				});
			}
		});

		socket.on("user-left", ({ socketId }) => {
			console.log(`User left: ${socketId}`);
			removePeerConnection(socketId);
		});

		return () => {
			// Cleanup
			localStream?.getTracks().forEach((track) => track.stop());
			Object.values(peerConnections).forEach(({ pc }) => pc.close());
			socket.disconnect();
			remoteVideoRefs.current = {};
		};
	}, [sessionId, user?.id, onLeave]);

	const assignStreamWithRetry = (socketId: string, remoteStream: MediaStream, retries = 5, delay = 500) => {
		const attemptAssign = (attempt: number) => {
			if (remoteVideoRefs.current[socketId]) {
				remoteVideoRefs.current[socketId]!.srcObject = remoteStream;
				console.log(`Assigned stream to video element for ${socketId} on attempt ${attempt}`);
			} else if (attempt < retries) {
				console.warn(`Video element not found for ${socketId}, retrying (${attempt + 1}/${retries})`);
				setTimeout(() => attemptAssign(attempt + 1), delay);
			} else {
				console.error(`Failed to assign stream for ${socketId} after ${retries} attempts`);
			}
		};
		attemptAssign(0);
	};

	const createPeerConnection = async (socketId: string) => {
		const pc = new RTCPeerConnection({
			iceServers: [
				{ urls: "stun:stun.l.google.com:19302" },
				// Add TURN server if needed
				// { urls: "turn:your-turn-server", username: "user", credential: "pass" },
			],
		});

		// Log connection state changes
		pc.oniceconnectionstatechange = () => {
			console.log(`ICE connection state for ${socketId}: ${pc.iceConnectionState}`);
		};
		pc.onconnectionstatechange = () => {
			console.log(`Connection state for ${socketId}: ${pc.connectionState}`);
		};

		// Add local stream tracks
		localStream?.getTracks().forEach((track) => {
			pc.addTrack(track, localStream);
		});

		// Handle incoming stream
		const remoteStream = new MediaStream();
		pc.ontrack = (event) => {
			console.log(`Received remote stream for ${socketId}`, event.streams);
			const videoTracks = event.streams[0].getVideoTracks();
			if (videoTracks.length === 0) {
				console.warn(`No video tracks in remote stream for ${socketId}`);
			}
			event.streams[0].getTracks().forEach((track) => {
				remoteStream.addTrack(track);
			});
			assignStreamWithRetry(socketId, remoteStream);
		};

		// Handle ICE candidates
		pc.onicecandidate = (event) => {
			if (event.candidate) {
				socketRef.current?.emit("ice-candidate", {
					sessionId,
					candidate: event.candidate,
					to: socketId,
				});
			}
		};

		setPeerConnections((prev) => ({
			...prev,
			[socketId]: { pc, socketId, stream: remoteStream },
		}));
		setRenderTrigger((prev) => prev + 1); // Force re-render

		// Create and send offer
		try {
			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);
			console.log(`Sending offer to ${socketId}`, offer);
			socketRef.current?.emit("offer", { sessionId, offer, to: socketId });
		} catch (err) {
			console.error(`Error creating offer for ${socketId}:`, err);
		}
	};

	const handleOffer = async (offer: RTCSessionDescriptionInit, from: string) => {
		const pc = new RTCPeerConnection({
			iceServers: [
				{ urls: "stun:stun.l.google.com:19302" },
				// Add TURN server if needed
				// { urls: "turn:your-turn-server", username: "user", credential: "pass" },
			],
		});

		// Log connection state changes
		pc.oniceconnectionstatechange = () => {
			console.log(`ICE connection state for ${from}: ${pc.iceConnectionState}`);
		};
		pc.onconnectionstatechange = () => {
			console.log(`Connection state for ${from}: ${pc.connectionState}`);
		};

		// Add local stream tracks
		localStream?.getTracks().forEach((track) => {
			pc.addTrack(track, localStream);
		});

		// Handle incoming stream
		const remoteStream = new MediaStream();
		pc.ontrack = (event) => {
			console.log(`Received remote stream for ${from}`, event.streams);
			const videoTracks = event.streams[0].getVideoTracks();
			if (videoTracks.length === 0) {
				console.warn(`No video tracks in remote stream for ${from}`);
			}
			event.streams[0].getTracks().forEach((track) => {
				remoteStream.addTrack(track);
			});
			assignStreamWithRetry(from, remoteStream);
		};

		// Handle ICE candidates
		pc.onicecandidate = (event) => {
			if (event.candidate) {
				socketRef.current?.emit("ice-candidate", {
					sessionId,
					candidate: event.candidate,
					to: from,
				});
			}
		};

		try {
			await pc.setRemoteDescription(new RTCSessionDescription(offer));
			console.log(`Set remote description for ${from}`);
			setPeerConnections((prev) => ({
				...prev,
				[from]: { pc, socketId: from, stream: remoteStream },
			}));
			setRenderTrigger((prev) => prev + 1); // Force re-render
			return pc;
		} catch (err) {
			console.error(`Error handling offer from ${from}:`, err);
			throw err;
		}
	};

	const removePeerConnection = (socketId: string) => {
		setPeerConnections((prev) => {
			const { [socketId]: removed, ...rest } = prev;
			if (removed) {
				removed.pc.close();
			}
			delete remoteVideoRefs.current[socketId];
			return rest;
		});
		setRenderTrigger((prev) => prev + 1); // Force re-render
	};

	const toggleMute = () => {
		if (localStream) {
			const audioTrack = localStream.getAudioTracks()[0];
			if (audioTrack) {
				audioTrack.enabled = !audioTrack.enabled;
				setIsMuted(!audioTrack.enabled);
			} else {
				console.warn("No audio track found in local stream");
			}
		}
	};

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Video Call - Session {sessionId}</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Local Video */}
				<div>
					<h3 className="text-lg font-semibold">You</h3>
					<video ref={localVideoRef} autoPlay muted playsInline className="w-full h-64 bg-black rounded" />
				</div>
				{/* Remote Videos */}
				{Object.entries(peerConnections).map(([socketId]) => (
					<div key={socketId}>
						<h3 className="text-lg font-semibold">Participant</h3>
						<video
							ref={(el) => {
								remoteVideoRefs.current[socketId] = el;
								console.log(`Assigned video ref for ${socketId}`, el);
								// Re-assign stream if already received
								const stream = peerConnections[socketId]?.stream;
								if (el && stream) {
									el.srcObject = stream;
									console.log(`Re-assigned stream for ${socketId} during render`);
								}
							}}
							autoPlay
							playsInline
							className="w-full h-64 bg-black rounded"
						/>
					</div>
				))}
			</div>
			<div className="mt-4 flex gap-4">
				<Button variant="destructive" onClick={onLeave}>
					Leave Call
				</Button>
				<Button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</Button>
			</div>
		</div>
	);
}

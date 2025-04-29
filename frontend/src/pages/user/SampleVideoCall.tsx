import { createPeerConnection } from "@/utility/webrtc";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5858");

const VideoGrid: React.FC<{ peers: { [id: string]: RTCPeerConnection } }> = ({ peers }) => {
	return (
		<div style={{ display: "flex", flexWrap: "wrap" }}>
			{Object.keys(peers).map((peerId) => (
				<video key={peerId} id={peerId} autoPlay playsInline style={{ width: 300 }} />
			))}
		</div>
	);
};

export const SampleVideoCall = () => {
	const [peers, setPeers] = useState<{ [id: string]: RTCPeerConnection }>({});
	const localVideoRef = useRef<HTMLVideoElement | null>(null);
	const [sessionId, setSessionId] = useState("");
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);

	// Setup listeners only once
	useEffect(() => {
		socket.on("user-joined", async (userId: string) => {
			if (!localStream) return;
			const pc = createPeerConnection(socket, userId, localStream, setPeers);
			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);
			socket.emit("send-offer", { target: userId, offer });
		});

		socket.on("receive-offer", async ({ sender, offer }) => {
			if (!localStream) return;
			const pc = createPeerConnection(socket, sender, localStream, setPeers);
			await pc.setRemoteDescription(new RTCSessionDescription(offer));
			const answer = await pc.createAnswer();
			await pc.setLocalDescription(answer);
			socket.emit("send-answer", { target: sender, answer });
		});

		socket.on("receive-answer", async ({ sender, answer }) => {
			const pc = peers[sender];
			await pc?.setRemoteDescription(new RTCSessionDescription(answer));
		});

		socket.on("receive-ice", ({ sender, candidate }) => {
			const pc = peers[sender];
			pc?.addIceCandidate(new RTCIceCandidate(candidate));
		});

		socket.on("user-left", (userId: string) => {
			if (peers[userId]) {
				peers[userId].close();
				delete peers[userId];
				setPeers({ ...peers });
			}
		});
	}, [localStream, peers]);

	// Called when "JOIN SESSION" button is clicked
	const joinRoom = async () => {
		if (!sessionId) return;

		const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
		setLocalStream(stream);

		if (localVideoRef.current) {
			localVideoRef.current.srcObject = stream;
		}

		socket.emit("join-room", sessionId); // Emit using typed sessionId
	};

	return (
		<div>
			<h1>👥 Group Video Call</h1>
			<input type="text" placeholder="Enter Session ID" value={sessionId} onChange={(e) => setSessionId(e.currentTarget.value)} />
			<button onClick={joinRoom}>JOIN SESSION</button>

			<video ref={localVideoRef} autoPlay playsInline muted style={{ width: 300 }} />
			<VideoGrid peers={peers} />
		</div>
	);
};

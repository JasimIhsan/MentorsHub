import React from "react";
import { Socket } from "socket.io-client";

export const createPeerConnection = (socket: Socket, peerId: string, stream: MediaStream, setPeers: React.Dispatch<React.SetStateAction<{ [id: string]: RTCPeerConnection }>>) => {
	const pc = new RTCPeerConnection({
		iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
	});

	stream.getTracks().forEach((track) => pc.addTrack(track, stream));

	pc.onicecandidate = (event) => {
		if (event.candidate) {
			socket.emit("send-ice-connection", { target: peerId, candidate: event.candidate });
		}
	};

	pc.ontrack = (event) => {
		const remoteVideo = document.getElementById(peerId) as HTMLVideoElement;
		if (remoteVideo) {
			remoteVideo.srcObject = event.streams[0];
		}
	};

	setPeers((prev) => ({ ...prev, [peerId]: pc }));
	return pc;
};

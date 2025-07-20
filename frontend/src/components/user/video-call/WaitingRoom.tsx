import { Button } from "@/components/ui/button";
import { TooltipProvider, TooltipTrigger, TooltipContent, Tooltip } from "@/components/ui/tooltip";
import { MicOffIcon, MicIcon, VideoIcon, VideoOffIcon, Loader2 } from "lucide-react";

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

export const WaitingRoom = ({ isRejected, rejectionMessage, videoRef, isMuted, isVideoOn, hasRequestedJoin, onToggleMute, onToggleVideo, onAskToJoin }: WaitingRoomProps) => {
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

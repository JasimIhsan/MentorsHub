import { cn } from "@/lib/utils";
import { TooltipProvider, TooltipTrigger, TooltipContent, Tooltip } from "@/components/ui/tooltip";
import { MicOffIcon, MicIcon, VideoIcon, VideoOffIcon, ScreenShareIcon, CircleDotIcon, HandIcon, ListIcon, UsersIcon, PhoneOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ControlBarProps {
	isMuted?: boolean;
	isVideoOn?: boolean;
	isScreenSharing?: boolean;
	isSidebarOpen?: boolean;
	isHandRaised?: boolean;
	isScreenRecording?: boolean;
	role?: "mentor" | "user" | null;
	joinRequestsCount?: number;
	onToggleMute?: () => void;
	onToggleVideo?: () => void;
	onToggleScreenShare?: () => void;
	onToggleSidebar?: () => void;
	onToggleRaiseHand?: () => void;
	onToggleScreenRecording?: () => void;
	onEndCall?: () => void;
	onOpenJoinRequests?: () => void;
}

export const ControlBar = ({
	isMuted,
	isVideoOn,
	isScreenSharing,
	isSidebarOpen,
	isHandRaised,
	isScreenRecording,
	role,
	joinRequestsCount = 0,
	onToggleMute,
	onToggleVideo,
	onToggleScreenShare,
	onToggleSidebar,
	onToggleRaiseHand,
	onToggleScreenRecording,
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
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant={isScreenRecording ? "destructive" : "secondary"} size="icon" onClick={onToggleScreenRecording} className="rounded-full h-12 w-12">
									<CircleDotIcon />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>{isScreenRecording ? "Stop screen recording" : "Start screen recording"}</p>
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

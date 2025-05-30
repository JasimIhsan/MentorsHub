// components/sessions/SessionParticipants.tsx
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ISessionMentorDTO } from "@/interfaces/ISessionDTO";

interface SessionParticipantsProps {
	participants: ISessionMentorDTO["participants"];
}

export default function SessionParticipants({ participants }: SessionParticipantsProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="flex items-center gap-2">
					<Users className="h-4 w-4" />
					<span>Participants ({participants.length})</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-64">
				{participants.length === 0 ? (
					<DropdownMenuItem disabled className="text-muted-foreground">
						No participants
					</DropdownMenuItem>
				) : (
					participants.map((participant) => (
						<DropdownMenuItem key={participant._id} className="flex items-center gap-2">
							<Avatar className="h-8 w-8">
								<AvatarImage src={participant.avatar} alt={`${participant.firstName} ${participant.lastName}`} />
								<AvatarFallback>{participant.firstName.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<span className="font-medium">
									{participant.firstName} {participant.lastName}
								</span>
								<span className="text-sm text-muted-foreground">Payment: {participant.paymentStatus || "N/A"}</span>
							</div>
						</DropdownMenuItem>
					))
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

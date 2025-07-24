import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Video, Users, IndianRupee, FileText } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ISessionMentorDTO } from "@/interfaces/session.interface";
import { formatTime } from "@/utility/time-data-formatter";

interface SessionCardProps {
	session: ISessionMentorDTO;
	onSelect: (session: ISessionMentorDTO) => void;
}

export function SessionCard({ session, onSelect }: SessionCardProps) {
	return (
		<Card className="overflow-hidden p-0">
			<CardContent className="p-6">
				<div className="flex flex-col md:flex-row gap-6">
					<div className="flex-1">
						<div className="flex justify-between items-center">
							<div>
								<h3 className="font-bold text-xl text-primary cursor-pointer hover:underline" onClick={() => onSelect(session)}>
									{session.topic}
								</h3>
							</div>
						</div>
						<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex items-center gap-2">
								<CalendarDays className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">
									{new Date(session.date).toLocaleString("en-US", {
										dateStyle: "medium",
									})}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">
									{formatTime(session.time)} ({session.hours} hours)
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Video className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{session.sessionFormat}</span>
							</div>
							<div className="flex items-center gap-2">
								<IndianRupee className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{session.pricing === "free" ? "Free" : `${session.totalAmount?.toFixed(2) || 0}`}</span>
							</div>
						</div>
					</div>
					<div className="flex justify-center items-center gap-2">
						<Badge variant={session.status === "completed" ? "outline" : "default"} className={`${session.status === "completed" ? "bg-primary/5 text-primary" : "bg-primary text-primary-foreground"} capitalize`}>
							{session.status}
						</Badge>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="flex items-center gap-2">
									<Users className="h-4 w-4" />
									<span>Participants ({session.participants.length})</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-64">
								{session.participants.length === 0 ? (
									<DropdownMenuItem disabled className="text-muted-foreground">
										No participants
									</DropdownMenuItem>
								) : (
									session.participants.map((participant) => (
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

						<Button variant="ghost" size="icon" onClick={() => onSelect(session)}>
							<FileText className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

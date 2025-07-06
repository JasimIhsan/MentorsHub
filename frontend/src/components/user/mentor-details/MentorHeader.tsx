import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { MessageSquare, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { IMentorDTO } from "@/interfaces/IMentorDTO";


interface MentorHeaderProps {
	mentor: IMentorDTO;
}

export function MentorHeader({ mentor }: MentorHeaderProps) {
	const [isAvatarOpen, setIsAvatarOpen] = useState(false);

	return (
		<div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
			<Dialog open={isAvatarOpen} onOpenChange={setIsAvatarOpen}>
				<DialogTrigger asChild>
					<button className="focus:outline-none">
						<Avatar className="h-32 w-32 border-4 border-primary/20 hover:opacity-80 transition-opacity cursor-pointer">
							<AvatarImage src={mentor.avatar ?? ""} alt={`${mentor.firstName || "Mentor"} ${mentor.lastName || ""}`} />
							<AvatarFallback>{mentor.firstName?.charAt(0) || "U"}</AvatarFallback>
						</Avatar>
					</button>
				</DialogTrigger>
				<DialogContent className="max-w-md">
					<img src={mentor.avatar ?? "https://via.placeholder.com/400"} alt={`${mentor.firstName || "Mentor"} ${mentor.lastName || ""}`} className="w-full h-auto rounded-lg" />
				</DialogContent>
			</Dialog>
			<div className="flex flex-1 flex-col gap-4 text-center md:text-left">
				<div>
					<div className="flex flex-col items-center gap-2 md:flex-row md:items-center">
						<h1 className="text-3xl font-bold">
							{mentor.firstName || "Unknown"} {mentor.lastName || "Mentor"}
						</h1>
						<div className="flex items-center">
							<Star className="ml-2 mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
							<span className="text-xl">{mentor.averageRating?.toFixed(1) ?? "N/A"}</span>
						</div>
					</div>
					<p className="text-xl text-muted-foreground">{mentor.professionalTitle || "No title provided"}</p>
				</div>
				<div className="flex flex-wrap justify-center gap-2 md:justify-start">
					{mentor.skills && mentor.skills.length > 0 ? (
						mentor.skills.map((skill: string) => (
							<Badge key={skill} variant="secondary">
								{skill}
							</Badge>
						))
					) : (
						<p className="text-sm text-muted-foreground">No skills listed</p>
					)}
				</div>
			</div>
			<div className="flex flex-col gap-3 w-full md:w-40">
				<Button className="w-full" asChild disabled={!mentor.userId}>
					<Link to={`/request-session/${mentor.userId || ""}`}>Request Session</Link>
				</Button>
				<Button variant="outline" className="w-full">
					<MessageSquare className="mr-2 h-4 w-4" />
					Message
				</Button>
			</div>
		</div>
	);
}

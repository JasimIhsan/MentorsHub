// src/components/dashboard/MentorsReadyNow.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Video, MessageSquare, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Mentor } from "@/interfaces/interfaces";

interface MentorsReadyNowProps {
	mentors: Mentor[];
}

const MentorsReadyNow: React.FC<MentorsReadyNowProps> = ({ mentors }) => {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl">Mentors Ready Now</CardTitle>
						<CardDescription>Connect with mentors available right now</CardDescription>
					</div>
					<Button variant="ghost" size="sm" asChild>
						<Link to="/ready-now">View All</Link>
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{mentors.map((mentor) => (
						<div key={mentor.id} className="flex items-start gap-4 rounded-lg border p-4">
							<Avatar className="h-12 w-12">
								<AvatarImage src={mentor.avatar} alt={mentor.name} />
								<AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<div className="flex items-center justify-between">
									<h3 className="font-semibold">{mentor.name}</h3>
									<div className="flex items-center gap-1">
										<span className="h-2 w-2 rounded-full bg-green-500"></span>
										<span className="text-xs text-muted-foreground">Available Now</span>
									</div>
								</div>
								<p className="text-sm text-muted-foreground">{mentor.expertise}</p>
								<div className="mt-2 flex flex-wrap gap-2">
									{mentor.tags.map((tag) => (
										<Badge key={tag} variant="secondary" className="text-xs">
											{tag}
										</Badge>
									))}
								</div>
								<div className="mt-2 flex items-center justify-between">
									<div className="flex items-center gap-1">
										{mentor.sessionType === "video" ? <Video className="h-4 w-4 text-muted-foreground" /> : <MessageSquare className="h-4 w-4 text-muted-foreground" />}
										<span className="text-xs text-muted-foreground">{mentor.sessionType === "video" ? "Video Call" : "Chat"}</span>
									</div>
									<div>
										{mentor.isPaid ? (
											<span className="text-sm font-medium">{mentor.rate}</span>
										) : (
											<Badge variant="outline" className="text-xs">
												Free
											</Badge>
										)}
									</div>
								</div>
							</div>
							<Button size="sm">Request Session</Button>
						</div>
					))}
					{mentors.length === 0 && (
						<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
							<Users className="mb-2 h-8 w-8 text-muted-foreground" />
							<p className="text-center text-muted-foreground">No mentors available right now</p>
							<Button className="mt-4" asChild>
								<Link to="/browse">Browse All Mentors</Link>
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default MentorsReadyNow;

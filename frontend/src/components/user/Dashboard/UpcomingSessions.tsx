import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { CalendarDays, Clock, User, Users2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CustomCardHeader } from "@/components/custom/CustomCardHeader";
import { ISessionUserDTO } from "@/interfaces/session.interface";
import { formatDate, formatTime } from "@/utility/time-data-formatter";

interface UpcomingSessionsProps {
	sessions: ISessionUserDTO[];
	isLoading: boolean; // Added isLoading prop
}

const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({ sessions, isLoading }) => {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<CustomCardHeader head="Upcoming Sessions" description="Your scheduled mentorship sessions" />
						<Skeleton className="bg-gray-200 h-8 w-full sm:w-24" /> {/* Skeleton for View All button */}
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{[1, 2].map((_, index) => (
							<div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-4">
								<div className="w-full sm:w-20 flex justify-center items-center h-20">
									<Skeleton className="bg-gray-200 h-10 w-10 sm:h-12 sm:w-12 rounded-full" /> {/* Skeleton for avatar */}
								</div>
								<div className="flex-1 space-y-2">
									<Skeleton className="bg-gray-200 h-5 w-48" /> {/* Skeleton for topic */}
									<Skeleton className="bg-gray-200 h-4 w-32" /> {/* Skeleton for mentor name */}
									<div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
										<Skeleton className="bg-gray-200 h-4 w-24" /> {/* Skeleton for date */}
										<Skeleton className="bg-gray-200 h-4 w-24" /> {/* Skeleton for time */}
										<Skeleton className="bg-gray-200 h-4 w-24" /> {/* Skeleton for session type */}
										<Skeleton className="bg-gray-200 h-4 w-24" /> {/* Skeleton for session format */}
									</div>
								</div>
								<div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mt-2 sm:mt-0">
									<Skeleton className="bg-gray-200 h-6 w-16" /> {/* Skeleton for badge */}
									<Skeleton className="bg-gray-200 h-8 w-full sm:w-28" /> {/* Skeleton for Join Session button */}
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<CustomCardHeader head="Upcoming Sessions" description="Your scheduled mentorship sessions" />
					<Button variant="ghost" size="sm" asChild className="w-full sm:w-auto">
						<Link to="/sessions">View All</Link>
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{sessions.map((session) => {
						const mentor = session.mentor;
						return (
							<div key={session.id} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-4">
								<div className="w-full sm:w-20 flex justify-center items-center h-20">
									<Avatar className="h-10 w-10 sm:h-12 sm:w-12">
										<AvatarImage src={mentor?.avatar} alt={mentor?.firstName} />
										<AvatarFallback>{mentor.firstName?.charAt(0)}</AvatarFallback>
									</Avatar>
								</div>
								<div className="flex-1 space-y-2">
									<h3 className="font-semibold text-base sm:text-lg">{session.topic}</h3>
									<p className="text-xs sm:text-sm text-muted-foreground">with {mentor.firstName + " " + mentor.lastName}</p>
									<div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
										<div className="flex items-center gap-1">
											<CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
											<span>{formatDate(session.date)}</span>
										</div>
										<div className="flex items-center gap-1">
											<Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
											<span>{`${formatTime(session.startTime)} - ${formatTime(session.endTime)}`}</span>
										</div>
										<div className="flex items-center gap-1">
											{session.sessionFormat === "one-on-one" ? <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" /> : <Users2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />}
											<span>{session.sessionFormat === "one-on-one" ? "One-on-One" : "Group"}</span>
										</div>
									</div>
								</div>
								<div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mt-2 sm:mt-0">
									<div>{session.pricing ? <Badge>Paid</Badge> : <Badge variant="outline">Free</Badge>}</div>
									<Button size="sm" className="w-full sm:w-auto">
										Join Session
									</Button>
								</div>
							</div>
						);
					})}
					{sessions.length === 0 && (
						<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
							<CalendarDays className="mb-2 h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
							<p className="text-xs sm:text-sm text-muted-foreground">No upcoming sessions</p>
							<Button className="mt-4 w-full sm:w-auto" asChild>
								<Link to="/browse">Find a Mentor</Link>
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default UpcomingSessions;

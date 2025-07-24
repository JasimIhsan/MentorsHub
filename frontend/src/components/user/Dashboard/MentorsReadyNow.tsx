import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { IMentorDTO } from "@/interfaces/mentor.interface";

interface TopRatedMentorsProps {
	mentors: IMentorDTO[];
	isLoading: boolean;
}

const TopRatedMentors: React.FC<TopRatedMentorsProps> = ({ mentors, isLoading }) => {
	return (
		<Card className="w-full max-w-md sm:max-w-full mx-auto">
			<CardHeader>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<CardTitle className="text-lg sm:text-xl">Top Rated Mentor in the Community</CardTitle>
						<CardDescription className="text-sm sm:text-base">Connect with our highest-rated mentors</CardDescription>
					</div>
					<Button variant="ghost" size="sm" asChild className="w-full sm:w-auto">
						<Link to="/top-rated">View All</Link>
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{isLoading ? (
						<div className="space-y-4">
							<div className="flex flex-col sm:flex-row sm:items-start gap-3 rounded-lg border p-3 sm:p-4">
								<Skeleton className="bg-gray-200 h-10 w-10 sm:h-12 sm:w-12 rounded-full self-center sm:self-start" /> {/* Skeleton for avatar */}
								<div className="flex-1 space-y-2">
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
										<Skeleton className="bg-gray-200 h-5 w-40" /> {/* Skeleton for mentor name */}
									</div>
									<Skeleton className="bg-gray-200 h-4 w-60" /> {/* Skeleton for primary expertise */}
									<div className="flex flex-wrap gap-2">
										<Skeleton className="bg-gray-200 h-5 w-20 rounded-full" /> {/* Skeleton for interest badge 1 */}
										<Skeleton className="bg-gray-200 h-5 w-20 rounded-full" /> {/* Skeleton for interest badge 2 */}
									</div>
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
										<div className="flex flex-wrap gap-3">
											<Skeleton className="bg-gray-200 h-4 w-24" /> {/* Skeleton for session type 1 */}
											<Skeleton className="bg-gray-200 h-4 w-24" /> {/* Skeleton for session type 2 */}
											<Skeleton className="bg-gray-200 h-4 w-16" /> {/* Skeleton for pricing */}
										</div>
									</div>
								</div>
								<Skeleton className="bg-gray-200 h-8 w-full sm:w-32 mt-2 sm:mt-0" /> {/* Skeleton for Request Session button */}
							</div>
						</div>
					) : mentors.length === 0 ? (
						<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 sm:p-8 text-center">
							<Users className="mb-2 h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
							<p className="text-xs sm:text-sm text-muted-foreground">No top-rated mentors available</p>
							<Button className="mt-4 w-full sm:w-auto" asChild>
								<Link to="/browse">Browse All Mentors</Link>
							</Button>
						</div>
					) : (
						mentors.map((mentor) => (
							<div key={mentor.id} className="flex flex-col sm:flex-row sm:items-start gap-3 rounded-lg border p-3 sm:p-4 hover:bg-gray-50 transition-colors">
								<Avatar className="h-10 w-10 sm:h-12 sm:w-12 self-center sm:self-start">
									<AvatarImage src={mentor.avatar!} alt={mentor.firstName} />
									<AvatarFallback>{mentor.firstName.charAt(0)}</AvatarFallback>
								</Avatar>
								<div className="flex-1 space-y-2">
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
										<h3 className="font-semibold text-base sm:text-lg">{mentor.firstName + " " + mentor.lastName}</h3>
									</div>
									<p className="text-xs sm:text-sm text-muted-foreground">{mentor.primaryExpertise}</p>
									<div className="flex flex-wrap gap-1 sm:gap-2">
										{mentor.interests &&
											mentor.interests.map((interest) => (
												<Badge key={interest} variant="secondary" className="text-xs sm:text-sm bg-gray-200 hover:bg-gray-300">
													{interest}
												</Badge>
											))}
									</div>
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
										<div className="flex flex-wrap gap-2 sm:gap-3">
											{mentor.pricing === "paid" || mentor.pricing === "both-pricing" ? (
												<span className="text-xs sm:text-sm text-muted-foreground font-medium">₹{mentor.hourlyRate}</span>
											) : (
												<Badge variant="outline" className="text-xs sm:text-sm">
													Free
												</Badge>
											)}
										</div>
									</div>
								</div>
								<Button size="sm" className="w-full sm:w-auto mt-2 sm:mt-0">
									Request Session
								</Button>
							</div>
						))
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default TopRatedMentors;

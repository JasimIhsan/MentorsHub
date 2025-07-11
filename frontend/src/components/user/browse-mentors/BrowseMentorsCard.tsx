import { Card, CardContent } from "@/components/ui/card";
import { INTEREST_OPTIONS } from "@/constants/interest.option";
import { IMentorDTO } from "@/interfaces/IMentorDTO";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import MentorBio from "./MentorsBio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const BrowseMentorsCard = ({ mentor }: { mentor: IMentorDTO }) => (
	<Card className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
		<div className="relative overflow-visible">
			<CardContent className="flex flex-1 flex-col px-6">
				<div className="flex items-center gap-5">
					<Avatar className="h-16 w-16 border-2 border-indigo-100">
						<AvatarImage src={mentor.avatar || ""} alt={mentor.firstName} />
						<AvatarFallback className="bg-indigo-50 text-indigo-600 text-xl">{mentor.firstName.charAt(0)}</AvatarFallback>
					</Avatar>
					<div>
						<h3 className="text-lg font-semibold text-gray-900 inline-flex items-center">{`${mentor.firstName} ${mentor.lastName}`}</h3>
						<p className="text-sm text-gray-500">{mentor.professionalTitle}</p>
					</div>
				</div>
				<div className="mt-5 flex flex-wrap gap-2">
					{mentor.interests && mentor.interests.length > 0 ? (
						mentor.interests.slice(0, 3).map((interest) => (
							<Badge key={interest} variant="default" className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-primary">
								{INTEREST_OPTIONS.find((opt) => opt.value === interest)?.label || interest}
							</Badge>
						))
					) : (
						<Badge variant="default" className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-primary">
							No interests
						</Badge>
					)}
				</div>
				<MentorBio bio={mentor.bio!} />
				<div className="mt-5 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
						<span className="text-base font-medium text-gray-900">{mentor.averageRating?.toFixed(1) ?? "N/A"}</span>
						<span className="text-sm text-gray-500">({mentor.totalReviews ?? 0})</span>
					</div>
					<span className="text-base font-semibold text-primary">{mentor.hourlyRate === 0 || !mentor.hourlyRate ? "FREE" : `₹${mentor.hourlyRate}/-`}</span>
				</div>
				<Button variant="default" size="lg" className="mt-6" asChild>
					<Link to={`/browse/mentor-profile/${mentor.userId}`}>View Profile</Link>
				</Button>
			</CardContent>
		</div>
	</Card>
);

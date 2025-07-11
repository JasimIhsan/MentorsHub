import { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useMentor } from "@/hooks/useMentor";
import { WeekDay } from "@/interfaces/IMentorDTO";
import { MentorAbout } from "@/components/user/mentor-details/MentorAbout";
import { MentorAvailability } from "@/components/user/mentor-details/MentorAvailibility";
import { MentorExperience } from "@/components/user/mentor-details/MentorExperience";
import { MentorReviews } from "@/components/user/mentor-details/MentorReviews";
import { MentorReviewModal } from "@/components/user/mentor-details/MentorReviewModal";
import { MentorDetailsSkeleton } from "@/components/user/mentor-details/MentorDetailsSkeleton";
import { MentorHeader } from "@/components/user/mentor-details/MentorHeader";
import { IReviewDTO } from "@/interfaces/review.dto";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Main Mentor Details Page Component
export function MentorDetailsPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [reviews, setReviews] = useState<IReviewDTO[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedRating, setSelectedRating] = useState<number | null>(null);
	const [reviewToEdit, setReviewToEdit] = useState<IReviewDTO | null>(null);
	const [selectedDay, setSelectedDay] = useState<WeekDay>(WeekDay.Monday);
	const [activeTab, setActiveTab] = useState("about");
	const { mentorId } = useParams<{ mentorId: string }>();
	const { mentor, loading } = useMentor(mentorId as string);
	const user = useSelector((state: RootState) => state.userAuth.user);

	if (loading) {
		return <MentorDetailsSkeleton />;
	}

	if (!mentor) {
		return (
			<div className="container py-8 px-10 md:px-20 xl:px-25">
				<div className="text-center">
					<h2 className="text-xl font-semibold mb-2">Mentor Not Found</h2>
					<p className="text-muted-foreground">The mentor profile could not be found.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col py-8 px-10 md:px-20 xl:px-25">
			<div className="flex flex-col gap-8">
				<MentorHeader mentor={mentor} userId={user?.id!} />
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<div className="flex items-center justify-between md:justify-start">
						<div className="block md:hidden">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="flex items-center gap-2">
										{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
										<MoreVertical className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									<DropdownMenuItem onClick={() => setActiveTab("about")}>About</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setActiveTab("experience")}>Experience</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setActiveTab("reviews")}>Reviews</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setActiveTab("availability")}>Availability</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<TabsList className="hidden md:flex w-full justify-start">
							<TabsTrigger value="about">About</TabsTrigger>
							<TabsTrigger value="experience">Experience</TabsTrigger>
							<TabsTrigger value="reviews">Reviews</TabsTrigger>
							<TabsTrigger value="availability">Availability</TabsTrigger>
						</TabsList>
					</div>
					<TabsContent value="about" className="mt-6">
						<MentorAbout mentor={mentor} />
					</TabsContent>
					<TabsContent value="experience" className="mt-6">
						<MentorExperience mentor={mentor} />
					</TabsContent>
					<TabsContent value="reviews" className="mt-6">
						<MentorReviews
							mentorId={mentorId as string}
							mentor={mentor}
							reviews={reviews}
							setReviews={setReviews}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							selectedRating={selectedRating}
							setSelectedRating={setSelectedRating}
							setReviewToEdit={setReviewToEdit}
							setIsModalOpen={setIsModalOpen}
						/>
					</TabsContent>
					<TabsContent value="availability" className="mt-6">
						<MentorAvailability mentor={mentor} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
					</TabsContent>
				</Tabs>
				<MentorReviewModal
					isOpen={isModalOpen}
					onClose={() => {
						setIsModalOpen(false);
						setReviewToEdit(null);
					}}
					mentor={{ id: mentor.userId, firstName: mentor.firstName, lastName: mentor.lastName }}
					setReviews={setReviews}
					reviewToEdit={reviewToEdit}
				/>
			</div>
		</div>
	);
}

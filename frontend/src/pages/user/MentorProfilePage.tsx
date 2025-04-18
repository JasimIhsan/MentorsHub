import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Clock, MessageSquare, Star, Video, Users, MapPin, Briefcase, GraduationCap, Award, User, Heart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMentor } from "@/api/mentors.api.service";
import { IMentorDTO } from "@/interfaces/mentor.application.dto";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const availableTimes: string[] = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"];

export function MentorProfilePage() {
	const [mentor, setMentor] = useState<IMentorDTO | null>(null);
	const [isAvatarOpen, setIsAvatarOpen] = useState(false);
	const { mentorId } = useParams<{ mentorId: string }>();

	useEffect(() => {
		const fetch = async () => {
			try {
				if (mentorId) {
					const response = await fetchMentor(mentorId);
					if (response.success) {
						setMentor(response.mentor);
					} else {
						toast.error("Failed to fetch mentor data");
					}
				}
			} catch (error) {
				if (error instanceof Error) {
					toast.error(error.message || "Error fetching mentor profile");
				}
			}
		};
		fetch();
	}, [mentorId]);

	if (!mentor) {
		return (
			<div className="container py-8 px-10 md:px-20 xl:px-25">
				<Card>
					<CardContent className="pt-6 text-center">
						<User className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
						<h2 className="text-xl font-semibold mb-2">Loading Profile...</h2>
						<p className="text-muted-foreground">Please wait while we fetch the mentor's profile.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container py-8 px-10 md:px-20 xl:px-25">
			<div className="flex flex-col gap-8">
				{/* Mentor Header */}
				<div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
					<Dialog open={isAvatarOpen} onOpenChange={setIsAvatarOpen}>
						<DialogTrigger asChild>
							<button className="focus:outline-none">
								<Avatar className="h-32 w-32 border-4 border-primary/20 hover:opacity-80 transition-opacity cursor-pointer">
									<AvatarImage src={mentor.avatar ?? ""} alt={`${mentor.firstName || "Mentor"} ${mentor.lastName || ""}`} />
									<AvatarFallback>
										{mentor.firstName?.charAt(0) || "U"}
									</AvatarFallback>
								</Avatar>
							</button>
						</DialogTrigger>
						<DialogContent className="max-w-md">
							<img
								src={mentor.avatar ?? "https://via.placeholder.com/400"}
								alt={`${mentor.firstName || "Mentor"} ${mentor.lastName || ""}`}
								className="w-full h-auto rounded-lg"
							/>
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
									<span className="font-medium">{mentor.rating ?? "N/A"}</span>
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
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-3"></div>
					</div>
					<div className="flex flex-col gap-3">
						<Button className="w-full" asChild disabled={!mentor.userId}>
							<Link to={`/request/${mentor.userId || ""}`}>Request Session</Link>
						</Button>
						<Button variant="outline" className="w-full">
							<MessageSquare className="mr-2 h-4 w-4" />
							Message
						</Button>
					</div>
				</div>

				{/* Main Content */}
				<Tabs defaultValue="about" className="w-full">
					<TabsList className="w-full justify-start">
						<TabsTrigger value="about">About</TabsTrigger>
						<TabsTrigger value="experience">Experience</TabsTrigger>
						<TabsTrigger value="reviews">Reviews</TabsTrigger>
						<TabsTrigger value="availability">Availability</TabsTrigger>
					</TabsList>

					<TabsContent value="about" className="mt-6">
						<div className="grid gap-6 md:grid-cols-3">
							<div className="md:col-span-2">
								<Card>
									<CardHeader>
										<CardTitle>About Me</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="leading-relaxed">{mentor.bio || "No biography provided."}</p>
										<div className="mt-8 grid gap-6 sm:grid-cols-2">
											<div className="flex items-start gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
													<Award className="h-5 w-5 text-primary" />
												</div>
												<div>
													<h3 className="font-medium">Expertise</h3>
													<p className="text-sm text-muted-foreground">
														{mentor.skills && mentor.skills.length > 0 ? mentor.skills.join(", ") : "No skills listed"}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
													<Briefcase className="h-5 w-5 text-primary" />
												</div>
												<div>
													<h3 className="font-medium">Experience</h3>
													<p className="text-sm text-muted-foreground">{mentor.yearsExperience ?? "Not specified"}</p>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
													<GraduationCap className="h-5 w-5 text-primary" />
												</div>
												<div>
													<h3 className="font-medium">Education</h3>
													<p className="text-sm text-muted-foreground max-w-2xs">
														{mentor.educations && mentor.educations.length > 0 ? mentor.educations.map((edu) => `${edu.degree || "Unknown"} from ${edu.institution || "Unknown"} (${edu.startYear || "N/A"}-${edu.endYear || "N/A"})`).join(", ") : "No education listed"}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
													<Clock className="h-5 w-5 text-primary" />
												</div>
												<div>
													<h3 className="font-medium">Availability</h3>
													<p className="text-sm text-muted-foreground">{mentor.availability?.join(", ") || "Not specified"}</p>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
													<Heart className="h-5 w-5 text-primary" />
												</div>
												<div>
													<h3 className="font-medium">Interests</h3>
													<p className="text-sm text-muted-foreground">
														{mentor.interests && mentor.interests.length > 0 ? mentor.interests.join(", ") : "No interests listed"}
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
							<div>
								<Card>
									<CardHeader>
										<CardTitle>Session Preferences</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<span className="font-medium">Rate</span>
												<span>{mentor.pricing === "free" ? "Free" : mentor.pricing === "paid" ? `${mentor.hourlyRate || "Contact for details"}/hr` : "Free or Paid"}</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="font-medium">Session Length</span>
												<span>60 minutes</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="font-medium">Session Type</span>
												<div className="flex items-center gap-1">
													{mentor.sessionTypes?.includes("video") ? (
														<Video className="h-4 w-4" />
													) : mentor.sessionTypes?.includes("text") ? (
														<MessageSquare className="h-4 w-4" />
													) : mentor.sessionTypes?.includes("in-person") ? (
														<MapPin className="h-4 w-4" />
													) : (
														<span>-</span>
													)}
													<span>{mentor.sessionTypes?.join(", ") || "Not specified"}</span>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span className="font-medium">Format</span>
												<div className="flex items-center gap-1">
													<Users className="h-4 w-4" />
													<span>{mentor.sessionFormat === "one-on-one" ? "One-on-One" : mentor.sessionFormat === "group" ? "Group" : "Not specified"}</span>
												</div>
											</div>
											<div className="pt-4">
												<Button className="w-full" asChild disabled={!mentor.userId}>
													<Link to={`/request/${mentor.userId || ""}`}>Request a Session</Link>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="experience" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Professional Experience</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-8">
									{mentor.workExperiences && mentor.workExperiences.length > 0 ? (
										mentor.workExperiences.map((work: { jobTitle: string; company: string; startDate: string; endDate: string | null; currentJob: boolean; description: string }, index: number) => (
											<div key={index} className="relative border-l-2 border-muted pl-6">
												<div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ${index === 0 ? "bg-primary" : "bg-muted"}`}></div>
												<div>
													<h3 className="font-bold">{work.jobTitle || "Unknown Position"}</h3>
													<p className="text-sm text-muted-foreground">
														{work.company || "Unknown Company"} • {work.startDate || "N/A"} - {work.endDate || "Present"}
													</p>
													<p className="mt-2">{work.description || "No description provided"}</p>
												</div>
											</div>
										))
									) : (
										<p className="text-muted-foreground">No work experience listed</p>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="reviews" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Reviews</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">No reviews available at this time.</p>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="availability" className="mt-6">
						<div className="grid gap-6 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Select a Date</CardTitle>
									<CardDescription>Choose a date to see available times</CardDescription>
								</CardHeader>
								<CardContent>
									<Calendar mode="single" className="rounded-md border" />
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Available Times</CardTitle>
									<CardDescription>Select a time slot for your session</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 gap-3">
										{availableTimes.map((time: string) => (
											<Button key={time} variant="outline" className="gap-2">
												<Clock className="h-4 w-4" />
												{time}
											</Button>
										))}
									</div>
									<div className="mt-6">
										<Button className="w-full" asChild disabled={!mentor.userId}>
											<Link to={`/request/${mentor.userId || ""}`}>Request Session</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
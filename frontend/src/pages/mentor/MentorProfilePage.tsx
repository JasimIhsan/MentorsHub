import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Camera, GraduationCap, BookOpen, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMentor } from "@/hooks/useMentor";
import { toast } from "sonner";
import { extractDocumentName } from "@/utility/extractDocumentName";
import { fetchDocumentUrlsAPI } from "@/api/admin/common/fetchDocuments";

export function MentorProfilePage() {
	const [isEditing, setIsEditing] = useState(false);
	const [newSkill, setNewSkill] = useState("");
	const user = useSelector((state: RootState) => state.auth.user);
	const { error, loading, mentor } = useMentor(user?.id as string);
	const [documentUrls, setDocumentUrls] = useState<string[]>([]);

	const handleAddSkill = () => {};

	const handleRemoveSkill = (_skill: string) => {};

	useEffect(() => {
		if (!user?.id) return;
		const fetchDocumentUrls = async () => {
			try {
				const response = await fetchDocumentUrlsAPI(user?.id as string);
				if (response.success) {
					setDocumentUrls(response.documents);
				}
			} catch (error) {
				console.error("Error fetching document URLs:", error);
				if (error instanceof Error) toast.error(error.message);
			}
		};
		fetchDocumentUrls();
	}, [user?.id]);

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	console.log(`documentUrls : `, documentUrls);

	if (loading) return <div>Loading...</div>;

	return (
		<div className="">
			<div className="">
				<div className="mb-8 flex items-center gap-4">
					<div className="flex-1">
						<h1 className="text-3xl font-bold tracking-tight">Mentor Profile</h1>
						<p className="text-muted-foreground">Manage how you appear to potential mentees</p>
					</div>
					<Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Cancel Editing" : "Edit Profile"}</Button>
				</div>

				{/* Profile Header */}
				<Card className="mb-8">
					<CardContent className="p-6">
						<div className="flex flex-col md:flex-row md:items-center gap-6">
							<div className="relative">
								<Avatar className="h-24 w-24 border-4 border-primary/20">
									<AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={`${mentor.firstName} ${mentor.lastName}`} />
									<AvatarFallback>
										{mentor.firstName.charAt(0)}
										{mentor.lastName.charAt(0)}
									</AvatarFallback>
								</Avatar>
								{isEditing && (
									<Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
										<Camera className="h-4 w-4" />
										<span className="sr-only">Change profile picture</span>
									</Button>
								)}
							</div>
							<div className="flex-1">
								{isEditing ? (
									<div className="space-y-4">
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="first-name">First Name</Label>
												<Input id="first-name" defaultValue={mentor.firstName} />
											</div>
											<div className="space-y-2">
												<Label htmlFor="last-name">Last Name</Label>
												<Input id="last-name" defaultValue={mentor.lastName} />
											</div>
										</div>
										<div className="space-y-2">
											<Label htmlFor="professional-title">Professional Title</Label>
											<Input id="professional-title" defaultValue={mentor.professionalTitle} />
										</div>
									</div>
								) : (
									<>
										<h2 className="text-2xl font-bold">
											{mentor.firstName} {mentor.lastName}
										</h2>
										<p className="text-lg text-muted-foreground">{mentor.professionalTitle}</p>
									</>
								)}
								<div className="mt-4 flex items-center gap-4">
									<div className="flex items-center gap-1">
										<Badge variant="secondary">{mentor.rating?.toFixed(1) || "N/A"}</Badge>
										<span className="text-sm text-muted-foreground">({mentor.reviews?.length || 0} reviews)</span>
									</div>
									<span className="text-sm text-muted-foreground">|</span>
									<span className="text-sm text-muted-foreground">{mentor.sessionCompleted || 0} sessions completed</span>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<Badge variant="outline" className="justify-center">
									{isEditing ? (
										<Select defaultValue="available">
											<SelectTrigger className="h-7 border-0 bg-transparent p-0">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="available">Available for Sessions</SelectItem>
												<SelectItem value="busy">Currently Busy</SelectItem>
												<SelectItem value="away">Away</SelectItem>
											</SelectContent>
										</Select>
									) : mentor.availability.length > 0 ? (
										"Available for Sessions"
									) : (
										"Currently Busy"
									)}
								</Badge>
								<Button variant="outline" size="sm" asChild>
									<Link to="/mentor/profile/preview">Preview Public Profile</Link>
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Main Content */}
				<Tabs defaultValue="about" className="w-full">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="about">About</TabsTrigger>
						<TabsTrigger value="experience">Experience</TabsTrigger>
						<TabsTrigger value="settings">Settings</TabsTrigger>
						<TabsTrigger value="reviews">Reviews</TabsTrigger>
					</TabsList>

					{/* About Tab */}
					<TabsContent value="about" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Professional Bio</CardTitle>
								<CardDescription>Tell potential mentees about yourself and your expertise</CardDescription>
							</CardHeader>
							<CardContent>
								{isEditing ? <Textarea className="min-h-[200px]" defaultValue={mentor.bio || ""} placeholder="Write about your experience and expertise..." /> : <p className="leading-relaxed">{mentor.bio || "No bio provided."}</p>}
							</CardContent>
						</Card>

						<Card className="mt-6">
							<CardHeader>
								<CardTitle>Skills & Expertise</CardTitle>
								<CardDescription>Add skills that you can mentor others in</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex flex-wrap gap-2">
										{mentor.skills && mentor.skills?.length > 0 ? (
											mentor.skills.map((skill) => (
												<Badge key={skill} variant="secondary" className={isEditing ? "gap-1 px-3 py-1" : ""}>
													{skill}
													{isEditing && (
														<button onClick={() => handleRemoveSkill(skill)} className="ml-1 rounded-full hover:bg-muted">
															<X className="h-3 w-3" />
															<span className="sr-only">Remove {skill}</span>
														</button>
													)}
												</Badge>
											))
										) : (
											<p className="text-sm text-muted-foreground">No skills added yet.</p>
										)}
									</div>

									{isEditing && (
										<div className="flex gap-2">
											<Input
												placeholder="Add a skill..."
												value={newSkill}
												onChange={(e) => setNewSkill(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														handleAddSkill();
													}
												}}
											/>
											<Button type="button" onClick={handleAddSkill} size="sm">
												<Plus className="h-4 w-4" />
												<span className="sr-only">Add Skill</span>
											</Button>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						<Card className="mt-6">
							<CardHeader>
								<CardTitle>Mentoring Preferences</CardTitle>
								<CardDescription>Your preferred mentoring style and approach</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{isEditing ? (
										<>
											<div className="space-y-2">
												<Label htmlFor="mentoring-style">Mentoring Style</Label>
												<Select defaultValue={mentor.sessionFormat}>
													<SelectTrigger id="mentoring-style">
														<SelectValue placeholder="Select style" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="one-on-one">One-on-One</SelectItem>
														<SelectItem value="group">Group</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<Label htmlFor="primary-expertise">Primary Expertise</Label>
												<Input id="primary-expertise" defaultValue={mentor.primaryExpertise} />
											</div>

											<div className="space-y-2">
												<Label htmlFor="languages">Languages</Label>
												<Textarea id="languages" defaultValue={mentor.languages.join(", ")} placeholder="Enter languages (comma-separated)" />
											</div>
										</>
									) : (
										<>
											<div className="grid gap-4 md:grid-cols-2">
												<div className="rounded-lg border p-4">
													<h3 className="font-medium">Mentoring Style</h3>
													<p className="text-sm text-muted-foreground">{mentor.sessionFormat === "one-on-one" ? "One-on-One" : "Group"}</p>
												</div>
												<div className="rounded-lg border p-4">
													<h3 className="font-medium">Primary Expertise</h3>
													<p className="text-sm text-muted-foreground">{mentor.primaryExpertise}</p>
												</div>
											</div>

											<div className="rounded-lg border p-4">
												<h3 className="font-medium">Languages</h3>
												<p className="text-sm text-muted-foreground">{mentor.languages.join(", ") || "No languages specified"}</p>
											</div>
										</>
									)}
								</div>
							</CardContent>
							{isEditing && (
								<CardFooter>
									<Button>Save Changes</Button>
								</CardFooter>
							)}
						</Card>
					</TabsContent>

					{/* Experience Tab */}
					<TabsContent value="experience" className="mt-6">
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>Work Experience</CardTitle>
										<CardDescription>Your professional background and experience</CardDescription>
									</div>
									{isEditing && (
										<Button size="sm">
											<Plus className="mr-2 h-4 w-4" />
											Add Experience
										</Button>
									)}
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{mentor.workExperiences.map((work, index) => (
										<div key={index} className="relative border-l-2 border-muted pl-6">
											<div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ${index === 0 ? "bg-primary" : "bg-muted"}`}></div>
											<div>
												{isEditing ? (
													<div className="space-y-4">
														<div className="space-y-2">
															<Label htmlFor={`job-title-${index}`}>Job Title</Label>
															<Input id={`job-title-${index}`} defaultValue={work.jobTitle} />
														</div>
														<div className="space-y-2">
															<Label htmlFor={`company-${index}`}>Company</Label>
															<Input id={`company-${index}`} defaultValue={work.company} />
														</div>
														<div className="space-y-2">
															<Label htmlFor={`period-${index}`}>Period</Label>
															<Input id={`period-${index}`} defaultValue={`${work.startDate} - ${work.endDate || "Present"}`} />
														</div>
														<div className="space-y-2">
															<Label htmlFor={`description-${index}`}>Description</Label>
															<Textarea id={`description-${index}`} defaultValue={work.description} />
														</div>
														<div className="flex justify-end">
															<Button variant="outline" size="sm">
																Remove
															</Button>
														</div>
													</div>
												) : (
													<>
														<h3 className="font-bold">{work.jobTitle}</h3>
														<p className="text-sm text-muted-foreground">
															{work.company} • {work.startDate} - {work.endDate || "Present"}
														</p>
														<p className="mt-2">{work.description}</p>
													</>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card className="mt-6">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>Education</CardTitle>
										<CardDescription>Your educational background</CardDescription>
									</div>
									{isEditing && (
										<Button size="sm">
											<Plus className="mr-2 h-4 w-4" />
											Add Education
										</Button>
									)}
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{mentor.educations.map((edu, index) => (
										<div key={index} className="flex items-start gap-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
												<GraduationCap className="h-5 w-5 text-primary" />
											</div>
											<div className="flex-1">
												{isEditing ? (
													<div className="space-y-4">
														<div className="space-y-2">
															<Label htmlFor={`degree-${index}`}>Degree</Label>
															<Input id={`degree-${index}`} defaultValue={edu.degree} />
														</div>
														<div className="space-y-2">
															<Label htmlFor={`institution-${index}`}>Institution</Label>
															<Input id={`institution-${index}`} defaultValue={edu.institution} />
														</div>
														<div className="space-y-2">
															<Label htmlFor={`years-${index}`}>Years</Label>
															<Input id={`years-${index}`} defaultValue={`${edu.startYear} - ${edu.endYear}`} />
														</div>
														<div className="flex justify-end">
															<Button variant="outline" size="sm">
																Remove
															</Button>
														</div>
													</div>
												) : (
													<>
														<h3 className="font-medium">{edu.degree}</h3>
														<p className="text-sm text-muted-foreground">
															{edu.institution} • {edu.startYear} - {edu.endYear}
														</p>
													</>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card className="mt-6">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>Certifications</CardTitle>
										<CardDescription>Your professional certifications</CardDescription>
									</div>
									{isEditing && (
										<Button size="sm">
											<Plus className="mr-2 h-4 w-4" />
											Add Certification
										</Button>
									)}
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{mentor.certifications.map((cert, index) => (
										<div key={index} className="flex items-start gap-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
												<BookOpen className="h-5 w-5 text-primary" />
											</div>
											<div className="flex-1">
												{isEditing ? (
													<div className="space-y-4">
														<div className="space-y-2">
															<Label htmlFor={`cert-name-${index}`}>Certification Name</Label>
															<Input id={`cert-name-${index}`} defaultValue={cert.name} />
														</div>
														<div className="space-y-2">
															<Label htmlFor={`issuer-${index}`}>Issuing Organization</Label>
															<Input id={`issuer-${index}`} defaultValue={cert.issuingOrg} />
														</div>
														<div className="space-y-2">
															<Label htmlFor={`year-${index}`}>Issue Date</Label>
															<Input id={`year-${index}`} defaultValue={cert.issueDate} />
														</div>
														<div className="space-y-2">
															<Label htmlFor={`expiry-${index}`}>Expiry Date</Label>
															<Input id={`expiry-${index}`} defaultValue={cert.expiryDate || ""} />
														</div>
														<div className="flex justify-end">
															<Button variant="outline" size="sm">
																Remove
															</Button>
														</div>
													</div>
												) : (
													<>
														<h3 className="font-medium">{cert.name}</h3>
														<p className="text-sm text-muted-foreground">
															{cert.issuingOrg} • {cert.issueDate} {cert.expiryDate ? ` - ${cert.expiryDate}` : ""}
														</p>
													</>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* documents */}
						<Card className="mt-6">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>Documents</CardTitle>
										<CardDescription>Documents that prove your qualifications</CardDescription>
									</div>
									{isEditing && (
										<Button size="sm">
											<Plus className="mr-2 h-4 w-4" />
											Add Documents
										</Button>
									)}
								</div>
							</CardHeader>
							<CardContent>
								{/* <div className="space-y-6">
									{mentor.documents.map((url, index) => (
										<div key={index} className="flex items-start gap-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
												<FileText className="h-5 w-5 text-primary" />
											</div>
											<div className="flex-1">
												<h3 className="font-medium">{extractDocumentName(url)}</h3>
											</div>
										</div>
									))}
								</div> */}

								<div className="grid gap-4">
									{documentUrls.length > 0 ? (
										documentUrls.map((url, i) => (
											<div key={i} className="flex items-center justify-between">
												<p className="text-sm">{extractDocumentName(url)}</p>
												<Button variant="outline" size="sm" asChild>
													<a href={url} download target="_blank" rel="noopener noreferrer">
														<Download className="mr-2 h-4 w-4" />
														Download
													</a>
												</Button>
											</div>
										))
									) : (
										<p className="text-sm text-muted-foreground">No documents available</p>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Settings Tab */}
					<TabsContent value="settings" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Session Settings</CardTitle>
								<CardDescription>Configure your mentoring session preferences</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="session-rate">Hourly Rate (USD)</Label>
									<div className="relative">
										<DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
										<Input id="session-rate" className="pl-9" defaultValue={mentor.hourlyRate || ""} />
									</div>
									<p className="text-xs text-muted-foreground">Set your hourly rate for paid sessions. The platform fee is 15%.</p>
								</div>

								<Separator />

								<div className="space-y-2">
									<Label>Session Types</Label>
									<div className="space-y-2">
										{["Video Calls", "Text Chat", "In-Person"].map((type) => (
											<div key={type} className="flex items-center space-x-2">
												<Switch id={type.toLowerCase().replace(" ", "-")} defaultChecked={mentor.sessionTypes.includes(type)} />
												<Label htmlFor={type.toLowerCase().replace(" ", "-")} className="font-normal">
													{type}
												</Label>
											</div>
										))}
									</div>
								</div>

								<Separator />

								<div className="space-y-2">
									<Label htmlFor="session-length">Default Session Length</Label>
									<Select defaultValue="60">
										<SelectTrigger id="session-length">
											<SelectValue placeholder="Select length" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="30">30 minutes</SelectItem>
											<SelectItem value="45">45 minutes</SelectItem>
											<SelectItem value="60">60 minutes</SelectItem>
											<SelectItem value="90">90 minutes</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<Separator />

								<div className="space-y-2">
									<Label>Visibility Settings</Label>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<Label htmlFor="profile-visibility">Public Profile</Label>
												<p className="text-sm text-muted-foreground">Make your profile visible to all users</p>
											</div>
											<Switch id="profile-visibility" defaultChecked />
										</div>
										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<Label htmlFor="availability-visibility">Show Availability</Label>
												<p className="text-sm text-muted-foreground">Display your available time slots on your profile</p>
											</div>
											<Switch id="availability-visibility" defaultChecked={mentor.availability.length > 0} />
										</div>
										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<Label htmlFor="featured-mentor">Featured Mentor</Label>
												<p className="text-sm text-muted-foreground">Apply to be featured on the homepage (requires admin approval)</p>
											</div>
											<Switch id="featured-mentor" defaultChecked={mentor.featuredMentor || false} />
										</div>
									</div>
								</div>
							</CardContent>
							<CardFooter>
								<Button>Save Settings</Button>
							</CardFooter>
						</Card>
					</TabsContent>

					{/* Reviews Tab */}
					<TabsContent value="reviews" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Reviews from Mentees</CardTitle>
								<CardDescription>Feedback from your mentoring sessions</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{reviews.map((review, index) => (
										<div key={index} className="rounded-lg bg-muted/50 p-4">
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10">
													<AvatarImage src={review.avatar} alt={review.name} />
													<AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
												</Avatar>
												<div>
													<div className="font-medium">{review.name}</div>
													<div className="flex items-center">
														<div className="flex">
															{Array(5)
																.fill(0)
																.map((_, i) => (
																	<Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`} />
																))}
														</div>
														<span className="ml-2 text-xs text-muted-foreground">{review.date}</span>
													</div>
												</div>
											</div>
											<p className="mt-3 text-sm">{review.comment}</p>
											{review.response && (
												<div className="mt-3 rounded-lg bg-background p-3">
													<p className="text-xs font-medium">Your Response:</p>
													<p className="text-xs">{review.response}</p>
												</div>
											)}
											{!review.response && (
												<div className="mt-3">
													<Button variant="outline" size="sm">
														Respond to Review
													</Button>
												</div>
											)}
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

// Icons
function DollarSign({ className }: { className?: string }) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
			<line x1="12" x2="12" y1="2" y2="22"></line>
			<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
		</svg>
	);
}

function Star({ className }: { className?: string }) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
			<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
		</svg>
	);
}

const reviews = [
	{
		name: "Alex Johnson",
		avatar: "/placeholder.svg",
		rating: 5,
		date: "March 15, 2025",
		comment: "John is an amazing mentor! He helped me understand complex React concepts and improved my coding skills significantly. His explanations are clear and he's very patient.",
		response: "Thank you for the kind words, Alex! It was a pleasure working with you on those React concepts. Looking forward to our next session!",
	},
	{
		name: "Emma Williams",
		avatar: "/placeholder.svg",
		rating: 5,
		date: "March 10, 2025",
		comment: "I had a great session with John. He provided valuable insights for my project and helped me solve a tricky bug that had been bothering me for days. Highly recommend!",
		response: null,
	},
	{
		name: "Ryan Davis",
		avatar: "/placeholder.svg",
		rating: 4,
		date: "March 5, 2025",
		comment: "John is very knowledgeable about JavaScript and React. He helped me understand some advanced concepts and provided good resources for further learning.",
		response: "Thanks for the feedback, Ryan! I'm glad I could help with those advanced concepts. The resources I shared should help you continue building on what we covered.",
	},
];

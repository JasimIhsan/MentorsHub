// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Label } from "@/components/ui/label";
// import { Edit, Camera, User, Info, BookOpen } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { getFullName } from "@/store/slices/authSlice";
// import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

// // Predefined options for skills and interests (you can fetch these from an API later)
// const SKILL_OPTIONS: Option[] = [
// 	{ label: "JavaScript", value: "javascript" },
// 	{ label: "React", value: "react" },
// 	{ label: "Python", value: "python" },
// 	{ label: "CSS", value: "css" },
// 	{ label: "Node.js", value: "nodejs" },
// 	{ label: "TypeScript", value: "typescript" },
// 	{ label: "HTML", value: "html" },
// ];

// const INTEREST_OPTIONS: Option[] = [
// 	{ label: "Web Development", value: "web-development" },
// 	{ label: "Machine Learning", value: "machine-learning" },
// 	{ label: "UI/UX Design", value: "ui-ux-design" },
// 	{ label: "DevOps", value: "devops" },
// 	{ label: "Cloud Computing", value: "cloud-computing" },
// 	{ label: "Data Science", value: "data-science" },
// 	{ label: "Cybersecurity", value: "cybersecurity" },
// ];

// export default function UserProfilePage() {
// 	const [isEditing, setIsEditing] = useState(false);
// 	const user = useSelector((state: RootState) => state.auth.user);
// 	const fullName = useSelector(getFullName);

// 	// Local state for skills and interests as Option[]
// 	const [skills, setSkills] = useState<Option[]>(user?.skills?.map((skill) => ({ label: skill, value: skill.toLowerCase() })) || []);
// 	const [interests, setInterests] = useState<Option[]>(user?.interests?.map((interest) => ({ label: interest, value: interest.toLowerCase() })) || []);

// 	// Session placeholders (not implemented)
// 	const pastSessions = [];
// 	const upcomingSessions = [];

// 	// Loading state
// 	const isLoading = !user;

// 	if (isLoading) {
// 		return (
// 			<div className="container py-8 px-10 md:px-20 xl:px-25 flex justify-center items-center h-screen">
// 				<p className="text-xl font-semibold text-muted-foreground animate-pulse">Loading your profile...</p>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="container py-8 px-10 md:px-20 xl:px-25">
// 			<div className="flex flex-col gap-8">
// 				{/* Profile Header */}
// 				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// 					<div className="flex items-center gap-4">
// 						<div className="relative">
// 							<Avatar className="h-24 w-24 border-4 border-primary/20">
// 								<AvatarImage src={user?.avatar ?? ""} alt={fullName} />
// 								<AvatarFallback>{`${user?.firstName?.slice(0, 1) ?? "U"}${user?.lastName?.slice(0, 1) ?? "N"}`}</AvatarFallback>
// 							</Avatar>
// 							{isEditing && (
// 								<Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
// 									<Camera className="h-4 w-4" />
// 									<span className="sr-only">Change profile picture</span>
// 								</Button>
// 							)}
// 						</div>
// 						<div>
// 							<h1 className="text-3xl font-bold tracking-tight">{fullName || "Welcome, New User!"}</h1>
// 							<p className="text-muted-foreground flex items-center gap-1">
// 								{user?.occupation || (
// 									<>
// 										<User className="h-4 w-4" />
// 										No occupation added yet
// 										{isEditing && <span className="text-sm ml-2 text-primary">— Add one below!</span>}
// 									</>
// 								)}
// 							</p>
// 						</div>
// 					</div>
// 					<Button onClick={() => setIsEditing(!isEditing)}>
// 						<Edit className="mr-2 h-4 w-4" />
// 						{isEditing ? "Cancel" : "Edit Profile"}
// 					</Button>
// 				</div>

// 				{/* Main Content */}
// 				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
// 					{/* Left Column */}
// 					<div className="space-y-6 lg:col-span-2">
// 						<Card>
// 							<CardHeader>
// 								<CardTitle>About Me</CardTitle>
// 								{!isEditing && <CardDescription>Tell us a bit about yourself to connect with mentors</CardDescription>}
// 							</CardHeader>
// 							<CardContent>
// 								{isEditing ? (
// 									<Textarea className="min-h-[150px]" defaultValue={user?.about || ""} placeholder="Share your story, goals, or interests..." />
// 								) : user?.about ? (
// 									<p>{user.about}</p>
// 								) : (
// 									<div className="text-muted-foreground flex items-center gap-2">
// 										<Info className="h-4 w-4" />
// 										<p>No about section yet. {isEditing ? "Add something above!" : "Edit your profile to add one!"}</p>
// 									</div>
// 								)}
// 							</CardContent>
// 							{isEditing && (
// 								<CardFooter>
// 									<Button>Save Changes</Button>
// 								</CardFooter>
// 							)}
// 						</Card>

// 						<Card>
// 							<CardHeader>
// 								<CardTitle>Skills & Interests</CardTitle>
// 								<CardDescription>Showcase your skills and learning goals</CardDescription>
// 							</CardHeader>
// 							<CardContent>
// 								<div className="space-y-6">
// 									{/* Skills Section */}
// 									<div>
// 										<h3 className="mb-2 font-medium">My Skills</h3>
// 										{skills.length > 0 ? (
// 											<div className="flex flex-wrap gap-2 mb-4">
// 												{skills.map((skill) => (
// 													<Badge key={skill.value} variant="secondary">
// 														{skill.label}
// 													</Badge>
// 												))}
// 											</div>
// 										) : (
// 											<div className="text-muted-foreground flex items-center gap-2 mb-4">
// 												<BookOpen className="h-4 w-4" />
// 												<p>No skills added yet. {isEditing ? "Add some below!" : "Edit to share your skills!"}</p>
// 											</div>
// 										)}
// 										{isEditing && (
// 											<MultipleSelector
// 												value={skills}
// 												onChange={setSkills}
// 												defaultOptions={SKILL_OPTIONS}
// 												placeholder="Select or type skills..."
// 												creatable // Allow users to create new skills not in the list
// 												emptyIndicator={<p className="text-center text-sm text-muted-foreground">No matching skills found.</p>}
// 												className="w-full"
// 											/>
// 										)}
// 									</div>

// 									{/* Interests Section */}
// 									<div>
// 										<h3 className="mb-2 font-medium">Learning Interests</h3>
// 										{interests.length > 0 ? (
// 											<div className="flex flex-wrap gap-2 mb-4">
// 												{interests.map((interest) => (
// 													<Badge key={interest.value} variant="outline">
// 														{interest.label}
// 													</Badge>
// 												))}
// 											</div>
// 										) : (
// 											<div className="text-muted-foreground flex items-center gap-2 mb-4">
// 												<BookOpen className="h-4 w-4" />
// 												<p>No interests added yet. {isEditing ? "Add some below!" : "Edit to share your interests!"}</p>
// 											</div>
// 										)}
// 										{isEditing && (
// 											<MultipleSelector
// 												value={interests}
// 												onChange={setInterests}
// 												defaultOptions={INTEREST_OPTIONS}
// 												placeholder="Select or type interests..."
// 												creatable // Allow users to create new interests not in the list
// 												emptyIndicator={<p className="text-center text-sm text-muted-foreground">No matching interests found.</p>}
// 												className="w-full"
// 											/>
// 										)}
// 									</div>
// 								</div>
// 							</CardContent>
// 						</Card>

// 						<Card>
// 							<CardHeader>
// 								<CardTitle>Session History</CardTitle>
// 								<CardDescription>Track your mentoring sessions</CardDescription>
// 							</CardHeader>
// 							<CardContent>
// 								<Tabs defaultValue="completed">
// 									<TabsList className="grid w-full grid-cols-2">
// 										<TabsTrigger value="completed">Completed</TabsTrigger>
// 										<TabsTrigger value="upcoming">Upcoming</TabsTrigger>
// 									</TabsList>
// 									<TabsContent value="completed" className="mt-4 space-y-4">
// 										{pastSessions.length > 0 ? (
// 											<p className="text-muted-foreground">Session rendering logic goes here</p>
// 										) : (
// 											<div className="text-muted-foreground flex items-center gap-2">
// 												<Info className="h-4 w-4" />
// 												<p>No completed sessions yet. Stay tuned for this feature!</p>
// 											</div>
// 										)}
// 									</TabsContent>
// 									<TabsContent value="upcoming" className="mt-4 space-y-4">
// 										{upcomingSessions.length > 0 ? (
// 											<p className="text-muted-foreground">Session rendering logic goes here</p>
// 										) : (
// 											<div className="text-muted-foreground flex items-center gap-2">
// 												<Info className="h-4 w-4" />
// 												<p>No upcoming sessions scheduled. Coming soon!</p>
// 											</div>
// 										)}
// 									</TabsContent>
// 								</Tabs>
// 							</CardContent>
// 						</Card>
// 					</div>

// 					{/* Right Column */}
// 					<div className="space-y-6">
// 						<Card>
// 							<CardHeader>
// 								<CardTitle>Personal Information</CardTitle>
// 							</CardHeader>
// 							<CardContent>
// 								<div className="space-y-4">
// 									<div className="space-y-2">
// 										<Label htmlFor="name">Full Name</Label>
// 										<Input id="name" defaultValue={fullName || ""} disabled={!isEditing} placeholder="Enter your name" />
// 									</div>
// 									<div className="space-y-2">
// 										<Label htmlFor="email">Email</Label>
// 										<Input id="email" type="email" defaultValue={user?.email || ""} disabled={!isEditing} placeholder="Enter your email" />
// 									</div>
// 								</div>
// 							</CardContent>
// 							{isEditing && (
// 								<CardFooter>
// 									<Button>Save Changes</Button>
// 								</CardFooter>
// 							)}
// 						</Card>

// 						<Card>
// 							<CardHeader>
// 								<CardTitle>Account Settings</CardTitle>
// 							</CardHeader>
// 							<CardContent>
// 								<div className="space-y-4">
// 									<Button variant="outline" className="w-full justify-start" asChild>
// 										<Link to="/settings/password">Change Password</Link>
// 									</Button>
// 									<Button variant="outline" className="w-full justify-start" asChild>
// 										<Link to="/settings/notifications">Notification Settings</Link>
// 									</Button>
// 									<Button variant="outline" className="w-full justify-start" asChild>
// 										<Link to="/settings/payment">Payment Methods</Link>
// 									</Button>
// 									<Button variant="outline" className="w-full justify-start" asChild>
// 										<Link to="/settings/privacy">Privacy Settings</Link>
// 									</Button>
// 								</div>
// 							</CardContent>
// 						</Card>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

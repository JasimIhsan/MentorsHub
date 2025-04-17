import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Check, Clock, Copy, Eye, LinkIcon, Mail, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MentorAvailabilityPage() {
	const [selectedMentees, setSelectedMentees] = useState<string[]>([]);
	const [availabilityType, setAvailabilityType] = useState("time-slots");
	const [linkCopied, setLinkCopied] = useState(false);
	const [showPreview, setShowPreview] = useState(false);
	const [customMessage, setCustomMessage] = useState("I'm available for mentoring sessions during these times. Feel free to book a slot that works for you!");
	const [availabilityDuration, setAvailabilityDuration] = useState("14");

	const handleMenteeSelection = (menteeId: string) => {
		if (selectedMentees.includes(menteeId)) {
			setSelectedMentees(selectedMentees.filter((id) => id !== menteeId));
		} else {
			setSelectedMentees([...selectedMentees, menteeId]);
		}
	};

	const handleCopyLink = () => {
		// In a real app, this would copy the actual link
		navigator.clipboard.writeText("https://your-platform.com/book/mentor/john-doe?token=abc123");
		setLinkCopied(true);
		// toast({
		// title: "Link copied!",
		// description: "The availability link has been copied to your clipboard.",
		// });
		setTimeout(() => setLinkCopied(false), 3000);
	};

	const handleSendAvailability = () => {
		// toast({
		// title: "Availability sent!",
		// description: `Your availability has been sent to ${selectedMentees.length} mentee(s).`,
		// });
		setSelectedMentees([]);
	};

	return (
		<div className="container py-8">
			<div className="mx-auto max-w-5xl">
				<div className="mb-8 flex items-center gap-4">
					<Button variant="outline" size="icon" asChild>
						<Link to="/mentor/availability">
							<ArrowLeft className="h-4 w-4" />
							<span className="sr-only">Back</span>
						</Link>
					</Button>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Share Availability</h1>
						<p className="text-muted-foreground">Send your availability to mentees or generate a booking link</p>
					</div>
				</div>

				<Tabs defaultValue="direct" className="space-y-8">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="direct">Direct Share</TabsTrigger>
						<TabsTrigger value="link">Generate Link</TabsTrigger>
					</TabsList>

					<TabsContent value="direct" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Select Availability Type</CardTitle>
								<CardDescription>Choose what type of availability you want to share</CardDescription>
							</CardHeader>
							<CardContent>
								<RadioGroup defaultValue="time-slots" value={availabilityType} onValueChange={setAvailabilityType} className="grid gap-4 md:grid-cols-2">
									<div>
										<RadioGroupItem value="time-slots" id="time-slots" className="peer sr-only" />
										<Label
											htmlFor="time-slots"
											className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
											<Clock className="mb-3 h-6 w-6" />
											<div className="text-center">
												<p className="font-medium">Specific Time Slots</p>
												<p className="text-sm text-muted-foreground">Share individual available time slots</p>
											</div>
										</Label>
									</div>
									<div>
										<RadioGroupItem value="calendar" id="calendar" className="peer sr-only" />
										<Label
											htmlFor="calendar"
											className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
											<Calendar className="mb-3 h-6 w-6" />
											<div className="text-center">
												<p className="font-medium">Full Calendar</p>
												<p className="text-sm text-muted-foreground">Share your entire availability calendar</p>
											</div>
										</Label>
									</div>
								</RadioGroup>

								<div className="mt-6">
									<Label>Availability Duration</Label>
									<Select value={availabilityDuration} onValueChange={setAvailabilityDuration}>
										<SelectTrigger className="mt-1.5">
											<SelectValue placeholder="Select duration" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="7">Next 7 days</SelectItem>
											<SelectItem value="14">Next 14 days</SelectItem>
											<SelectItem value="30">Next 30 days</SelectItem>
											<SelectItem value="60">Next 60 days</SelectItem>
											<SelectItem value="90">Next 90 days</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="mt-6">
									<Label htmlFor="custom-message">Personalized Message</Label>
									<Textarea id="custom-message" value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} className="mt-1.5 resize-none" rows={3} />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Select Mentees</CardTitle>
								<CardDescription>Choose which mentees to share your availability with</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex items-center mb-4">
									<Input placeholder="Search mentees..." className="max-w-sm" />
									<div className="ml-auto">
										<Button variant="outline" size="sm" onClick={() => setSelectedMentees(recentMentees.map((m) => m.id))}>
											Select All
										</Button>
									</div>
								</div>

								<div className="space-y-3">
									{recentMentees.map((mentee) => (
										<div
											key={mentee.id}
											className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${selectedMentees.includes(mentee.id) ? "border-primary bg-primary/5" : ""}`}
											onClick={() => handleMenteeSelection(mentee.id)}>
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10">
													<AvatarImage src={mentee.avatar} alt={mentee.name} />
													<AvatarFallback>{mentee.initials}</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">{mentee.name}</p>
													<p className="text-sm text-muted-foreground">{mentee.email}</p>
												</div>
											</div>
											<div className="flex items-center gap-3">
												<Badge variant="outline">{mentee.sessions} sessions</Badge>
												<div className="h-5 w-5 rounded-full border-2 flex items-center justify-center">{selectedMentees.includes(mentee.id) && <Check className="h-3 w-3" />}</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
							<CardFooter className="flex justify-between">
								<Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
									{showPreview ? "Hide Preview" : "Preview"}
									<Eye className="ml-2 h-4 w-4" />
								</Button>
								<Button onClick={handleSendAvailability} disabled={selectedMentees.length === 0}>
									Send Availability
									<Mail className="ml-2 h-4 w-4" />
								</Button>
							</CardFooter>
						</Card>

						{showPreview && (
							<Card>
								<CardHeader>
									<CardTitle>Preview</CardTitle>
									<CardDescription>This is how your availability will appear to mentees</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="max-w-xl mx-auto rounded-lg border p-6">
										<div className="flex items-center gap-3 mb-4">
											<Avatar className="h-12 w-12">
												<AvatarImage src="/placeholder.svg" alt="Mentor" />
												<AvatarFallback>JD</AvatarFallback>
											</Avatar>
											<div>
												<h3 className="font-semibold text-lg">John Doe</h3>
												<p className="text-sm text-muted-foreground">Senior Software Engineer</p>
											</div>
										</div>

										<p className="my-4 text-sm border-l-4 border-primary/50 pl-3 py-2 bg-muted/50 italic">{customMessage}</p>

										<div className="mb-4">
											<h4 className="font-medium mb-2 flex items-center">
												<Calendar className="mr-2 h-4 w-4" />
												Available Times {availabilityType === "time-slots" ? "(Next 14 days)" : ""}
											</h4>

											{availabilityType === "time-slots" ? (
												<div className="space-y-2">
													<div className="border rounded-md p-3">
														<p className="font-medium">Monday, March 25, 2025</p>
														<div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
															<Button variant="outline" size="sm" className="justify-start">
																<Clock className="mr-2 h-3 w-3" />
																10:00 AM - 11:00 AM
															</Button>
															<Button variant="outline" size="sm" className="justify-start">
																<Clock className="mr-2 h-3 w-3" />
																2:00 PM - 3:00 PM
															</Button>
															<Button variant="outline" size="sm" className="justify-start">
																<Clock className="mr-2 h-3 w-3" />
																4:00 PM - 5:00 PM
															</Button>
														</div>
													</div>
													<div className="border rounded-md p-3">
														<p className="font-medium">Wednesday, March 27, 2025</p>
														<div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
															<Button variant="outline" size="sm" className="justify-start">
																<Clock className="mr-2 h-3 w-3" />
																9:00 AM - 10:00 AM
															</Button>
															<Button variant="outline" size="sm" className="justify-start">
																<Clock className="mr-2 h-3 w-3" />
																11:00 AM - 12:00 PM
															</Button>
														</div>
													</div>
												</div>
											) : (
												<div className="border rounded-md p-3">
													<p className="text-center text-sm text-muted-foreground mb-2">Interactive calendar view showing all available slots</p>
													<div className="border rounded p-4 bg-muted/30 flex items-center justify-center h-[200px]">
														<p className="text-muted-foreground text-sm">[Calendar Interface]</p>
													</div>
												</div>
											)}
										</div>

										<div className="mt-6 flex justify-center">
											<Button className="w-full sm:w-auto">Book a Session</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						)}
					</TabsContent>

					<TabsContent value="link" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Generate Booking Link</CardTitle>
								<CardDescription>Create a link to share your availability with anyone</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-2">
									<Label>Link Type</Label>
									<RadioGroup defaultValue="default" className="grid gap-4 md:grid-cols-2">
										<div>
											<RadioGroupItem value="default" id="default-link" className="peer sr-only" />
											<Label
												htmlFor="default-link"
												className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
												<LinkIcon className="mb-3 h-6 w-6" />
												<div className="text-center">
													<p className="font-medium">Default Profile Link</p>
													<p className="text-sm text-muted-foreground">Use your standard booking page</p>
												</div>
											</Label>
										</div>
										<div>
											<RadioGroupItem value="custom" id="custom-link" className="peer sr-only" />
											<Label
												htmlFor="custom-link"
												className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
												<Share2 className="mb-3 h-6 w-6" />
												<div className="text-center">
													<p className="font-medium">Custom Availability Link</p>
													<p className="text-sm text-muted-foreground">Create a special link with custom settings</p>
												</div>
											</Label>
										</div>
									</RadioGroup>
								</div>

								<div>
									<div className="mb-4 space-y-2">
										<Label>Link Settings</Label>
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<div className="space-y-0.5">
													<Label>Expire After</Label>
													<p className="text-sm text-muted-foreground">Link becomes invalid after this period</p>
												</div>
												<Select defaultValue="never">
													<SelectTrigger className="w-32">
														<SelectValue placeholder="Select" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="7days">7 days</SelectItem>
														<SelectItem value="14days">14 days</SelectItem>
														<SelectItem value="30days">30 days</SelectItem>
														<SelectItem value="never">Never</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="flex items-center justify-between">
												<div className="space-y-0.5">
													<Label>Maximum Bookings</Label>
													<p className="text-sm text-muted-foreground">Limit total sessions bookable with this link</p>
												</div>
												<Select defaultValue="unlimited">
													<SelectTrigger className="w-32">
														<SelectValue placeholder="Select" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="1">1</SelectItem>
														<SelectItem value="3">3</SelectItem>
														<SelectItem value="5">5</SelectItem>
														<SelectItem value="10">10</SelectItem>
														<SelectItem value="unlimited">Unlimited</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="flex items-center justify-between">
												<div className="space-y-0.5">
													<div className="flex items-center gap-2">
														<Label>Require Approval</Label>
													</div>
													<p className="text-sm text-muted-foreground">You'll need to approve bookings manually</p>
												</div>
												<Switch defaultChecked={false} />
											</div>

											<div className="flex items-center justify-between">
												<div className="space-y-0.5">
													<div className="flex items-center gap-2">
														<Label>Direct Session Type</Label>
													</div>
													<p className="text-sm text-muted-foreground">Preset the session type for this link</p>
												</div>
												<Select defaultValue="none">
													<SelectTrigger className="w-48">
														<SelectValue placeholder="Select" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="none">None (User chooses)</SelectItem>
														<SelectItem value="intro">Introduction Meeting (30m)</SelectItem>
														<SelectItem value="mentoring">Mentoring Session (60m)</SelectItem>
														<SelectItem value="review">Code Review (45m)</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
									</div>

									<Separator className="my-6" />

									<div className="space-y-2">
										<Label>Your Booking Link</Label>
										<div className="flex">
											<Input readOnly value="https://your-platform.com/book/mentor/john-doe?token=abc123" className="rounded-r-none" />
											<Button onClick={handleCopyLink} variant={linkCopied ? "default" : "secondary"} className="rounded-l-none px-3">
												{linkCopied ? (
													<>
														<Check className="h-4 w-4 mr-2" />
														Copied
													</>
												) : (
													<>
														<Copy className="h-4 w-4 mr-2" />
														Copy
													</>
												)}
											</Button>
										</div>
									</div>
								</div>

								<div className="space-y-2">
									<Label>Quick Share</Label>
									<div className="flex flex-wrap gap-2">
										<Button variant="outline" className="gap-2">
											<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
												<path d="M22.1 7.5c0-.8-.6-1.5-1.5-1.5H15V4.5c0-.8-.6-1.5-1.5-1.5h-3C9.6 3 9 3.6 9 4.5V6H3.5C2.6 6 2 6.6 2 7.5v12C2 20.4 2.6 21 3.5 21h17.1c.8 0 1.5-.6 1.5-1.5v-12zM10.5 4.5h3V6h-3V4.5zM3.5 19.5v-12h17.1v12H3.5z" />
												<path d="M15.4 14.2c-.2-.1-.4-.2-.6-.1-1.2.5-2.5.5-3.6 0-.2-.1-.4 0-.6.1l-2.6 2.3V13c0-.2-.1-.4-.3-.4-1.1-.5-1.8-1.6-1.8-2.8 0-1.7 1.4-3.1 3.1-3.1h7.5c1.7 0 3.1 1.4 3.1 3.1 0 1.3-.8 2.4-1.8 2.8-.2.1-.3.2-.3.4v3.5l-2.1-2.3z" />
											</svg>
											Message
										</Button>
										<Button variant="outline" className="gap-2">
											<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
												<path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
											</svg>
											Email
										</Button>
										<Button variant="outline" className="gap-2">
											<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
												<path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
											</svg>
											Twitter
										</Button>
										<Button variant="outline" className="gap-2">
											<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
												<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
											</svg>
											LinkedIn
										</Button>
									</div>
								</div>
							</CardContent>
							<CardFooter>
								<Button className="w-full">Generate New Link</Button>
							</CardFooter>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Active Booking Links</CardTitle>
								<CardDescription>Manage your existing availability links</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{bookingLinks.map((link) => (
										<div key={link.id} className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4 gap-4">
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<h4 className="font-medium">{link.name}</h4>
													{link.active && (
														<Badge variant="outline" className="text-xs">
															Active
														</Badge>
													)}
													{!link.active && (
														<Badge variant="outline" className="bg-muted text-xs">
															Inactive
														</Badge>
													)}
												</div>
												<p className="text-sm text-muted-foreground mt-1 break-all">{link.url}</p>
												<div className="flex items-center gap-3 mt-2">
													<div className="text-xs text-muted-foreground flex items-center">
														<Calendar className="h-3 w-3 mr-1" />
														Created: {link.created}
													</div>
													<div className="text-xs text-muted-foreground flex items-center">
														<User className="h-3 w-3 mr-1" />
														Bookings: {link.bookings}
													</div>
												</div>
											</div>
											<div className="flex items-center gap-2 self-end sm:self-center">
												<Button variant="outline" size="sm">
													Copy
												</Button>
												<Button variant="outline" size="sm">
													Edit
												</Button>
												<Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
													Delete
												</Button>
											</div>
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

// Sample data
const recentMentees = [
	{
		id: "1",
		name: "Alex Johnson",
		email: "alex.johnson@example.com",
		avatar: "/placeholder.svg",
		initials: "AJ",
		sessions: 5,
	},
	{
		id: "2",
		name: "Emma Williams",
		email: "emma.williams@example.com",
		avatar: "/placeholder.svg",
		initials: "EW",
		sessions: 3,
	},
	{
		id: "3",
		name: "Michael Brown",
		email: "michael.brown@example.com",
		avatar: "/placeholder.svg",
		initials: "MB",
		sessions: 2,
	},
	{
		id: "4",
		name: "Sophia Lee",
		email: "sophia.lee@example.com",
		avatar: "/placeholder.svg",
		initials: "SL",
		sessions: 1,
	},
	{
		id: "5",
		name: "James Wilson",
		email: "james.wilson@example.com",
		avatar: "/placeholder.svg",
		initials: "JW",
		sessions: 0,
	},
];

const bookingLinks = [
	{
		id: "1",
		name: "General Availability",
		url: "https://your-platform.com/book/mentor/john-doe?token=abc123",
		active: true,
		created: "Mar 15, 2025",
		bookings: 12,
	},
	{
		id: "2",
		name: "Code Review Sessions",
		url: "https://your-platform.com/book/mentor/john-doe?token=def456&type=code-review",
		active: true,
		created: "Mar 10, 2025",
		bookings: 8,
	},
	{
		id: "3",
		name: "Career Guidance",
		url: "https://your-platform.com/book/mentor/john-doe?token=ghi789&type=career",
		active: false,
		created: "Feb 28, 2025",
		bookings: 5,
	},
];

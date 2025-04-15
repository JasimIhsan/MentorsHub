import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Calendar, CheckCircle, XCircle, Clock, Eye, Download, Filter, BriefcaseBusiness, GraduationCap, Check, X } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { IMentorDTO } from "@/interfaces/mentor.application.dto";
import axiosInstance from "@/api/api.config";
import { toast } from "sonner";

// Utility to generate a unique key for objects
const getUniqueKey = (item: any, index: number): string => {
	if (typeof item === "string") return `${item}-${index}`;
	if (item && typeof item === "object") {
		// Use index as primary differentiator to ensure uniqueness
		return `obj-${index}-${JSON.stringify(item).replace(/[^a-zA-Z0-9]/g, "")}`;
	}
	return `item-${index}`;
};

// Utility to render skills/interests safely
const renderItem = (item: any): string => {
	if (typeof item === "string") return item;
	if (item && typeof item === "object") {
		console.warn("Encountered object in skills/interests:", item);
		return JSON.stringify(item);
	}
	return "Unknown";
};

export function AdminMentorApplicationsPage() {
	const [mentors, setMentors] = useState<IMentorDTO[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");

	useEffect(() => {
		const fetchMentors = async () => {
			try {
				const response = await axiosInstance.get("/mentor/all");
				if (response.data.success) {
					const data = response.data.mentors;
					console.log('data: ', data);

					setMentors(data);
					toast.success("Mentors fetched successfully!");
				}
			} catch (error) {
				console.error("Error fetching mentors:", error);
				toast.error("Failed to fetch mentors.");
			}
		};
		fetchMentors();
	}, []);

	// Handle status update (approve/reject)
	const updateMentorStatus = async (userId: string, status: "approved" | "rejected", rejectionReason?: string) => {
		try {
			const response = await axiosInstance.put(`/mentor/${userId}/status`, {
				mentorRequestStatus: status,
				rejectionReason: status === "rejected" ? rejectionReason || "No reason provided" : undefined,
			});
			if (response.data.success) {
				setMentors((prev) => prev.map((mentor) => (mentor.userId === userId ? { ...mentor, mentorRequestStatus: status, rejectionReason: status === "rejected" ? rejectionReason : undefined } : mentor)));
				toast.success(`Mentor application ${status} successfully!`);
			}
		} catch (error) {
			console.error(`Error updating mentor status to ${status}:`, error);
			toast.error(`Failed to ${status} mentor application.`);
		}
	};

	// Filter mentors based on search query
	const filteredMentors = mentors.filter((mentor) => {
		const query = searchQuery.toLowerCase();
		const fullName = `${mentor.firstName} ${mentor.lastName}`.toLowerCase();
		const professionalTitle = mentor.professionalTitle?.toLowerCase() || "";
		const skills = Array.isArray(mentor.skills)
			? mentor.skills
					.map((s) => renderItem(s))
					.join(" ")
					.toLowerCase()
			: "";
		return fullName.includes(query) || professionalTitle.includes(query) || skills.includes(query);
	});

	// Categorize filtered mentors
	const pendingApplications = filteredMentors.filter((mentor) => mentor.mentorRequestStatus === "pending");
	const approvedApplications = filteredMentors.filter((mentor) => mentor.mentorRequestStatus === "approved");
	const rejectedApplications = filteredMentors.filter((mentor) => mentor.mentorRequestStatus === "rejected");

	return (
		<div className="container py-8">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-4">
					<h1 className="text-3xl font-bold tracking-tight">Mentor Applications</h1>
					<p className="text-muted-foreground">Review and manage mentor applications</p>
				</div>

				<div className="flex flex-col gap-6">
					{/* Search and Filters */}
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input placeholder="Search by name, title, or skills..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
						</div>
						<Button variant="outline">
							<Filter className="mr-2 h-4 w-4" />
							Filters
						</Button>
					</div>

					{/* Stats Cards */}
					<div className="grid gap-4 md:grid-cols-3">
						<StatCard icon={<Clock className="h-5 w-5 text-blue-600" />} label="Pending" count={pendingApplications.length} bgColor="bg-blue-100" />
						<StatCard icon={<CheckCircle className="h-5 w-5 text-green-600" />} label="Approved" count={approvedApplications.length} bgColor="bg-green-100" />
						<StatCard icon={<XCircle className="h-5 w-5 text-red-600" />} label="Rejected" count={rejectedApplications.length} bgColor="bg-red-100" />
					</div>

					{/* Applications List */}
					<Card>
						<CardHeader className="pb-0">
							<Tabs defaultValue="pending" className="w-full">
								<TabsList className="grid w-full grid-cols-3">
									<TabsTrigger value="pending">Pending</TabsTrigger>
									<TabsTrigger value="approved">Approved</TabsTrigger>
									<TabsTrigger value="rejected">Rejected</TabsTrigger>
								</TabsList>
								<TabsContent value="pending" className="mt-6">
									<ApplicationList applications={pendingApplications} updateMentorStatus={updateMentorStatus} />
								</TabsContent>
								<TabsContent value="approved" className="mt-6">
									<ApplicationList applications={approvedApplications} updateMentorStatus={updateMentorStatus} />
								</TabsContent>
								<TabsContent value="rejected" className="mt-6">
									<ApplicationList applications={rejectedApplications} updateMentorStatus={updateMentorStatus} />
								</TabsContent>
							</Tabs>
						</CardHeader>
					</Card>
				</div>
			</div>
		</div>
	);
}

function StatCard({ icon, label, count, bgColor }: { icon: JSX.Element; label: string; count: number; bgColor: string }) {
	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex items-center gap-4">
					<div className={`flex h-10 w-10 items-center justify-center rounded-full ${bgColor}`}>{icon}</div>
					<div>
						<p className="text-sm text-muted-foreground">{label}</p>
						<p className="text-2xl font-bold">{count}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function ApplicationList({ applications, updateMentorStatus }: { applications: IMentorDTO[]; updateMentorStatus: (userId: string, status: "approved" | "rejected", rejectionReason?: string) => void }) {
	return (
		<div className="space-y-4">
			{applications.length === 0 ? (
				<p className="text-center text-muted-foreground">No applications found.</p>
			) : (
				applications.map((application) => <ApplicationCard key={application.userId} application={application} updateMentorStatus={updateMentorStatus} />)
			)}
		</div>
	);
}

function ApplicationCard({ application, updateMentorStatus }: { application: IMentorDTO; updateMentorStatus: (userId: string, status: "approved" | "rejected", rejectionReason?: string) => void }) {
	const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
	const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
	const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");

	const handleApprove = () => {
		console.log("userId: ", application.userId);
		updateMentorStatus(application.userId, "approved");
	};

	const handleReject = () => {
		updateMentorStatus(application.userId, "rejected", rejectionReason || undefined);
		setIsRejectDialogOpen(false);
		setRejectionReason("");
	};

	return (
		<Card className="overflow-hidden">
			<CardContent className="p-0">
				<div className="flex flex-col md:flex-row">
					<div className="px-6 flex-1">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div className="flex items-start gap-4">
								<Avatar className="h-12 w-12">
									<AvatarImage src={application.avatar || undefined} />
									<AvatarFallback>{application.firstName?.charAt(0)}</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="font-bold text-lg">
										{application.firstName} {application.lastName}
									</h3>
									<p className="text-muted-foreground">{application.professionalTitle}</p>
									<div className="mt-2 flex flex-wrap items-center gap-4">
										<div className="flex items-center gap-1">
											<Calendar className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{new Date(application.createdAt).toDateString()}</span>
										</div>
										<div className="flex items-center gap-1">
											<BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{application.yearsExperience} Experience</span>
										</div>
										{application.educations.length > 0 && (
											<div className="flex items-center gap-1">
												<GraduationCap className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm">{application.educations[0].degree}</span>
											</div>
										)}
									</div>
									<div className="mt-2 flex flex-wrap gap-2">
										{application.skills &&
											application.skills.map((skill, i) => (
												<Badge key={getUniqueKey(skill, i)} variant="default">
													{renderItem(skill)}
												</Badge>
											))}
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<StatusBadge status={application.mentorRequestStatus} />
								<div className="flex gap-2">
									<Button variant="outline" size="sm">
										<Eye className="mr-2 h-4 w-4" />
										View Profile
									</Button>
									{/* <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
										<DialogTrigger asChild>
											<Button variant="outline" size="sm">
												<Eye className="mr-2 h-4 w-4" />
												View Profile
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-2xl">
											<DialogHeader>
												<DialogTitle>
													{application.firstName} {application.lastName}'s Profile
												</DialogTitle>
												<DialogDescription>Full details of the mentor's application</DialogDescription>
											</DialogHeader>
											<div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-4">
												<div className="flex items-center gap-4">
													<Avatar className="h-16 w-16">
														<AvatarImage src={application.avatar || undefined} />
														<AvatarFallback>{application.firstName?.charAt(0)}</AvatarFallback>
													</Avatar>
													<div>
														<h3 className="font-bold text-lg">
															{application.firstName} {application.lastName}
														</h3>
														<p className="text-sm text-muted-foreground">{application.professionalTitle}</p>
													</div>
												</div>
												<div>
													<h4 className="font-semibold">Email</h4>
													<p className="text-sm">{application.email}</p>
												</div>
												<div>
													<h4 className="font-semibold">Bio</h4>
													<p className="text-sm">{application.bio || "No bio provided"}</p>
												</div>
												<div>
													<h4 className="font-semibold">Role</h4>
													<p className="text-sm capitalize">{application.role}</p>
												</div>
												<div>
													<h4 className="font-semibold">Status</h4>
													<p className="text-sm capitalize">{application.status}</p>
												</div>
												<div>
													<h4 className="font-semibold">Mentor Request Status</h4>
													<p className="text-sm capitalize">{application.mentorRequestStatus}</p>
												</div>
												<div>
													<h4 className="font-semibold">Is Verified</h4>
													<p className="text-sm">{application.isVerified ? "Yes" : "No"}</p>
												</div>
												<div>
													<h4 className="font-semibold">Featured Mentor</h4>
													<p className="text-sm">{application.featuredMentor ? "Yes" : "No"}</p>
												</div>
												<div>
													<h4 className="font-semibold">Created At</h4>
													<p className="text-sm">{new Date(application.createdAt).toLocaleDateString()}</p>
												</div>
												<div>
													<h4 className="font-semibold">Updated At</h4>
													<p className="text-sm">{new Date(application.updatedAt).toLocaleDateString()}</p>
												</div>
												<div>
													<h4 className="font-semibold">Last Active</h4>
													LOCKED
													<p className="text-sm">{application.lastActive ? new Date(application.lastActive).toLocaleDateString() : "Not active yet"}</p>
												</div>
												<div>
													<h4 className="font-semibold">Sessions Completed</h4>
													<p className="text-sm">{application.sessionCompleted ?? "None"}</p>
												</div>
												<div>
													<h4 className="font-semibold">Primary Expertise</h4>
													<p className="text-sm">{application.primaryExpertise || "Not specified"}</p>
												</div>
												<div>
													<h4 className="font-semibold">Years of Experience</h4>
													<p className="text-sm">{application.yearsExperience || "Not specified"}</p>
												</div>
												<div>
													<h4 className="font-semibold">Skills</h4>
													<div className="flex flex-wrap gap-2">
														{application.skills?.length ? (
															application.skills.map((skill, i) => (
																<Badge key={getUniqueKey(skill, i)} variant="default">
																	{renderItem(skill)}
																</Badge>
															))
														) : (
															<p className="text-sm text-muted-foreground">No skills listed</p>
														)}
													</div>
												</div>
												<div>
													<h4 className="font-semibold">Interests</h4>
													<div className="flex flex-wrap gap-2">
														{application.interests?.length ? (
															application.interests.map((interest, i) => (
																<Badge key={getUniqueKey(interest, i)} variant="default">
																	{renderItem(interest)}
																</Badge>
															))
														) : (
															<p className="text-sm text-muted-foreground">No interests listed</p>
														)}
													</div>
												</div>
												<div>
													<h4 className="font-semibold">Languages</h4>
													<div className="flex flex-wrap gap-2">
														{application.languages?.length ? (
															application.languages.map((lang, i) => (
																<Badge key={getUniqueKey(lang, i)} variant="default">
																	{lang}
																</Badge>
															))
														) : (
															<p className="text-sm text-muted-foreground">No languages listed</p>
														)}
													</div>
												</div>
												<div>
													<h4 className="font-semibold">Work Experiences</h4>
													{application.workExperiences?.length ? (
														application.workExperiences.map((exp, i) => (
															<div key={getUniqueKey(exp.jobTitle + exp.company, i)} className="mt-2">
																<p className="text-sm font-medium">
																	{exp.jobTitle} at {exp.company}
																</p>
																<p className="text-sm text-muted-foreground">
																	{exp.startDate} - {exp.endDate || "Present"} {exp.currentJob && "(Current)"}
																</p>
																<p className="text-sm">{exp.description}</p>
															</div>
														))
													) : (
														<p className="text-sm text-muted-foreground">No work experiences listed</p>
													)}
												</div>
												<div>
													<h4 className="font-semibold">Education</h4>
													{application.educations?.length ? (
														application.educations.map((edu, i) => (
															<p key={getUniqueKey(edu.degree + edu.institution, i)} className="text-sm">
																{edu.degree} from {edu.institution} ({edu.startYear} - {edu.endYear})
															</p>
														))
													) : (
														<p className="text-sm text-muted-foreground">No education listed</p>
													)}
												</div>
												<div>
													<h4 className="font-semibold">Certifications</h4>
													{application.certifications?.length ? (
														application.certifications.map((cert, i) => (
															<div key={getUniqueKey(cert.name + cert.issuingOrg, i)} className="mt-2">
																<p className="text-sm font-medium">{cert.name}</p>
																<p className="text-sm text-muted-foreground">
																	Issued by {cert.issuingOrg} on {cert.issueDate}
																	{cert.expiryDate && `, expires ${cert.expiryDate}`}
																</p>
															</div>
														))
													) : (
														<p className="text-sm text-muted-foreground">No certifications listed</p>
													)}
												</div>
												<div>
													<h4 className="font-semibold">Session Format</h4>
													<p className="text-sm capitalize">{application.sessionFormat || "Not specified"}</p>
												</div>
												<div>
													<h4 className="font-semibold">Session Types</h4>
													<div className="flex flex-wrap gap-2">
														{application.sessionTypes?.length ? (
															application.sessionTypes.map((type, i) => (
																<Badge key={getUniqueKey(type, i)} variant="default">
																	{type}
																</Badge>
															))
														) : (
															<p className="text-sm text-muted-foreground">No session types listed</p>
														)}
													</div>
												</div>
												<div>
													<h4 className="font-semibold">Pricing</h4>
													<p className="text-sm capitalize">{application.pricing || "Not specified"}</p>
												</div>
												<div>
													<h4 className="font-semibold">Hourly Rate</h4>
													<p className="text-sm">{application.hourlyRate || "Not specified"}</p>
												</div>
												<div>
													<h4 className="font-semibold">Availability</h4>
													<div className="flex flex-wrap gap-2">
														{application.availability?.length ? (
															application.availability.map((slot, i) => (
																<Badge key={getUniqueKey(slot, i)} variant="default">
																	{slot}
																</Badge>
															))
														) : (
															<p className="text-sm text-muted-foreground">No availability listed</p>
														)}
													</div>
												</div>
												<div>
													<h4 className="font-semibold">Rating</h4>
													<p className="text-sm">{application.rating ? `${application.rating}/5` : "Not rated"}</p>
												</div>
												<div>
													<h4 className="font-semibold">Badges</h4>
													<div className="flex flex-wrap gap-2">
														{application.badges?.length ? (
															application.badges.map((badge, i) => (
																<Badge key={getUniqueKey(badge, i)} variant="default">
																	{badge}
																</Badge>
															))
														) : (
															<p className="text-sm text-muted-foreground">No badges earned</p>
														)}
													</div>
												</div>
												<div>
													<h4 className="font-semibold">User ID</h4>
													<p className="text-sm">{application.userId}</p>
												</div>
											</div>
											<DialogFooter>
												<Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
													Close
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog> */}
									<Dialog open={isDocumentsDialogOpen} onOpenChange={setIsDocumentsDialogOpen}>
										<DialogTrigger asChild>
											<Button variant="outline" size="sm">
												<Download className="mr-2 h-4 w-4" />
												Documents
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Application Documents</DialogTitle>
												<DialogDescription>
													Documents submitted by {application.firstName} {application.lastName}
												</DialogDescription>
											</DialogHeader>
											<div className="grid gap-4">
												{application.documents?.length ? (
													application.documents.map((fileUrl, i) => (
														<div key={getUniqueKey(fileUrl, i)} className="flex items-center justify-between">
															<p className="text-sm">{fileUrl.split("/").pop() || `Document ${i + 1}`}</p>
															<Button variant="outline" size="sm" asChild>
																<a href={fileUrl} download target="_blank" rel="noopener noreferrer">
																	<Download className="mr-2 h-4 w-4" />
																	Download
																</a>
															</Button>
														</div>
													))
												) : (
													<p className="text-sm text-muted-foreground">No documents attached</p>
												)}
											</div>
											<DialogFooter>
												<Button variant="outline" onClick={() => setIsDocumentsDialogOpen(false)}>
													Close
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
									{application.mentorRequestStatus === "pending" && (
										<>
											<Button variant="default" size="sm" onClick={handleApprove}>
												<Check className="mr-2 h-4 w-4" />
												Approve
											</Button>
											<Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
												<DialogTrigger asChild>
													<Button variant="destructive" size="sm">
														<X className="mr-2 h-4 w-4" />
														Reject
													</Button>
												</DialogTrigger>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>Reject Mentor Application</DialogTitle>
														<DialogDescription>
															Please provide a reason for rejecting {application.firstName} {application.lastName}'s application (optional).
														</DialogDescription>
													</DialogHeader>
													<Textarea placeholder="Enter rejection reason..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="mt-4" />
													<DialogFooter>
														<Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
															Cancel
														</Button>
														<Button variant="destructive" onClick={handleReject}>
															Confirm Reject
														</Button>
													</DialogFooter>
												</DialogContent>
											</Dialog>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" | "not-requested" }) {
	const map: Record<string, { label: string; color: string }> = {
		pending: { label: "Pending", color: "bg-blue-50 text-blue-600 border-blue-200" },
		approved: { label: "Approved", color: "bg-green-50 text-green-600 border-green-200" },
		rejected: { label: "Rejected", color: "bg-red-50 text-red-600 border-red-200" },
		"not-requested": { label: "Not Requested", color: "bg-gray-50 text-gray-600 border-gray-200" },
	};

	return (
		<Badge variant="outline" className={map[status]?.color}>
			{map[status]?.label || "Unknown"}
		</Badge>
	);
}

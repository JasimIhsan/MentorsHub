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
import axiosInstance from "@/api/config/api.config";
import { toast } from "sonner";
import Alert from "@/components/common/alert";
import { useDispatch } from "react-redux";
import { updateRole } from "@/store/slices/userSlice";
import { fetchAllMentors } from "@/api/mentors.api.service";

// Utility to generate a unique key for objects
const getUniqueKey = (item: any, index: number): string => {
	if (typeof item === "string") return `${item}-${index}`;
	if (item && typeof item === "object") {
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
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchMentors = async () => {
			try {
				const response = await fetchAllMentors();
				if (response.success) {
					const data = response.mentors;
					dispatch(updateRole("mentor"));
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

	const updateMentorStatus = async (userId: string, status: "approved" | "rejected", rejectionReason?: string) => {
		try {
			const response = await axiosInstance.put(`/admin/mentor-application/${userId}/verify`, {
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

					<div className="grid gap-4 md:grid-cols-3">
						<StatCard icon={<Clock className="h-5 w-5 text-blue-600" />} label="Pending" count={pendingApplications.length} bgColor="bg-blue-100" />
						<StatCard icon={<CheckCircle className="h-5 w-5 text-green-600" />} label="Approved" count={approvedApplications.length} bgColor="bg-green-100" />
						<StatCard icon={<XCircle className="h-5 w-5 text-red-600" />} label="Rejected" count={rejectedApplications.length} bgColor="bg-red-100" />
					</div>

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
	const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");
	const [documentUrls, setDocumentUrls] = useState<string[]>([]);
	const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

	const fetchDocumentUrls = async () => {
		setIsLoadingDocuments(true);
		try {
			const response = await axiosInstance.get(`/documents/${application.userId}/documents`);
			if (response.data.success) {
				setDocumentUrls(response.data.documents);
				toast.success("Documents fetched successfully!");
			} else {
				toast.error("Failed to fetch documents.");
			}
		} catch (error) {
			console.error("Error fetching document URLs:", error);
			toast.error("Failed to fetch documents.");
		} finally {
			setIsLoadingDocuments(false);
		}
	};

	const handleApprove = () => {
		updateMentorStatus(application.userId, "approved");
	};

	const handleReject = () => {
		updateMentorStatus(application.userId, "rejected", rejectionReason || undefined);
		setIsRejectDialogOpen(false);
		setRejectionReason("");
	};

	useEffect(() => {
		if (isDocumentsDialogOpen) {
			fetchDocumentUrls();
		}
	}, [isDocumentsDialogOpen]);

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
												{isLoadingDocuments ? (
													<p className="text-sm text-muted-foreground">Loading documents...</p>
												) : documentUrls.length > 0 ? (
													documentUrls.map((url, i) => (
														<div key={getUniqueKey(url, i)} className="flex items-center justify-between">
															<p className="text-sm">{url.split("/").pop()?.split("?")[0] || `Document ${i + 1}`}</p>
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
											<DialogFooter>
												<Button variant="outline" onClick={() => setIsDocumentsDialogOpen(false)}>
													Close
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
									{application.mentorRequestStatus === "pending" && (
										<>
											<Alert
												triggerElement={
													<Button variant="default" size="sm">
														<Check className="mr-2 h-4 w-4" />
														Approve
													</Button>
												}
												contentTitle="Confirm Approval"
												contentDescription="Are you sure you want to approve this item? This action cannot be undone."
												actionText="Confirm"
												onConfirm={handleApprove}
											/>
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

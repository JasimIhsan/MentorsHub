import { useEffect, useState } from "react";
import { IMentorDTO } from "@/interfaces/IMentorDTO";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { BriefcaseBusiness, Calendar, Check, Download, Eye, GraduationCap, X } from "lucide-react";
import { toast } from "sonner";
import {Alert} from "@/components/custorm/alert";
import StatusBadge from "./StatusBadge";
import { fetchDocumentUrlsAPI } from "@/api/admin/common/fetchDocuments";
import { extractDocumentName } from "@/utility/extractDocumentName";
import { getUniqueKey, renderItem } from "@/utility/uniqueKey";

interface ApplicationCardProps {
	application: IMentorDTO;
	updateMentorStatus: (userId: string, status: "approved" | "rejected", rejectionReason?: string) => void;
	onViewDetails: (mentor: IMentorDTO) => void;
}

export default function ApplicationCard({ application, updateMentorStatus , onViewDetails}: ApplicationCardProps) {
	const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
	const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");
	const [documentUrls, setDocumentUrls] = useState<string[]>([]);
	const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

	const fetchDocumentUrls = async () => {
		setIsLoadingDocuments(true);
		try {
			const response = await fetchDocumentUrlsAPI(application.userId);
			if (response.success) {
				setDocumentUrls(response.documents);
				toast.success("Documents fetched successfully!");
			}
		} catch (error) {
			console.error("Error fetching document URLs:", error);
			if (error instanceof Error) toast.error(error.message);
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
									<Button variant="outline" size="sm" onClick={() => onViewDetails(application)}>
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

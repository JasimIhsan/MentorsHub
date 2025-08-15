import { useState } from "react";
import { IMentorDTO } from "@/interfaces/mentor.interface";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { BriefcaseBusiness, Calendar, Check, Eye, GraduationCap, X } from "lucide-react";
import { Alert } from "@/components/custom/alert";
import StatusBadge from "./StatusBadge";
import { extractDocumentName } from "@/utility/extractDocumentName";
import { getUniqueKey, renderItem } from "@/utility/uniqueKey";
import { fetchDocumentUrlByKeyAPI } from "@/api/admin/common/fetchDocuments";

interface ApplicationCardProps {
	application: IMentorDTO;
	updateMentorStatus: (userId: string, status: "approved" | "rejected", rejectionReason?: string) => void;
	onViewDetails: (mentor: IMentorDTO) => void;
}

export default function ApplicationCard({ application, updateMentorStatus, onViewDetails }: ApplicationCardProps) {
	const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
	const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");
	const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
	const [docUrl, setDocUrl] = useState<string | null>(null);

	const handleViewDocument = async (key: string, userId: string) => {
		setIsLoadingDocuments(true);
		try {
			const response = await fetchDocumentUrlByKeyAPI(userId, key);
			if (response.success) {
				setDocUrl(response.document); // Set the signed URL
			}
		} finally {
			setIsLoadingDocuments(false);
		}
	};

	const handleClosePreview = () => {
		setDocUrl(null); // Clear the preview
	};

	const handleApprove = () => {
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
							{/* Mentor info */}
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

									{/* meta */}
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

									{/* skills */}
									<div className="mt-2 flex flex-wrap gap-2">
										{application.skills?.map((skill, i) => (
											<Badge key={getUniqueKey(skill, i)} variant="default">
												{renderItem(skill)}
											</Badge>
										))}
									</div>
								</div>
							</div>

							{/* Actions & Status */}
							<div className="flex flex-col gap-2">
								<StatusBadge status={application.mentorRequestStatus} />
								<div className="flex gap-2">
									{/* View profile */}
									<Button variant="outline" size="sm" onClick={() => onViewDetails(application)}>
										<Eye className="mr-2 h-4 w-4" />
										View Profile
									</Button>

									{/* Documents dialog */}
									<Dialog open={isDocumentsDialogOpen} onOpenChange={setIsDocumentsDialogOpen}>
										<DialogTrigger asChild>
											<Button variant="outline" size="sm">
												<Eye className="mr-2 h-4 w-4" />
												View Documents
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-lg md:max-w-4xl max-h-[90vh] overflow-y-auto">
											<DialogHeader className="pb-4">
												<DialogTitle>Application Documents</DialogTitle>
												<DialogDescription>
													Documents submitted by {application.firstName} {application.lastName}
												</DialogDescription>
											</DialogHeader>

											<div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-6 p-4">
												{/* Document List */}
												<div className="space-y-4 bg-muted/20 p-4 rounded-lg">
													<h3 className="text-sm font-medium text-foreground">Available Documents</h3>
													{isLoadingDocuments ? (
														<p className="text-sm text-muted-foreground">Loading documents...</p>
													) : application.documents.length > 0 ? (
														application.documents.map((key, i) => (
															<div key={getUniqueKey(key, i)} className="flex items-center justify-between p-2 bg-background rounded-md border border-muted">
																<p className="text-sm truncate">{extractDocumentName(key)}</p>
																<Button variant="outline" size="sm" onClick={() => handleViewDocument(key, application.userId)}>
																	<Eye className="mr-2 h-4 w-4" />
																	View
																</Button>
															</div>
														))
													) : (
														<p className="text-sm text-muted-foreground italic">No documents available</p>
													)}
												</div>

												{/* Document Preview */}
												<div className="relative bg-muted/10 p-4 rounded-lg">
													{docUrl ? (
														<div className="space-y-2">
															<Button variant="outline" size="sm" onClick={handleClosePreview} className="absolute top-2 right-2">
																<X className="h-4 w-4" />
																Close Preview
															</Button>
															<iframe src={docUrl} title="Document Viewer" width="100%" height="700px" style={{ border: "1px solid #ccc", borderRadius: "8px" }} />
														</div>
													) : (
														<div className="flex flex-col items-center justify-center h-full p-6 bg-background rounded-lg border border-muted text-center">
															<Eye className="h-8 w-8 text-muted-foreground mb-4" />
															<p className="text-sm text-muted-foreground font-medium">No document selected</p>
															<p className="text-xs text-muted-foreground mt-1">Click "View" on a document to preview it here.</p>
														</div>
													)}
												</div>
											</div>

											<DialogFooter className="pt-4">
												<Button variant="outline" onClick={() => setIsDocumentsDialogOpen(false)}>
													Close
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>

									{/* Approve / Reject (only if pending) */}
									{application.mentorRequestStatus === "pending" && (
										<>
											{/* Approve */}
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

											{/* Reject */}
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
															Please provide a reason for rejecting {application.firstName} {application.lastName}
															's application (optional).
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

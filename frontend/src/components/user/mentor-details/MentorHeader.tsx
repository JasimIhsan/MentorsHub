import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Flag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { IMentorDTO } from "@/interfaces/IMentorDTO";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createReportAPI } from "@/api/report.api.service";

interface MentorHeaderProps {
	userId: string;
	mentor: IMentorDTO;
}

export function MentorHeader({ userId, mentor }: MentorHeaderProps) {
	const [isAvatarOpen, setIsAvatarOpen] = useState(false);
	const [isReportOpen, setIsReportOpen] = useState(false);
	const [reportReason, setReportReason] = useState("");
	const [customReason, setCustomReason] = useState("");

	const reportReasons = [
		"Inappropriate behavior",
		"Unprofessional conduct",
		"False qualifications",
		"Harassment",
		"Discrimination",
		"Inappropriate content",
		"Spam or unsolicited messaging",
		"Non-responsive or unreliable",
		"Conflict of interest",
		"Other",
	];
	const handleReportSubmit = async () => {
		const finalReason = reportReason === "Other" ? customReason : reportReason;
		try {
			const response = await createReportAPI(userId, mentor.userId, finalReason);
			if (response.success) {
				toast.success(response.message || "Report submitted successfully.");
				setIsReportOpen(false);
				setReportReason("");
				setCustomReason("");
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
	};

	return (
		<div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
			<Dialog open={isAvatarOpen} onOpenChange={setIsAvatarOpen}>
				<DialogTrigger asChild>
					<button className="focus:outline-none">
						<Avatar className="h-32 w-32 border-4 border-primary/20 hover:opacity-80 transition-opacity cursor-pointer">
							<AvatarImage src={mentor.avatar ?? ""} alt={`${mentor.firstName || "Mentor"} ${mentor.lastName || ""}`} />
							<AvatarFallback>{mentor.firstName?.charAt(0) || "U"}</AvatarFallback>
						</Avatar>
					</button>
				</DialogTrigger>
				<DialogContent className="max-w-md">
					<img src={mentor.avatar ?? "https://via.placeholder.com/400"} alt={`${mentor.firstName || "Mentor"} ${mentor.lastName || ""}`} className="w-full h-auto rounded-lg" />
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
							<span className="text-xl">{mentor.averageRating?.toFixed(1) ?? "N/A"}</span>
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
			</div>
			<div className="flex flex-col gap-3 w-full md:w-40">
				<Button className="w-full" asChild disabled={!mentor.userId}>
					<Link to={`/request-session/${mentor.userId || ""}`}>Request Session</Link>
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="w-full">
							Actions
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-48">
						{/* <DropdownMenuItem onClick={() => console.log("Message clicked")}>
							<MessageSquare className="mr-2 h-4 w-4" />
							Message
						</DropdownMenuItem> */}
						<Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
							<DialogTrigger asChild>
								<DropdownMenuItem onClick={() => setIsReportOpen(true)} onSelect={(e) => e.preventDefault()} variant="destructive">
									<Flag className="mr-2 h-4 w-4 text-red-500" />
									Report
								</DropdownMenuItem>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Report Mentor</DialogTitle>
									<DialogDescription>Please select a reason for reporting this mentor.</DialogDescription>
								</DialogHeader>
								<RadioGroup value={reportReason} onValueChange={setReportReason} className="space-y-2">
									{reportReasons.map((reason) => (
										<div key={reason} className="flex items-center space-x-2">
											<RadioGroupItem value={reason} id={reason} />
											<Label htmlFor={reason}>{reason}</Label>
										</div>
									))}
								</RadioGroup>
								{reportReason === "Other" && (
									<div className="mt-4">
										<Label htmlFor="custom-reason">Please specify</Label>
										<Input id="custom-reason" value={customReason} onChange={(e) => setCustomReason(e.target.value)} placeholder="Enter your reason" className="mt-1" />
									</div>
								)}
								<DialogFooter>
									<Button variant="outline" onClick={() => setIsReportOpen(false)}>
										Cancel
									</Button>
									<Button disabled={!reportReason || (reportReason === "Other" && !customReason)} onClick={handleReportSubmit}>
										Submit Report
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}

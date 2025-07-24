import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IReportDTO } from "@/interfaces/report.interface";

interface ReportRowProps {
	report: IReportDTO;
	handleBlockUser: (reportId: string) => void;
	handleOpenDismissDialog: (reportId: string) => void;
	handleReadMore: (reason: string) => void;
}

export function ReportRow({ report, handleBlockUser, handleOpenDismissDialog, handleReadMore }: ReportRowProps) {
	const REASON_CHAR_LIMIT = 25;

	// Get badge variant based on status
	const getBadgeVariant = (status: string) => {
		switch (status) {
			case "pending":
				return "secondary";
			case "action_taken":
				return "default";
			case "dismissed":
				return "destructive";
			default:
				return "default";
		}
	};

	return (
		<TableRow className={report.status === "pending" ? "bg-yellow-50" : ""}>
			<TableCell>
				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8">
						<AvatarImage src={report.reporter.avatar} />
						<AvatarFallback>
							{report.reporter.firstName.charAt(0)}
							{report.reporter.lastName.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<a href="#" className="hover:underline">
						{report.reporter.firstName} {report.reporter.lastName}
					</a>
				</div>
			</TableCell>
			<TableCell>
				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8">
						<AvatarImage src={report.reported.avatar} />
						<AvatarFallback>
							{report.reported.firstName.charAt(0)}
							{report.reported.lastName.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<a href="#" className="hover:underline">
						{report.reported.firstName} {report.reported.lastName}
					</a>
				</div>
			</TableCell>
			<TableCell>
				{report.reason.length > REASON_CHAR_LIMIT ? (
					<div className="flex items-center gap-2">
						<span>{report.reason.slice(0, REASON_CHAR_LIMIT)}...</span>
						<Button variant="link" size="sm" onClick={() => handleReadMore(report.reason)}>
							Read More
						</Button>
					</div>
				) : (
					report.reason
				)}
			</TableCell>
			<TableCell>
				<Badge variant={getBadgeVariant(report.status)}>{report.status.replace("_", " ")}</Badge>
			</TableCell>
			<TableCell>{report.adminNote || "-"}</TableCell>
			<TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
			<TableCell>
				{report.status === "pending" && (
					<div className="flex gap-2">
						<Button variant="destructive" size="sm" onClick={() => handleBlockUser(report.id)}>
							Block
						</Button>
						<Button variant="outline" size="sm" onClick={() => handleOpenDismissDialog(report.id)}>
							Dismiss
						</Button>
					</div>
				)}
			</TableCell>
		</TableRow>
	);
}

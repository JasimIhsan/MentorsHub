// Table component for displaying reports
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReportRow } from "./ReportRow";
import { IReportDTO } from "@/interfaces/report.interface";

interface ReportTableProps {
	reports: IReportDTO[];
	handleBlockUser: (reportId: string) => void;
	handleOpenDismissDialog: (reportId: string) => void;
	handleReadMore: (reason: string) => void;
}

export function ReportTable({ reports, handleBlockUser, handleOpenDismissDialog, handleReadMore }: ReportTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Reporter</TableHead>
					<TableHead>Reported User</TableHead>
					<TableHead>Reason</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Admin Note</TableHead>
					<TableHead>Created At</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{reports.map((report) => (
					<ReportRow key={report.id} report={report} handleBlockUser={handleBlockUser} handleOpenDismissDialog={handleOpenDismissDialog} handleReadMore={handleReadMore} />
				))}
			</TableBody>
		</Table>
	);
}

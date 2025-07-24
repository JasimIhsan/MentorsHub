import { useState } from "react";

import { PaginationControls } from "@/components/custom/PaginationControls";
import { DismissDialog } from "@/components/admin/Report/ReportDismissDialog";
import { ReportFilters } from "@/components/admin/Report/ReportFilters";
import { ReportTable } from "@/components/admin/Report/ReportTable";
import { useReportsData } from "@/hooks/useReportData";
import { ReportReasonDialog } from "@/components/admin/Report/ReportReasonDialog";
import { Header } from "@/components/custom/header";

// Main component for reports management page
export function AdminReportsPage() {
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [isReasonDialogOpen, setIsReasonDialogOpen] = useState(false);
	const [selectedReason, setSelectedReason] = useState<string | null>(null);
	const [isDismissDialogOpen, setIsDismissDialogOpen] = useState(false);
	const [dismissReportId, setDismissReportId] = useState<string | null>(null);
	const [adminNote, setAdminNote] = useState("");
	const reportsPerPage = 10;

	// Use custom hook for data fetching
	const { reports, reportedUsers, totalPages, handleBlockUser, handleDismissReport } = useReportsData(selectedUserId, selectedStatus, page, reportsPerPage);

	// Handle opening the reason dialog
	const handleReadMore = (reason: string) => {
		setSelectedReason(reason);
		setIsReasonDialogOpen(true);
	};

	// Handle opening the dismiss dialog
	const handleOpenDismissDialog = (reportId: string) => {
		setDismissReportId(reportId);
		setIsDismissDialogOpen(true);
	};

	// Handle page change
	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setPage(newPage);
		}
	};

	return (
		<div className="max-w-7xl mx-auto">
			<div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
				<Header />
				<ReportFilters reportedUsers={reportedUsers} selectedUserId={selectedUserId} setSelectedUserId={setSelectedUserId} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} setPage={setPage} />
			</div>
			<ReportTable reports={reports} handleBlockUser={handleBlockUser} handleOpenDismissDialog={handleOpenDismissDialog} handleReadMore={handleReadMore} />
			<div className="my-4">
				<PaginationControls totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
			</div>
			<ReportReasonDialog isOpen={isReasonDialogOpen} setIsOpen={setIsReasonDialogOpen} reason={selectedReason} />
			<DismissDialog isOpen={isDismissDialogOpen} setIsOpen={setIsDismissDialogOpen} adminNote={adminNote} setAdminNote={setAdminNote} dismissReportId={dismissReportId} handleDismissReport={handleDismissReport} />
		</div>
	);
}

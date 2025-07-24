// Custom hook for fetching reports and managing state
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchReportsAdminAPI, updateReportStatusAPI } from "@/api/report.api.service";
import { IReportDTO } from "@/interfaces/report.interface";

export function useReportsData(selectedUserId: string | null, selectedStatus: string | null, page: number, reportsPerPage: number) {
	const [reports, setReports] = useState<IReportDTO[]>([]);
	const [reportedUsers, setReportedUsers] = useState<{ id: string; name: string }[]>([]);
	const [totalPages, setTotalPages] = useState(1);

	// Fetch reports on mount or when filters/page change
	useEffect(() => {
		const fetchReports = async () => {
			try {
				const response = await fetchReportsAdminAPI(selectedUserId || "", selectedStatus || "", page, reportsPerPage);
				if (response.success) {
					setReports(response.reports);
					setTotalPages(Math.ceil(response.total / reportsPerPage));
					const uniqueUsers = Array.from(
						new Map<string, { id: string; name: string }>(response.reports.map((report: IReportDTO) => [report.reported.id, { id: report.reported.id, name: `${report.reported.firstName} ${report.reported.lastName}` }])).values()
					);
					setReportedUsers(uniqueUsers);
				}
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			}
		};
		fetchReports();
	}, [selectedUserId, selectedStatus, page, reportsPerPage]);

	// Handle blocking a user
	const handleBlockUser = async (reportId: string) => {
		try {
			const response = await updateReportStatusAPI(reportId, "block");
			if (response.success && response.report) {
				toast.success("User blocked and reports updated!");
				const updated = response.report;
				const reportedUserId = updated.reported.id;
				setReports((prev) => prev.map((report) => (report.reported.id === reportedUserId ? { ...report, status: "action_taken" } : report)));
			} else {
				toast.error("Failed to block user.");
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
	};

	// Handle dismissing a report
	const handleDismissReport = async (reportId: string, adminNote: string) => {
		try {
			const response = await updateReportStatusAPI(reportId, "dismiss", adminNote);
			if (response.success) {
				toast.success("Report dismissed successfully!");
				const updated = response.report;
				setReports((prev) => prev.map((report) => (report.id === updated.id ? updated : report)));
			} else {
				toast.error("Failed to dismiss report.");
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
	};

	return { reports, reportedUsers, totalPages, handleBlockUser, handleDismissReport };
}

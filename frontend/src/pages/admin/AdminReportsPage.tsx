import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination";
import { toast } from "sonner";
import { fetchReportsAdminAPI } from "@/api/report.api.service";

// Interface for report data
interface IReportDTO {
	id: string;
	reporter: {
		id: string;
		firstName: string;
		lastName: string;
		avatar?: string;
	};
	reported: {
		id: string;
		firstName: string;
		lastName: string;
		avatar?: string;
	};
	reason: string;
	status: "pending" | "dismissed" | "action_taken";
	adminNote?: string;
	createdAt: Date;
}

export function AdminReportsPage() {
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
	const [isReasonDialogOpen, setIsReasonDialogOpen] = useState(false);
	const [selectedReason, setSelectedReason] = useState<string | null>(null);
	const [reports, setReports] = useState<IReportDTO[]>([]);
	const [reportedUsers, setReportedUsers] = useState<{ id: string; name: string }[]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const reportsPerPage = 5;

	// Character limit for reason truncation
	const REASON_CHAR_LIMIT = 25;

	useEffect(() => {
		const fetchReports = async () => {
			try {
				const response = await fetchReportsAdminAPI(
					selectedUserId || "", // Send selected user ID for backend filtering
					selectedStatus || "",
					page,
					reportsPerPage
				);
				if (response.success) {
					setReports(response.reports);
					setTotalPages(Math.ceil(response.total / reportsPerPage));

					// Extract unique reported users for dropdown
					const uniqueUsers: { id: string; name: string }[] = Array.from(
						new Map<string, { id: string; name: string }>(
							response.reports.map((report: IReportDTO) => [
								report.reported.id,
								{
									id: report.reported.id,
									name: `${report.reported.firstName} ${report.reported.lastName}`,
								},
							])
						).values()
					);
					setReportedUsers(uniqueUsers);
				}
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			}
		};
		fetchReports();
	}, [selectedUserId, selectedStatus, page, reportsPerPage]); // Added page and reportsPerPage to dependencies

	// Badge variant based on status
	const getBadgeVariant = (status: string) => {
		switch (status) {
			case "pending":
				return "secondary"; // Neutral/yellowish tone
			case "action_taken":
				return "default"; // Primary/greenish tone
			case "dismissed":
				return "destructive"; // Red tone
			default:
				return "default";
		}
	};

	// Handle opening the reason dialog
	const handleReadMore = (reason: string) => {
		setSelectedReason(reason);
		setIsReasonDialogOpen(true);
	};

	// Handle page change
	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setPage(newPage);
		}
	};

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Reports Management</h1>
				<div className="flex items-center gap-4">
					<Select
						value={selectedUserId || "all"}
						onValueChange={(value) => {
							setSelectedUserId(value === "all" ? null : value);
							setPage(1); // Reset to page 1 on filter change
						}}>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Filter by reported user" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Users</SelectItem>
							{reportedUsers.map((user) => (
								<SelectItem key={user.id} value={user.id}>
									{user.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={selectedStatus || "all"}
						onValueChange={(value) => {
							setSelectedStatus(value === "all" ? null : value);
							setPage(1); // Reset to page 1 on filter change
						}}>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Statuses</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="action_taken">Action Taken</SelectItem>
							<SelectItem value="dismissed">Dismissed</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

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
						<TableRow key={report.id} className={report.status === "pending" ? "bg-yellow-50" : ""}>
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
										<Button variant="destructive" size="sm" onClick={() => console.log(`Block user ${report.reported.id}`)}>
											Block
										</Button>
										<Button variant="outline" size="sm" onClick={() => console.log(`Dismiss report ${report.id}`)}>
											Dismiss
										</Button>
									</div>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Pagination Controls */}
			<div className="mt-4">
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious onClick={() => handlePageChange(page - 1)} className={page === 1 ? "pointer-events-none opacity-50" : ""} />
						</PaginationItem>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
							<PaginationItem key={pageNum}>
								<PaginationLink onClick={() => handlePageChange(pageNum)} isActive={page === pageNum}>
									{pageNum}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext onClick={() => handlePageChange(page + 1)} className={page === totalPages ? "pointer-events-none opacity-50" : ""} />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>

			<Dialog open={isReasonDialogOpen} onOpenChange={setIsReasonDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Full Report Reason</DialogTitle>
						<DialogDescription>{selectedReason || "No reason selected"}</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
}

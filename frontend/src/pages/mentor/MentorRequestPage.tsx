import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ISessionMentorDTO } from "@/interfaces/session.interface";
import { Filters } from "@/components/mentor/requests/Filters";
import { RequestList } from "@/components/mentor/requests/RequestList";
import { useSearchParams } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination";
import { fetchSessionsByMentor } from "@/api/session.api.service";

export function MentorRequestsPage() {
	const user = useSelector((state: RootState) => state.userAuth.user);
	const [searchParams, setSearchParams] = useSearchParams();
	const [requests, setRequests] = useState<ISessionMentorDTO[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
	const [filterOption, setFilterOption] = useState<"all" | "free" | "paid" | "today" | "week">("all");
	const [confirmationDialog, setConfirmationDialog] = useState<{
		isOpen: boolean;
		type: "approve" | "reject" | null;
		requestId: string | null;
		rejectReason: string;
	}>({ isOpen: false, type: null, requestId: null, rejectReason: "" });
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const limit = 6;

	// Initialize state from URL search parameters
	useEffect(() => {
		const status = searchParams.get("status") as "pending" | "approved" | "rejected" | null;
		const filter = searchParams.get("filter") as "all" | "free" | "paid" | "today" | "week" | null;
		const pageParam = searchParams.get("page");

		if (status) setActiveTab(status);
		if (filter) setFilterOption(filter);
		if (pageParam) setPage(parseInt(pageParam, 10));
	}, [searchParams]);

	// Update URL search parameters when activeTab, filterOption, page, or searchQuery changes
	useEffect(() => {
		const params = new URLSearchParams();
		params.set("status", activeTab);
		if (filterOption !== "all") params.set("filter", filterOption);
		if (page !== 1) params.set("page", page.toString());
		setSearchParams(params, { replace: true });
	}, [activeTab, filterOption, page, setSearchParams]);

	useEffect(() => {
		const fetchRequests = async () => {
			setIsLoading(true);
			try {
				const response = await fetchSessionsByMentor(user?.id as string, filterOption, activeTab, page, limit);
				setRequests(Array.isArray(response.requests) ? response.requests : []);
				setTotalPages(Math.ceil((response.total || 0) / limit));
			} catch (err) {
				console.error("Failed to fetch requests:", err);
				setRequests([]);
				setTotalPages(1);
			} finally {
				setIsLoading(false);
			}
		};
		if (user?.id) {
			fetchRequests();
		}
	}, [user?.id, filterOption, activeTab, page]);

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setPage(newPage);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Session Requests</h1>
					<p className="text-muted-foreground">Review and manage incoming session requests</p>
				</div>
			</div>

			<Tabs className="space-y-4" value={activeTab} onValueChange={(value) => setActiveTab(value as "pending" | "approved" | "rejected")}>
				<div className="flex flex-col sm:flex-row justify-between gap-4">
					<TabsList>
						<TabsTrigger value="pending">Pending</TabsTrigger>
						<TabsTrigger value="approved">Approved</TabsTrigger>
						<TabsTrigger value="rejected">Rejected</TabsTrigger>
					</TabsList>

					<Filters filterOption={filterOption} setFilterOption={setFilterOption} />
				</div>

				<TabsContent value="pending" className="space-y-4">
					<RequestList requests={requests} isLoading={isLoading} status={activeTab} confirmationDialog={confirmationDialog} setConfirmationDialog={setConfirmationDialog} setRequests={setRequests} />
				</TabsContent>

				<TabsContent value="approved" className="space-y-4">
					<RequestList requests={requests} isLoading={isLoading} status={activeTab} confirmationDialog={confirmationDialog} setConfirmationDialog={setConfirmationDialog} setRequests={setRequests} />
				</TabsContent>

				<TabsContent value="rejected" className="space-y-4">
					<RequestList requests={requests} isLoading={isLoading} status={activeTab} confirmationDialog={confirmationDialog} setConfirmationDialog={setConfirmationDialog} setRequests={setRequests} />
				</TabsContent>
			</Tabs>

			{requests.length > 0 && (
				<Pagination className="mt-6">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious onClick={() => handlePageChange(page - 1)} className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
						</PaginationItem>

						{Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
							<PaginationItem key={pageNumber}>
								<PaginationLink onClick={() => handlePageChange(pageNumber)} isActive={pageNumber === page} className={pageNumber === page ? "bg-primary text-white hover:bg-primary" : "cursor-pointer"}>
									{pageNumber}
								</PaginationLink>
							</PaginationItem>
						))}

						<PaginationItem>
							<PaginationNext onClick={() => handlePageChange(page + 1)} className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}

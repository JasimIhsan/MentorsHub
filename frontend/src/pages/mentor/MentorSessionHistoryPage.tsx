import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { RootState } from "@/store/store";
import { SessionDetailsModal } from "@/components/custom/SessionDetailsModal";
import { PaginationControls } from "@/components/custom/PaginationControls";
import { FilterDropdown } from "@/components/mentor/session-history/FilterDropdown";
import { SessionList } from "@/components/mentor/session-history/SessionList";
import { ISessionMentorDTO } from "@/interfaces/session.interface";
import { fetchSessionHistoryAPI } from "@/api/session.api.service";

export function MentorSessionHistoryPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [sessions, setSessions] = useState<ISessionMentorDTO[]>([]);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedSession, setSelectedSession] = useState<ISessionMentorDTO | null>(null);
	const user = useSelector((state: RootState) => state.userAuth.user);
	const filterOption = searchParams.get("status") || "completed";
	const currentPage = parseInt(searchParams.get("page") || "1", 10);
	const sessionsPerPage = 5;

	const fetchSessions = useCallback(async () => {
		if (!user?.id) {
			setError("User not authenticated. Please log in to view session history.");
			setLoading(false);
			return;
		}

		setLoading(true);
		try {
			const response = await fetchSessionHistoryAPI(user.id, filterOption, currentPage, sessionsPerPage);
			setSessions(response.sessions);
			setTotalPages(Math.ceil(response.total / sessionsPerPage));
		} catch (err: any) {
			const message = err.message || "Failed to load session history.";
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	}, [user?.id, filterOption, currentPage]);

	useEffect(() => {
		fetchSessions();
	}, [fetchSessions]);

	const handleFilterChange = (status: string) => {
		setSearchParams({ status, page: "1" });
	};

	const handlePageChange = (page: number) => {
		setSearchParams({ status: filterOption, page: page.toString() });
	};

	const handleSelectSession = useCallback((session: ISessionMentorDTO) => {
		setSelectedSession(session);
	}, []);

	if (error) {
		toast.error(error);
		return null;
	}

	return (
		<div className="w-full">
			<div className="flex flex-col gap-8">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Session History</h1>
						<p className="text-sm text-muted-foreground">View and manage your session history.</p>
					</div>
					<FilterDropdown filterOption={filterOption} onFilterChange={handleFilterChange} />
				</div>
				<Card className="p-0 border-none bg-transparent shadow-none">
					<CardContent className="p-0">
						<SessionList sessions={sessions} onSelectSession={handleSelectSession} isLoading={loading} />{" "}
						{totalPages > 0 && (
							<div className="mt-6">
								<PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} maxPagesToShow={5} />
							</div>
						)}
					</CardContent>
				</Card>
			</div>
			{selectedSession && <SessionDetailsModal session={selectedSession} onClose={() => setSelectedSession(null)} />}
		</div>
	);
}

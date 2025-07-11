import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { SessionDetailsModal } from "@/components/custom/SessionDetailsModal";
import { ISessionMentorDTO } from "@/interfaces/ISessionDTO";
import { fetchUpcomingSessionsByMentorAPI, updateSessionStatatusAPI } from "@/api/session.api.service";
import { SessionList } from "@/components/mentor/upcoming-sessions/SessionList";
import { SessionFilter } from "@/components/mentor/upcoming-sessions/SessionFilter";
import { PaginationControls } from "@/components/custom/PaginationControls";
import { SessionSkeleton } from "@/components/mentor/upcoming-sessions/LoadingSkeleton";

export function MentorUpcomingSessionsPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [sessions, setSessions] = useState<ISessionMentorDTO[]>([]);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filterOption, setFilterOption] = useState<"all" | "today" | "month">("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedSession, setSelectedSession] = useState<ISessionMentorDTO | null>(null);
	const sessionsPerPage = 6;
	const user = useSelector((state: RootState) => state.userAuth.user);
	const navigate = useNavigate();

	// Initialize state from URL query parameters
	useEffect(() => {
		const filter = searchParams.get("filter") as "all" | "today" | "month" | null;
		const page = parseInt(searchParams.get("page") || "1", 10);

		if (filter && ["all", "today", "month"].includes(filter)) {
			setFilterOption(filter);
		}
		if (page && !isNaN(page) && page >= 1) {
			setCurrentPage(page);
		}
	}, [searchParams]);

	// Update URL query parameters when filterOption or currentPage changes
	useEffect(() => {
		const params = new URLSearchParams();
		if (filterOption !== "all") {
			params.set("filter", filterOption);
		}
		if (currentPage !== 1) {
			params.set("page", currentPage.toString());
		}
		setSearchParams(params, { replace: true });
	}, [filterOption, currentPage, setSearchParams]);

	const fetchSessions = useCallback(async () => {
		if (!user?.id) {
			setError("User not authenticated. Please log in to view sessions.");
			setLoading(false);
			return;
		}

		setLoading(true);
		try {
			const response = await fetchUpcomingSessionsByMentorAPI(user.id, filterOption, currentPage, sessionsPerPage, "upcoming");

			if (!response.sessions) {
				throw new Error("No sessions data received");
			}

			setSessions(response.sessions);
			setTotalPages(Math.ceil(response.total / sessionsPerPage));
		} catch (err: any) {
			const message = err.response?.message || "Failed to load sessions.";
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	}, [user?.id, filterOption, currentPage, sessionsPerPage]);

	useEffect(() => {
		fetchSessions();
	}, [fetchSessions]);

	const handleUpdateSession = useCallback(async (sessionId: string) => {
		try {
			const response = await updateSessionStatatusAPI(sessionId, "completed");
			if (response.success) {
				setSessions((prev) => prev.filter((session) => session.id !== sessionId));
				toast.success("Session completed successfully!");
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
	}, []);

	const handleStartSession = useCallback(
		(sessionId: string) => {
			try {
				console.log(`sessionId : `, sessionId);
				navigate(`/video-call/${sessionId}`);
			} catch (err: any) {
				toast.error(err.response?.data?.message || "Failed to start session.");
			}
		},
		[navigate]
	);

	if (error) {
		toast.error(error);
		return null;
	}

	return (
		<div className="w-full">
			<div className="flex flex-col gap-8">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold tracking-tight">Upcoming Sessions</h1>
					<SessionFilter filterOption={filterOption} setFilterOption={setFilterOption} />
				</div>
				{loading ? <SessionSkeleton /> : <SessionList sessions={sessions} onStartSession={handleStartSession} setSelectedSession={setSelectedSession} handleUpdateSession={handleUpdateSession} />}
				{totalPages > 0 && <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
			</div>
			{selectedSession && <SessionDetailsModal session={selectedSession} onClose={() => setSelectedSession(null)} />}
		</div>
	);
}

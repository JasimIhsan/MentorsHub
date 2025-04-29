import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Video, Users, MessageSquare, IndianRupee } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import axiosInstance from "@/api/config/api.config";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Loading } from "@/components/custom-ui/Loading";
import { ISessionMentorDTO } from "@/interfaces/ISessionDTO";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export function MentorSessionHistoryPage() {
	const [sessions, setSessions] = useState<ISessionMentorDTO[]>([]);
	const [filteredSessions, setFilteredSessions] = useState<ISessionMentorDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filterOption, setFilterOption] = useState<"all" | "completed" | "canceled">("all");
	const [currentPage, setCurrentPage] = useState(1);
	const sessionsPerPage = 5;
	const user = useSelector((state: RootState) => state.auth.user);

	useEffect(() => {
		const fetchSessions = async () => {
			if (!user?.id) {
				setError("User not authenticated. Please log in to view session history.");
				setLoading(false);
				return;
			}

			try {
				const response = await axiosInstance.get(`/mentor/sessions/history/${user.id}`);
				if (!response.data?.sessions) {
					throw new Error("No session history data received");
				}
				setSessions(response.data.sessions);
				setFilteredSessions(response.data.sessions);
			} catch (err: any) {
				const message = err.response?.data?.message || "Failed to load session history.";
				setError(message);
				toast.error(message);
			} finally {
				setLoading(false);
			}
		};

		fetchSessions();
	}, [user?.id]);

	// Filter sessions based on filter option
	useEffect(() => {
		let filtered = sessions;
		if (filterOption === "completed") {
			filtered = sessions.filter((session) => session.status === "completed");
		} else if (filterOption === "canceled") {
			filtered = sessions.filter((session) => session.status === "canceled");
		}
		setFilteredSessions(filtered);
		setCurrentPage(1); // Reset to first page when filtering changes
	}, [filterOption, sessions]);

	// Pagination logic
	const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
	const indexOfLastSession = currentPage * sessionsPerPage;
	const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
	const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const renderPaginationItems = () => {
		const items = [];
		const maxPagesToShow = 5; // Show up to 5 page numbers at a time
		let startPage = Math.max(1, currentPage - 2);
		let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

		// Adjust startPage if endPage is at the maximum
		if (endPage - startPage < maxPagesToShow - 1) {
			startPage = Math.max(1, endPage - maxPagesToShow + 1);
		}

		// Always show first page
		if (startPage > 1) {
			items.push(
				<PaginationItem key={1}>
					<PaginationLink onClick={() => handlePageChange(1)}>{1}</PaginationLink>
				</PaginationItem>
			);
			if (startPage > 2) {
				items.push(
					<PaginationItem key="start-ellipsis">
						<PaginationEllipsis />
					</PaginationItem>
				);
			}
		}

		// Show page numbers in range
		for (let page = startPage; page <= endPage; page++) {
			items.push(
				<PaginationItem key={page}>
					<PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page}>
						{page}
					</PaginationLink>
				</PaginationItem>
			);
		}

		// Show last page and ellipsis if needed
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				items.push(
					<PaginationItem key="end-ellipsis">
						<PaginationEllipsis />
					</PaginationItem>
				);
			}
			items.push(
				<PaginationItem key={totalPages}>
					<PaginationLink onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
				</PaginationItem>
			);
		}

		return items;
	};

	if (loading) {
		return <Loading appName="Mentor Session History" loadingMessage="Loading your session history" />;
	}

	if (error) {
		toast.error(error);
		return null;
	}

	return (
		<div className="w-full">
			<div className="flex flex-col gap-8">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold tracking-tight">Session History</h1>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="flex items-center gap-2">
								<span>Filter: {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={() => setFilterOption("all")}>All</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilterOption("completed")}>Completed</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilterOption("canceled")}>Canceled</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<Card className="p-0 border-none bg-background shadow-none">
					<CardContent className="p-0">
						<div className="space-y-6">
							{currentSessions.map((session) => (
								<MentorSessionCardDetailed key={session.id} session={session} />
							))}
							{currentSessions.length === 0 && (
								<div className="text-center p-4">
									<p className="text-sm text-muted-foreground">No sessions found for the selected filter.</p>
								</div>
							)}
						</div>
						{/* Pagination Controls */}
						{totalPages > 0 && (
							<div className="mt-6">
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
										</PaginationItem>
										{renderPaginationItems()}
										<PaginationItem>
											<PaginationNext onClick={() => handlePageChange(currentPage + 1)} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} />
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

interface MentorSessionCardProps {
	session: ISessionMentorDTO;
}

function MentorSessionCardDetailed({ session }: MentorSessionCardProps) {
	const formatTime = (time: string) => {
		const [hour, minute] = time.split(":").map(Number);
		const ampm = hour >= 12 ? "PM" : "AM";
		const hour12 = hour % 12 || 12; // convert 0 to 12 for 12AM
		return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
	};

	return (
		<Card className="overflow-hidden p-0">
			<CardContent className="p-6">
				<div className="flex flex-col md:flex-row gap-6">
					{/* Left Section: Session Details */}
					<div className="flex-1">
						<div className="flex justify-between items-center">
							<div>
								<h3 className="font-bold text-xl text-primary">{session.topic}</h3>
							</div>
						</div>

						{/* Session Metadata */}
						<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex items-center gap-2">
								<CalendarDays className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">
									{new Date(session.date).toLocaleString("en-US", {
										dateStyle: "medium",
									})}
								</span>
							</div>

							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">
									{formatTime(session.time)} ({session.hours} hours)
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Video className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{session.sessionFormat}</span>
							</div>
							<div className="flex items-center gap-2">
								<IndianRupee className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{session.pricing === "free" ? "Free" : `${session.totalAmount?.toFixed(2) || 0}`}</span>
							</div>
							<div className="flex items-center gap-2">
								<MessageSquare className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{session.sessionType}</span>
							</div>
						</div>
					</div>

					<div className="flex justify-center items-center gap-2">
						<Badge variant={session.status === "completed" ? "outline" : "default"} className={`${session.status === "completed" ? "bg-primary/5 text-primary" : "bg-primary text-primary-foreground"} capitalize`}>
							{session.status}
						</Badge>
						{/* Participants Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="flex items-center gap-2">
									<Users className="h-4 w-4" />
									<span>Participants ({session.participants.length})</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-64">
								{session.participants.length === 0 ? (
									<DropdownMenuItem disabled className="text-muted-foreground">
										No participants
									</DropdownMenuItem>
								) : (
									session.participants.map((participant) => (
										<DropdownMenuItem key={participant._id} className="flex items-center gap-2">
											<Avatar className="h-8 w-8">
												<AvatarImage src={participant.avatar} alt={`${participant.firstName} ${participant.lastName}`} />
												<AvatarFallback>{participant.firstName.charAt(0)}</AvatarFallback>
											</Avatar>
											<div className="flex flex-col">
												<span className="font-medium">
													{participant.firstName} {participant.lastName}
												</span>
												<span className="text-sm text-muted-foreground">Payment: {participant.paymentStatus || "N/A"}</span>
											</div>
										</DropdownMenuItem>
									))
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

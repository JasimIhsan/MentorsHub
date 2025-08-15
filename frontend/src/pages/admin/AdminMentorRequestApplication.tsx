import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { IMentorDTO } from "@/interfaces/mentor.interface";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/custom/SearchBar";
import { ApplicationList } from "@/components/admin/mentor-application/ApplicationList";
import { MentorDetailsModal } from "@/components/admin/mentor-application/MentorDetailsModal";
import { useMentors } from "@/hooks/useMentors";
import { useDebounce } from "@/hooks/useDebounce";
import { updateMentorStatusAPI } from "@/api/mentors.api.service";

export function AdminMentorApplicationsPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
	const debouncedSearchTerm = useDebounce(searchQuery, 1000);
	const [currentTab, setCurrentTab] = useState<"pending" | "approved" | "rejected">((searchParams.get("status") as "pending" | "approved" | "rejected") || "pending");
	const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
	const [mentorsList, setMentorsList] = useState<IMentorDTO[]>([]);
	const [limit] = useState(10);
	const [selectedMentor, setSelectedMentor] = useState<IMentorDTO | null>(null);
	const { loadingMentors, mentors, total } = useMentors({ page, limit, search: debouncedSearchTerm, status: currentTab });

	useEffect(() => {
		setMentorsList(mentors);
	}, [currentTab, debouncedSearchTerm, page, mentors]);

	useEffect(() => {
		const params = new URLSearchParams();
		params.set("status", currentTab);
		if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
		if (page !== 1) params.set("page", page.toString());
		setSearchParams(params, { replace: true });
	}, [currentTab, debouncedSearchTerm, page, setSearchParams]);

	const updateMentorStatus = useCallback(
		async (userId: string, status: "approved" | "rejected", rejectionReason?: string) => {
			try {
				const response = await updateMentorStatusAPI(userId, status, rejectionReason);
				if (response.success) {
					setMentorsList((prev) => prev.filter((mentor) => mentor.userId !== userId));
					toast.success(`Mentor application ${status} successfully!`);
				} else {
					toast.error(`Failed to ${status} mentor application.`);
				}
			} catch (error) {
				setMentorsList(mentorsList); // This line seems unnecessary, consider removing unless there's a specific reason
				console.error(`Error updating mentor status to ${status}:`, error);
				toast.error(`Failed to ${status} mentor application.`);
			}
		},
		[mentorsList]
	);

	const handleViewDetails = (mentor: IMentorDTO) => {
		setSelectedMentor(mentor);
	};

	const handleCloseModal = () => {
		setSelectedMentor(null);
	};

	const totalPages = Math.ceil(total / limit);

	const handleTabChange = (value: string) => {
		setCurrentTab(value as "pending" | "approved" | "rejected");
		setPage(1);
	};

	return (
		<div className="container py-8">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-4">
					<h1 className="text-3xl font-bold tracking-tight">Mentor Applications</h1>
					<p className="text-muted-foreground">Review and manage mentor applications</p>
				</div>

				<div className="flex flex-col gap-6">
					<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} setPage={setPage} />
					<Card>
						<CardHeader className="pb-0">
							<Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
								<TabsList className="grid w-full grid-cols-3">
									<TabsTrigger value="pending">Pending</TabsTrigger>
									<TabsTrigger value="approved">Approved</TabsTrigger>
									<TabsTrigger value="rejected">Rejected</TabsTrigger>
								</TabsList>
								<TabsContent value={currentTab} className="mt-4">
									<ApplicationList applications={mentorsList} updateMentorStatus={updateMentorStatus} isLoading={loadingMentors} onViewDetails={handleViewDetails} />
									<div className="flex justify-between mt-4">
										<Button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} variant="outline">
											Previous
										</Button>
										<p>
											Page {page} of {totalPages}
										</p>
										<Button disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)} variant="outline">
											Next
										</Button>
									</div>
								</TabsContent>
							</Tabs>
						</CardHeader>
					</Card>
				</div>
			</div>
			{selectedMentor && <MentorDetailsModal mentor={selectedMentor} onClose={handleCloseModal} updateMentorStatus={updateMentorStatus} />}
		</div>
	);
}

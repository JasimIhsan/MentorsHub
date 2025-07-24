// Filter dropdowns for user and status
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReportFiltersProps {
	reportedUsers: { id: string; name: string }[];
	selectedUserId: string | null;
	setSelectedUserId: (value: string | null) => void;
	selectedStatus: string | null;
	setSelectedStatus: (value: string | null) => void;
	setPage: (page: number) => void;
}

export function ReportFilters({ reportedUsers, selectedUserId, setSelectedUserId, selectedStatus, setSelectedStatus, setPage }: ReportFiltersProps) {
	return (
		<div className="flex items-center gap-4">
			<Select
				value={selectedUserId || "all"}
				onValueChange={(value) => {
					setSelectedUserId(value === "all" ? null : value);
					setPage(1); // Reset to page 1
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
					setPage(1); // Reset to page 1
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
	);
}

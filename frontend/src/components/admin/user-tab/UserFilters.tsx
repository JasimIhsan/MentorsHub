import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserFilterProps {
	searchTerm: string;
	setSearchTerm: (value: string) => void;
	roleFilter: string;
	setRoleFilter: (value: string) => void;
	statusFilter: string;
	setStatusFilter: (value: string) => void;
}

export function UserFilter({ searchTerm, setSearchTerm, roleFilter, setRoleFilter, statusFilter, setStatusFilter }: UserFilterProps) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row">
			<div className="relative flex-1">
				<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
				<Input placeholder="Search users..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
			</div>
			<div className="flex gap-2">
				<Select value={roleFilter} onValueChange={setRoleFilter}>
					<SelectTrigger className="w-[150px]">
						<SelectValue placeholder="Filter by role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Roles</SelectItem>
						<SelectItem value="user">User</SelectItem>
						<SelectItem value="mentor">Mentor</SelectItem>
						<SelectItem value="admin">Admin</SelectItem>
					</SelectContent>
				</Select>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-[150px]">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Statuses</SelectItem>
						<SelectItem value="blocked">Blocked</SelectItem>
						<SelectItem value="unblocked">Unblocked</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}

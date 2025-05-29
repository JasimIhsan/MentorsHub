import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {  Filter } from "lucide-react";

interface FiltersProps {
	filterOption: "all" | "free" | "paid" | "today" | "week";
	setFilterOption: (value: "all" | "free" | "paid" | "today" | "week") => void;
}

export const Filters: React.FC<FiltersProps> = ({ filterOption, setFilterOption }) => {
	return (
		<div className="flex items-center gap-2">
			<Select value={filterOption} onValueChange={setFilterOption}>
				<SelectTrigger className="w-[180px]">
					<Filter className="h-4 w-4 mr-2" />
					<SelectValue placeholder="Filter by" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Requests</SelectItem>
					<SelectItem value="free">Free Sessions</SelectItem>
					<SelectItem value="paid">Paid Sessions</SelectItem>
					<SelectItem value="today">Today</SelectItem>
					<SelectItem value="week">This Week</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

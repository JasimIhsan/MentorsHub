import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface SessionFilterProps {
	filterOption: "all" | "today" | "month";
	setFilterOption: (option: "all" | "today" | "month") => void;
}

export function SessionFilter({ filterOption, setFilterOption }: SessionFilterProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="flex items-center gap-2">
					<span>Filter: {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => setFilterOption("all")}>All</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setFilterOption("today")}>Today</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setFilterOption("month")}>This Month</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

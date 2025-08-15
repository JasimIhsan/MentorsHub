import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface FilterDropdownProps {
	filterOption: string;
	onFilterChange: (status: string) => void;
}

export function FilterDropdown({ filterOption, onFilterChange }: FilterDropdownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="flex items-center gap-2">
					<span>Filter: {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => onFilterChange("completed")}>Completed</DropdownMenuItem>
				<DropdownMenuItem onClick={() => onFilterChange("canceled")}>Canceled</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

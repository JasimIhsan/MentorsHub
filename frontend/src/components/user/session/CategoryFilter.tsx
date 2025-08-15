import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface CategoryFilterProps {
	selectedCategory: "upcoming" | "approved" | "completed" | "canceled" | "all" | "pending" | "rejected";
	setSelectedCategory: (category: "upcoming" | "approved" | "completed" | "canceled" | "all" | "pending" | "rejected") => void;
}

export function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
	const categoryLabels: { [key in CategoryFilterProps["selectedCategory"]]: string } = {
		upcoming: "Upcoming Sessions",
		approved: "Approved Sessions",
		completed: "Completed Sessions",
		canceled: "Canceled Sessions",
		all: "All Sessions",
		pending: "Pending Sessions",
		rejected: "Rejected Sessions",
	};

	return (
		<div className="flex items-center justify-between">
			<h2 className="text-lg font-semibold">{categoryLabels[selectedCategory]}</h2>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="flex items-center gap-2" aria-label={`Filter by ${categoryLabels[selectedCategory]}`}>
						{categoryLabels[selectedCategory]}
						<ChevronDown className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onSelect={() => setSelectedCategory("all")}>All</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => setSelectedCategory("upcoming")}>Upcoming</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => setSelectedCategory("approved")}>Approved</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => setSelectedCategory("completed")}>Completed</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => setSelectedCategory("pending")}>Pending</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => setSelectedCategory("canceled")}>Canceled</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => setSelectedCategory("rejected")}>Rejected</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

import { Input } from "@/components/ui/input";
import {  Search } from "lucide-react";

interface SearchBarProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	setPage: (page: number) => void;
}

export function SearchBar({ searchQuery, setSearchQuery, setPage }: SearchBarProps) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row">
			<div className="relative flex-1">
				<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search by name, title, or skills..."
					className="pl-9"
					value={searchQuery}
					onChange={(e) => {
						setSearchQuery(e.target.value);
						setPage(1);
					}}
				/>
			</div>
		</div>
	);
}

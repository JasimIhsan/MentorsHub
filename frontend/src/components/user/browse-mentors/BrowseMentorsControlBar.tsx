import { Input } from "@/components/ui/input";
import { SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, Filter, X, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrowseMentorsControlBarProps {
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	sortBy: string;
	setSortBy: (value: string) => void;
	setCurrentPage: (value: number) => void;
	setDrawerOpen: (value: boolean) => void;
}

export const BrowseMentorsControlBar = ({ searchQuery, setSearchQuery, sortBy, setSortBy, setCurrentPage, setDrawerOpen }: BrowseMentorsControlBarProps) => (
	<div className="mb-8 flex flex-row items-center gap-2 w-full">
		{/* Search Input */}
		<div className="relative flex-1 w-full">
			<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
			<Input placeholder="Search mentors..." className="h-10 w-full rounded-lg pl-10 pr-10 text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
			{searchQuery && (
				<button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setSearchQuery("")}>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>

		{/* Sort Dropdown */}
		<Select
			value={sortBy}
			onValueChange={(value) => {
				setSortBy(value);
				setCurrentPage(1);
			}}>
			<SelectTrigger className="h-10 w-10 min-w-[4rem] md:w-auto rounded-lg text-sm flex items-center justify-center">
				{/* Sort Icon always visible */}
				<ArrowDownUp className="h-4 w-4" />

				{/* Show value + dropdown indicator only on desktop */}
				<span className="hidden md:flex items-center ml-2">
					<SelectValue />
				</span>
			</SelectTrigger>

			<SelectContent>
				<SelectItem value="recommended">Recommended</SelectItem>
				<SelectItem value="rating">Highest Rated</SelectItem>
				<SelectItem value="reviews">Most Reviews</SelectItem>
				<SelectItem value="newest">Newest Mentors</SelectItem>
				<SelectItem value="price-low">Price: Low to High</SelectItem>
				<SelectItem value="price-high">Price: High to Low</SelectItem>
			</SelectContent>
		</Select>

		{/* Filter Button */}
		<SheetTrigger asChild>
			<Button variant="outline" className="h-10 w-10 md:w-auto md:min-w-[7rem] rounded-lg text-sm flex items-center justify-center" onClick={() => setDrawerOpen(true)}>
				<Filter className="h-4 w-4 md:mr-2" />
				{/* Show text only on desktop */}
				<span className="hidden md:inline">Filters</span>
			</Button>
		</SheetTrigger>
	</div>
);

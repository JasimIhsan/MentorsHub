import { Input } from "@/components/ui/input";
import { SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
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
	<div className="mb-8 flex items-center gap-4">
		<div className="relative flex-1">
			<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
			<Input placeholder="Search mentors..." className="h-10 w-full rounded-lg pl-10 text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
		</div>
		<Select
			value={sortBy}
			onValueChange={(value) => {
				setSortBy(value);
				setCurrentPage(1);
			}}>
			<SelectTrigger size="lg" className="h-10 w-36 rounded-lg text-sm sm:w-40">
				<SelectValue placeholder="Sort by" />
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
		<SheetTrigger asChild>
			<Button variant="outline" size="lg" className="h-10 rounded-lg" onClick={() => setDrawerOpen(true)}>
				<Filter className="mr-2 h-4 w-4" />
				Filters
			</Button>
		</SheetTrigger>
	</div>
);

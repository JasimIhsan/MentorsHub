import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { fetchAllApprovedMentors } from "@/api/mentors.api.service";
import { IMentorDTO } from "@/interfaces/mentor.interface";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useDebounce } from "@/hooks/useDebounce";
import { BrowseMentorsControlBar } from "@/components/user/browse-mentors/BrowseMentorsControlBar";
import { BrowseMentorsFilterContent } from "@/components/user/browse-mentors/BrowseMentorsFilterContent";
import { BrowseMentorsMentorList } from "@/components/user/browse-mentors/BrowseMentorsList";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";

export default function BrowseMentorsPage() {
	// Manage URL query parameters
	const [searchParams, setSearchParams] = useSearchParams();

	// Initialize state from URL
	const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
	const debouncedSearchTerm = useDebounce(searchQuery, 500);
	const [tempPriceRange, setTempPriceRange] = useState([parseFloat(searchParams.get("priceMin") || "0"), parseFloat(searchParams.get("priceMax") || "200")]);
	const [priceRange, setPriceRange] = useState(tempPriceRange);
	const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "recommended");
	const [tempSelectedSkills, setTempSelectedSkills] = useState<string[]>(searchParams.get("Skills")?.split(",").filter(Boolean) || []);
	const [selectedSkills, setSelectedSkills] = useState<string[]>(tempSelectedSkills);
	const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
	const [mentors, setMentors] = useState<IMentorDTO[]>([]);
	const [total, setTotal] = useState(0);
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const user = useSelector((state: RootState) => state.userAuth.user);
	const mentorsPerPage = 9;
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	// Update URL when filters change
	useEffect(() => {
		const params = new URLSearchParams();
		if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
		if (sortBy) params.set("sortBy", sortBy);
		if (priceRange[0] !== 0) params.set("priceMin", priceRange[0].toString());
		if (priceRange[1] !== 200) params.set("priceMax", priceRange[1].toString());
		if (selectedSkills.length > 0) params.set("skills", selectedSkills.join(","));
		if (currentPage !== 1) params.set("page", currentPage.toString());
		setSearchParams(params, { replace: true });
	}, [debouncedSearchTerm, sortBy, priceRange, selectedSkills, currentPage, setSearchParams]);

	// Fetch mentors when filters or page change
	useEffect(() => {
		const fetchMentors = async () => {
			setIsFetching(true);
			try {
				const response = await fetchAllApprovedMentors(user?.id || "", currentPage, mentorsPerPage, debouncedSearchTerm, sortBy, priceRange[0], priceRange[1], selectedSkills);
				if (response.success) {
					const fetchedMentors: IMentorDTO[] = response.mentors.filter((mentor: IMentorDTO) => mentor.userId !== user?.id);
					const adjustedTotal = response.total - (response.mentors.length - fetchedMentors.length);
					setMentors(fetchedMentors);
					setTotal(adjustedTotal);
				}
			} catch (error) {
				console.error("Error fetching mentors:", error);
				if (error instanceof Error) toast.error(error.message);
			} finally {
				setIsFetching(false);
			}
		};
		fetchMentors();
	}, [currentPage, debouncedSearchTerm, sortBy, priceRange, selectedSkills, user?.id]);

	// Handle page change
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Apply filters
	const applyFilters = () => {
		setPriceRange(tempPriceRange);
		setSelectedSkills(tempSelectedSkills);
		setCurrentPage(1);
		setDrawerOpen(false);
	};

	// Calculate total pages
	const totalPages = Math.ceil(total / mentorsPerPage);

	return (
		<div className="min-h-screen bg-background w-full px-10 md:px-20 xl:px-25 justify-center">
			<div className="container mx-auto py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Find Your Mentor</h1>
					<p className="text-muted-foreground">Explore mentors who can guide you in your learning journey and help you grow.</p>
				</div>

				<Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
					<BrowseMentorsControlBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} sortBy={sortBy} setSortBy={setSortBy} setCurrentPage={setCurrentPage} setDrawerOpen={setDrawerOpen} />
					<SheetContent side="right" className="w-[300px] bg-white p-0 sm:w-[400px] [&>button.absolute]:hidden">
						<div className="flex items-center justify-between border-b p-6">
							<div className="space-y-1">
								<DialogTitle>Mentor Filters</DialogTitle>
								<DialogDescription>Filter mentors by price range and Skills.</DialogDescription>
							</div>
							{/* <h2 className="text-xl font-semibold text-gray-900">Filters</h2> */}
							<Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)}>
								Close
							</Button>
						</div>
						<BrowseMentorsFilterContent
							tempPriceRange={tempPriceRange}
							setTempPriceRange={setTempPriceRange}
							tempSelectedSkills={tempSelectedSkills}
							setTempSelectedSkills={setTempSelectedSkills}
							dropdownOpen={dropdownOpen}
							setDropdownOpen={setDropdownOpen}
							applyFilters={applyFilters}
						/>
					</SheetContent>
				</Sheet>

				<BrowseMentorsMentorList mentors={mentors} isFetching={isFetching} total={total} totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} mentorsPerPage={mentorsPerPage} />
			</div>
		</div>
	);
}

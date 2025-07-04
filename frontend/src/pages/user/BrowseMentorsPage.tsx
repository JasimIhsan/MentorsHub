import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Filter, Check, ChevronDown, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { fetchAllApprovedMentors } from "@/api/mentors.api.service";
import { IMentorDTO } from "@/interfaces/IMentorDTO";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Loading } from "@/components/custom/Loading";
import { INTEREST_OPTIONS } from "@/constants/interest.option";
import MentorBio from "@/components/user/browse-mentors/MentorsBio";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseMentorsPage() {
	// Manage URL query parameters
	const [searchParams, setSearchParams] = useSearchParams();

	// Initialize state from URL
	const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
	const debouncedSearchTerm = useDebounce(searchQuery, 500);
	const [tempPriceRange, setTempPriceRange] = useState([parseFloat(searchParams.get("priceMin") || "0"), parseFloat(searchParams.get("priceMax") || "200")]);
	const [priceRange, setPriceRange] = useState(tempPriceRange);
	const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "recommended");
	const [selectedInterests, setSelectedInterests] = useState<string[]>(searchParams.get("interests")?.split(",").filter(Boolean) || []);
	const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
	const [mentors, setMentors] = useState<IMentorDTO[]>([]);
	const [total, setTotal] = useState(0);
	const [isFetching, setIsFetching] = useState<boolean>(false); // Localized loading state
	const user = useSelector((state: RootState) => state.userAuth.user);
	const mentorsPerPage = 6;
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	// Update URL when filters change
	useEffect(() => {
		const params = new URLSearchParams();
		if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
		if (sortBy) params.set("sortBy", sortBy);
		if (priceRange[0] !== 0) params.set("priceMin", priceRange[0].toString());
		if (priceRange[1] !== 200) params.set("priceMax", priceRange[1].toString());
		if (selectedInterests.length > 0) params.set("interests", selectedInterests.join(","));
		if (currentPage !== 1) params.set("page", currentPage.toString());
		setSearchParams(params, { replace: true });
	}, [debouncedSearchTerm, sortBy, priceRange, selectedInterests, currentPage, setSearchParams]);

	// Fetch mentors when filters or page change
	useEffect(() => {
		const fetchMentors = async () => {
			setIsFetching(true);
			try {
				const response = await fetchAllApprovedMentors(currentPage, mentorsPerPage, debouncedSearchTerm, sortBy, priceRange[0], priceRange[1], selectedInterests);
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
	}, [currentPage, debouncedSearchTerm, sortBy, priceRange, selectedInterests, user?.id]);

	// Handle interest toggle
	const handleInterestToggle = (value: string) => {
		setSelectedInterests((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
		setCurrentPage(1);
	};

	// Remove interest
	const removeInterest = (value: string) => {
		setSelectedInterests((prev) => prev.filter((i) => i !== value));
		setCurrentPage(1);
	};

	// Handle page change
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Apply filters
	const applyFilters = () => {
		setPriceRange(tempPriceRange);
		setCurrentPage(1);
		setDrawerOpen(false);
	};

	// Calculate total pages
	const totalPages = Math.ceil(total / mentorsPerPage);

	// Filters content component
	const FiltersContent = () => (
		<div className="space-y-8 p-6 flex flex-col h-full justify-between">
			<div>
				<div>
					<h3 className="mb-4 text-lg font-semibold text-gray-900">Price Range</h3>
					<Slider defaultValue={[0, 200]} max={300} step={5} value={tempPriceRange} onValueChange={setTempPriceRange} className="w-full" />
					<div className="mt-3 flex justify-between text-sm text-gray-600">
						<span>₹{tempPriceRange[0]}</span>
						<span>₹{tempPriceRange[1]}</span>
					</div>
				</div>
				<div>
					<h3 className="mb-4 text-lg font-semibold text-gray-900">Interests</h3>
					<Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
						<PopoverTrigger asChild>
							<Button variant="outline" className="w-full justify-between rounded-lg border-indigo-200 bg-white text-sm">
								{selectedInterests.length > 0 ? `${selectedInterests.length} interest${selectedInterests.length > 1 ? "s" : ""} selected` : "Select interests"}
								<ChevronDown className="ml-2 h-4 w-4" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[300px] p-0" align="start">
							<Command>
								<CommandInput placeholder="Search interests..." className="h-10" />
								<CommandList className="max-h-[200px] overflow-y-auto">
									<CommandEmpty>No interests found.</CommandEmpty>
									<CommandGroup>
										{INTEREST_OPTIONS.map((interest) => (
											<CommandItem key={interest.value} value={interest.value} onSelect={() => handleInterestToggle(interest.value)} className="flex items-center gap-2 rounded-md hover:bg-indigo-50 cursor-pointer">
												<Check className={`h-4 w-4 text-primary ${selectedInterests.includes(interest.value) ? "opacity-100" : "opacity-0"}`} />
												{interest.label}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
					{selectedInterests.length > 0 && (
						<div className="mt-4 flex flex-wrap gap-2">
							{selectedInterests.map((interest) => (
								<Badge key={interest} variant="default" className="flex items-center gap-1 rounded-full px-3 py-1 text-xs">
									{INTEREST_OPTIONS.find((opt) => opt.value === interest)?.label || interest}
									<button onClick={() => removeInterest(interest)} className="ml-1 text-white hover:cursor-pointer">
										<X className="h-4 w-4" />
									</button>
								</Badge>
							))}
						</div>
					)}
				</div>
			</div>
			<Button onClick={applyFilters} className="w-full">
				Apply Filters
			</Button>
		</div>
	);

	return (
		<div className="min-h-screen bg-background w-full px-10 md:px-20 xl:px-25 justify-center">
			<div className="container mx-auto py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Find Your Mentor</h1>
					<p className="text-muted-foreground">Explore mentors who can guide you in your learning journey and help you grow.</p>
				</div>

				{/* Control Bar */}
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
					<Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
						<SheetTrigger asChild>
							<Button variant="outline" size="lg" className="h-10 rounded-lg border-indigo-200 bg-white hover:bg-indigo-50">
								<Filter className="mr-2 h-4 w-4" />
								Filters
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[300px] bg-white p-0 sm:w-[400px] [&>button.absolute]:hidden">
							<div className="flex items-center justify-between border-b p-6">
								<h2 className="text-xl font-semibold text-gray-900">Filters</h2>
								<Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)} className="text-indigo-600">
									Close
								</Button>
							</div>
							<FiltersContent />
						</SheetContent>
					</Sheet>
				</div>

				{/* Mentor Cards */}
				<div>
					<div className="mb-6 flex items-center justify-between">
						<h2 className="text-md font-semibold text-gray-900">
							{total} Mentor{total !== 1 ? "s" : ""} Found
						</h2>
					</div>
					{isFetching ? (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: mentorsPerPage }).map((_, index) => (
								<MentorCardSkeleton key={index} />
							))}
						</div>
					) : mentors.length === 0 ? (
						<div className="flex flex-col items-center justify-center rounded-lg bg-white p-16 text-center shadow-sm">
							<Search className="mb-6 h-16 w-16 text-indigo-300" />
							<h3 className="text-xl font-medium text-gray-900">No mentors found</h3>
							<p className="mt-3 text-base text-gray-500">Try adjusting your filters or search query.</p>
						</div>
					) : (
						<>
							<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{mentors.map((mentor) => (
									<Card key={mentor.id} className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
										<div className="relative overflow-visible">
											<CardContent className="flex flex-1 flex-col px-6">
												<div className="flex items-center gap-5">
													<Avatar className="h-16 w-16 border-2 border-indigo-100">
														<AvatarImage src={mentor.avatar || ""} alt={mentor.firstName} />
														<AvatarFallback className="bg-indigo-50 text-indigo-600 text-xl">{mentor.firstName.charAt(0)}</AvatarFallback>
													</Avatar>
													<div>
														<h3 className="text-lg font-semibold text-gray-900 inline-flex items-center">{mentor.firstName}</h3>
														<p className="text-sm text-gray-500">{mentor.professionalTitle}</p>
													</div>
												</div>
												<div className="mt-5 flex flex-wrap gap-2">
													{mentor.interests && mentor.interests.length > 0 ? (
														mentor.interests.slice(0, 3).map((interest) => (
															<Badge key={interest} variant="default" className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-primary">
																{INTEREST_OPTIONS.find((opt) => opt.value === interest)?.label || interest}
															</Badge>
														))
													) : (
														<Badge variant="default" className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-primary">
															No interests
														</Badge>
													)}
												</div>
												<MentorBio bio={mentor.bio!} />
												<div className="mt-5 flex items-center justify-between">
													<div className="flex items-center gap-2">
														<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
														<span className="text-base font-medium text-gray-900">{mentor.averageRating ?? "N/A"}</span>
														<span className="text-sm text-gray-500">({mentor.totalReviews ?? 0})</span>
													</div>
													<span className="text-base font-semibold text-primary">{mentor.hourlyRate === 0 ? "FREE" : `₹${mentor.hourlyRate}/-`}</span>
												</div>
												<Button variant="default" size="lg" className="mt-6" asChild>
													<Link to={`/browse/mentor-profile/${mentor.userId}`}>View Profile</Link>
												</Button>
											</CardContent>
										</div>
									</Card>
								))}
							</div>
							{/* Pagination Controls */}
							{totalPages > 1 && (
								<div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
									<Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
										Previous
									</Button>
									{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
										<Button
											key={page}
											variant={currentPage === page ? "default" : "outline"}
											size="sm"
											onClick={() => handlePageChange(page)}
											className={currentPage === page ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"}>
											{page}
										</Button>
									))}
									<Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
										Next
									</Button>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}

const MentorCardSkeleton = () => (
	<Card className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
		<CardContent className="flex flex-1 flex-col px-6 py-4">
			<div className="flex items-center gap-5">
				<Skeleton className="bg-gray-200 h-16 w-16 rounded-full" />
				<div className="space-y-2">
					<Skeleton className="bg-gray-200 h-5 w-32" />
					<Skeleton className="bg-gray-200 h-4 w-48" />
				</div>
			</div>
			<div className="mt-5 flex flex-wrap gap-2">
				<Skeleton className="bg-gray-200 h-6 w-20 rounded-full" />
				<Skeleton className="bg-gray-200 h-6 w-24 rounded-full" />
				<Skeleton className="bg-gray-200 h-6 w-16 rounded-full" />
			</div>
			<Skeleton className="bg-gray-200 mt-5 h-10 w-full" />
			<div className="mt-5 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Skeleton className="bg-gray-200 h-5 w-5 rounded-full" />
					<Skeleton className="bg-gray-200 h-4 w-12" />
					<Skeleton className="bg-gray-200 h-4 w-8" />
				</div>
				<Skeleton className="bg-gray-200 h-4 w-16" />
			</div>
			<Skeleton className="bg-gray-200 mt-6 h-10 w-full rounded-lg" />
		</CardContent>
	</Card>
);

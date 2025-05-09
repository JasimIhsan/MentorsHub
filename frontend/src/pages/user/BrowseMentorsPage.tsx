import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Filter, Check, ChevronDown, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { INTEREST_OPTIONS } from "@/data/interest.option";
import { fetchAllApprovedMentors } from "@/api/mentors.api.service";
import { IMentorDTO } from "@/interfaces/IMentorDTO";
import { toast } from "sonner";
import verified from "../../assets/verify.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Loading } from "@/components/custorm/Loading";

interface Mentor {
	id: string;
	name: string;
	title: string;
	avatar: string | null;
	rating: number | null;
	reviewCount: number | null;
	joinDate: string;
	interests: string[];
	rate: number;
	isVerified: boolean; // Added for verification status
}

export default function BrowseMentorsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [priceRange, setPriceRange] = useState([0, 200]);
	const [sortBy, setSortBy] = useState("recommended");
	const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [mentors, setMentors] = useState<Mentor[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const user = useSelector((state: RootState) => state.auth.user);
	const mentorsPerPage = 6;

	const handleInterestToggle = (value: string) => {
		setSelectedInterests((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
	};

	const removeInterest = (value: string) => {
		setSelectedInterests((prev) => prev.filter((i) => i !== value));
	};

	const filteredMentors = mentors.filter((mentor: Mentor) => {
		const matchesSearch =
			mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			mentor.interests.some((interest) =>
				INTEREST_OPTIONS.find((opt) => opt.value === interest)
					?.label.toLowerCase()
					.includes(searchQuery.toLowerCase())
			);

		const mentorRate = mentor.rate ? mentor.rate : 0;
		const matchesPrice = mentorRate >= priceRange[0] && mentorRate <= priceRange[1];

		const matchesInterest = selectedInterests.length === 0 || mentor.interests.some((interest) => selectedInterests.includes(interest));

		console.log(`Mentor: ${mentor.name}, Rate: ${mentor.rate}, MentorRate: ${mentorRate}, MatchesPrice: ${matchesPrice}, IsVerified: ${mentor.isVerified}`);

		return matchesSearch && matchesPrice && matchesInterest;
	});

	const sortedMentors = [...filteredMentors].sort((a: Mentor, b: Mentor) => {
		if (sortBy === "price-low") {
			const aRate = a.rate ?? 0;
			const bRate = b.rate ?? 0;
			console.log(`Sorting price-low: ${a.name} (${aRate}) vs ${b.name} (${bRate})`);
			return aRate - bRate;
		} else if (sortBy === "price-high") {
			const aRate = a.rate ?? 0;
			const bRate = b.rate ?? 0;
			console.log(`Sorting price-high: ${a.name} (${aRate}) vs ${b.name} (${bRate})`);
			return bRate - aRate;
		} else if (sortBy === "rating") {
			return (b.rating ?? 0) - (a.rating ?? 0);
		} else if (sortBy === "reviews") {
			return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
		} else if (sortBy === "newest") {
			return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
		}
		return 0; // recommended (default)
	});

	// Pagination logic
	const totalPages = Math.ceil(sortedMentors.length / mentorsPerPage);
	const startIndex = (currentPage - 1) * mentorsPerPage;
	const endIndex = startIndex + mentorsPerPage;
	const currentMentors = sortedMentors.slice(startIndex, endIndex);

	// Debugging logs
	console.log("filteredMentors length:", filteredMentors.length);
	console.log("sortedMentors length:", sortedMentors.length);
	console.log("currentMentors length:", currentMentors.length);
	console.log("currentMentors:", currentMentors);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const FiltersContent = () => (
		<div className="space-y-8 p-6">
			<div>
				<h3 className="mb-4 text-lg font-semibold text-gray-900">Price Range</h3>
				<Slider defaultValue={[0, 200]} max={300} step={5} value={priceRange} onValueChange={setPriceRange} className="w-full" />
				<div className="mt-3 flex justify-between text-sm text-gray-600">
					<span>₹{priceRange[0]}</span>
					<span>₹{priceRange[1]}</span>
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
	);

	useEffect(() => {
		const fetchMentors = async () => {
			setLoading(true);
			try {
				const response = await fetchAllApprovedMentors();
				if (response.success) {
					const fetchedMentors: IMentorDTO[] = response.mentors.filter((mentor: IMentorDTO) => mentor.userId !== user?.id);
					const mappedMentors: Mentor[] = fetchedMentors.map((mentor: IMentorDTO) => ({
						id: mentor.userId,
						name: `${mentor.firstName} ${mentor.lastName}`,
						title: mentor.professionalTitle,
						avatar: mentor.avatar,
						rating: mentor.rating ?? null,
						reviewCount: mentor.sessionCompleted ?? null,
						joinDate: new Date(mentor.createdAt).toISOString(),
						interests: Array.isArray(mentor.interests)
							? mentor.interests.map(String) // Ensure all interests are strings
							: [],
						rate: Number(mentor.hourlyRate) || 0, // Convert to number
						isVerified: mentor.isVerified ?? false,
					}));
					setMentors(mappedMentors);
				}
			} catch (error) {
				console.error("Error fetching mentors:", error);
				if (error instanceof Error) toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};
		fetchMentors();
	}, [user?.id]);

	if (loading) {
		return <Loading appName="Browse Mentors" loadingMessage="Loading mentors..." />;
	}

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
					<Select value={sortBy} onValueChange={setSortBy}>
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
							{sortedMentors.length} Mentor{sortedMentors.length !== 1 ? "s" : ""} Found
						</h2>
					</div>
					{sortedMentors.length === 0 ? (
						<div className="flex flex-col items-center justify-center rounded-lg bg-white p-16 text-center shadow-sm">
							<Search className="mb-6 h-16 w-16 text-indigo-300" />
							<h3 className="text-xl font-medium text-gray-900">No mentors found</h3>
							<p className="mt-3 text-base text-gray-500">Try adjusting your filters or search query.</p>
						</div>
					) : (
						<>
							<div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
								{currentMentors.map((mentor: Mentor) => (
									<Card key={mentor.id} className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
										<CardContent className="flex flex-1 flex-col px-6">
											<div className="flex items-center gap-5">
												<Avatar className="h-16 w-16 border-2 border-indigo-100">
													<AvatarImage src={mentor.avatar || ""} alt={mentor.name} />
													<AvatarFallback className="bg-indigo-50 text-indigo-600 text-xl">{mentor.name.charAt(0)}</AvatarFallback>
												</Avatar>
												<div>
													<h3 className="text-lg font-semibold text-gray-900 inline-flex items-center">
														{mentor.name}
														{mentor.isVerified && <img src={verified} alt="" className="w-4 h-4 ml-2" />}
													</h3>
													<p className="text-sm text-gray-500">{mentor.title}</p>
												</div>
											</div>
											<div className="mt-5 flex flex-wrap gap-2">
												{mentor.interests.length > 0 ? (
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
											<div className="mt-5 flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
													<span className="text-base font-medium text-gray-900">{mentor.rating ?? "N/A"}</span>
													<span className="text-sm text-gray-500">({mentor.reviewCount ?? 0})</span>
												</div>
												<span className="text-base font-semibold text-primary">{mentor.rate === 0 ? "FREE" : `₹${mentor.rate}/-`}</span>
											</div>
											<Button variant="default" size="lg" className="mt-6" asChild>
												<Link to={`/browse/mentor-profile/${mentor.id}`}>View Profile</Link>
											</Button>
										</CardContent>
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

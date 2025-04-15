import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function BrowseMentorsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [priceRange, setPriceRange] = useState([0, 100]);
	const [sortBy, setSortBy] = useState("recommended");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

	const handleCategoryChange = (category: string) => {
		setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
	};

	const filteredMentors = mentors.filter((mentor) => {
		const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) || mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) || mentor.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

		const matchesPrice = Number.parseInt(mentor.rate.replace(/\D/g, "")) >= priceRange[0] && Number.parseInt(mentor.rate.replace(/\D/g, "")) <= priceRange[1];

		const matchesCategory = selectedCategories.length === 0 || mentor.skills.some((skill) => selectedCategories.includes(skill));

		return matchesSearch && matchesPrice && matchesCategory;
	});

	const sortedMentors = [...filteredMentors].sort((a, b) => {
		if (sortBy === "price-low") {
			return Number.parseInt(a.rate.replace(/\D/g, "")) - Number.parseInt(b.rate.replace(/\D/g, ""));
		} else if (sortBy === "price-high") {
			return Number.parseInt(b.rate.replace(/\D/g, "")) - Number.parseInt(a.rate.replace(/\D/g, ""));
		} else if (sortBy === "rating") {
			return b.rating - a.rating;
		}
		return 0; // recommended (default)
	});

	const FiltersContent = () => (
		<div className="space-y-6">
			<div>
				<h3 className="mb-4 text-lg font-medium">Price Range</h3>
				<div className="space-y-4">
					<Slider defaultValue={[0, 100]} max={200} step={5} value={priceRange} onValueChange={setPriceRange} />
					<div className="flex items-center justify-between">
						<span>${priceRange[0]}</span>
						<span>${priceRange[1]}</span>
					</div>
				</div>
			</div>
			<div>
				<h3 className="mb-4 text-lg font-medium">Categories</h3>
				<Accordion type="multiple" className="w-full">
					{categories.map((category) => (
						<AccordionItem key={category.name} value={category.name}>
							<AccordionTrigger>{category.name}</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-2">
									{category.skills.map((skill) => (
										<div key={skill} className="flex items-center space-x-2">
											<Checkbox id={skill} checked={selectedCategories.includes(skill)} onCheckedChange={() => handleCategoryChange(skill)} />
											<label htmlFor={skill} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
												{skill}
											</label>
										</div>
									))}
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	);

	return (
		<div className="container py-8 px-10 md:px-20 xl:px-25">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-4">
					<h1 className="text-3xl font-bold tracking-tight">Browse Mentors</h1>
					<p className="text-muted-foreground">Find the perfect mentor to help you achieve your goals.</p>
				</div>

				<div className="flex flex-col gap-6">
					{/* Search and Filters */}
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input placeholder="Search mentors, skills, or topics..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
						</div>
						<div className="flex gap-4">
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="recommended">Recommended</SelectItem>
									<SelectItem value="rating">Highest Rated</SelectItem>
									<SelectItem value="price-low">Price: Low to High</SelectItem>
									<SelectItem value="price-high">Price: High to Low</SelectItem>
								</SelectContent>
							</Select>
							<Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
								<SheetTrigger asChild>
									<Button variant="outline" className="md:hidden">
										<Filter className="mr-2 h-4 w-4" />
										Filters
									</Button>
								</SheetTrigger>
								<SheetContent side="left">
									<h2 className="mb-6 text-xl font-semibold">Filters</h2>
									<FiltersContent />
								</SheetContent>
							</Sheet>
						</div>
					</div>

					{/* Main Content */}
					<div className="grid grid-cols-1 gap-6 md:grid-cols-[250px_1fr]">
						{/* Filters - Desktop */}
						<div className="hidden md:block">
							<div className="sticky top-24 space-y-6">
								<h2 className="text-xl font-semibold">Filters</h2>
								<FiltersContent />
							</div>
						</div>

						{/* Mentor Cards */}
						<div className="space-y-6">
							<p className="text-sm text-muted-foreground">Showing {sortedMentors.length} mentors</p>
							<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{sortedMentors.map((mentor) => (
									<Card key={mentor.id} className="overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full border border-gray-200">
										<CardContent className="p-5 pb-0 flex flex-col gap-4 flex-1">
											<div className="flex items-center gap-4">
												<Avatar className="h-14 w-14 border-2 border-gray-300 rounded-full">
													<AvatarImage src={mentor.avatar} alt={mentor.name} />
													<AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">{mentor.name.charAt(0)}</AvatarFallback>
												</Avatar>
												<div className="flex-1">
													<h3 className="font-semibold text-lg text-gray-900">{mentor.name}</h3>
													<p className="text-sm text-gray-500">{mentor.title}</p>
												</div>
											</div>

											<div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-md border border-gray-100">
												<div className="flex items-center gap-2">
													<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
													<span className="text-sm font-medium text-gray-700">{mentor.rating}</span>
												</div>
												<div className="text-right">
													<span className="text-sm font-medium text-gray-900">{mentor.rate}</span>
												</div>
											</div>

											<div className="flex flex-wrap gap-2 justify-start">
												{mentor.skills.slice(0, 4).map((skill) => (
													<Badge key={skill} variant="outline" className="text-xs border-gray-300 bg-white text-gray-700 px-2.5 py-0.5 rounded-md">
														{skill}
													</Badge>
												))}
											</div>

											{/* Spacer to push the button to the bottom */}
											<div className="flex-1" />

											<Button variant="default" size="sm" className="w-full  rounded-md transition-colors duration-200" asChild>
												<Link to={`/mentors/${mentor.id}`}>Explore Profile</Link>
											</Button>
										</CardContent>
									</Card>
								))}
								{sortedMentors.length === 0 && (
									<div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
										<Search className="mb-2 h-10 w-10 text-muted-foreground" />
										<h3 className="text-lg font-medium">No mentors found</h3>
										<p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const mentors = [
	{
		id: 1,
		name: "Sarah Johnson",
		title: "Senior JavaScript Developer",
		avatar: "https://res.cloudinary.com/dbtgtj2ii/image/upload/v1744288812/Profile%20Pictures/wn7h1uesa3rghynmh7zp.jpg",
		rating: 4.9,
		skills: ["JavaScript", "React", "Node.js"],
		rate: "$60/hour",
	},
	{
		id: 2,
		name: "Michael Chen",
		title: "Career Coach & Product Manager",
		avatar: "https://res.cloudinary.com/dbtgtj2ii/image/upload/v1744288812/Profile%20Pictures/wn7h1uesa3rghynmh7zp.jpg",
		rating: 4.8,
		skills: ["Career Development", "Product Management", "Leadership"],
		rate: "$75/hour",
	},
	{
		id: 3,
		name: "Emily Rodriguez",
		title: "UX/UI Designer",
		avatar: "https://res.cloudinary.com/dbtgtj2ii/image/upload/v1744288812/Profile%20Pictures/wn7h1uesa3rghynmh7zp.jpg",
		rating: 4.7,
		skills: ["UI Design", "User Research", "Figma"],
		rate: "$65/hour",
	},
	{
		id: 4,
		name: "David Kim",
		title: "Data Scientist",
		avatar: "https://res.cloudinary.com/dbtgtj2ii/image/upload/v1744288812/Profile%20Pictures/wn7h1uesa3rghynmh7zp.jpg",
		rating: 4.9,
		skills: ["Python", "Machine Learning", "Data Analysis"],
		rate: "$80/hour",
	},
	{
		id: 5,
		name: "Lisa Wang",
		title: "Marketing Strategist",
		avatar: "https://res.cloudinary.com/dbtgtj2ii/image/upload/v1744288812/Profile%20Pictures/wn7h1uesa3rghynmh7zp.jpg",
		rating: 4.6,
		skills: ["Digital Marketing", "SEO", "Content Strategy"],
		rate: "$70/hour",
	},
	{
		id: 6,
		name: "James Wilson",
		title: "Full Stack Developer",
		avatar: "https://res.cloudinary.com/dbtgtj2ii/image/upload/v1744288812/Profile%20Pictures/wn7h1uesa3rghynmh7zp.jpg",
		rating: 4.8,
		skills: ["JavaScript", "Python", "AWS"],
		rate: "$85/hour",
	},
];

const categories = [
	{
		name: "Programming",
		skills: ["JavaScript", "Python", "React", "Node.js", "AWS"],
	},
	{
		name: "Design",
		skills: ["UI Design", "User Research", "Figma", "Graphic Design"],
	},
	{
		name: "Business",
		skills: ["Career Development", "Product Management", "Leadership", "Digital Marketing", "SEO", "Content Strategy"],
	},
	{
		name: "Data Science",
		skills: ["Machine Learning", "Data Analysis", "Python", "Statistics"],
	},
];

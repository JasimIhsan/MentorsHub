import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Check, X } from "lucide-react";
import { SKILL_OPTIONS } from "@/constants/skill.option";

interface BrowseMentorsFilterContentProps {
	tempPriceRange: number[];
	setTempPriceRange: (value: number[]) => void;
	tempSelectedSkills: string[];
	setTempSelectedSkills: (value: string[] | ((prev: string[]) => string[])) => void;
	dropdownOpen: boolean;
	setDropdownOpen: (value: boolean) => void;
	applyFilters: () => void;
}

export const BrowseMentorsFilterContent = ({ tempPriceRange, setTempPriceRange, tempSelectedSkills, setTempSelectedSkills, dropdownOpen, setDropdownOpen, applyFilters }: BrowseMentorsFilterContentProps) => {
	// Toggle interest selection
	const handleInterestToggle = (value: string) => {
		setTempSelectedSkills((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
	};

	// Remove selected interest
	const removeInterest = (value: string) => {
		setTempSelectedSkills((prev) => prev.filter((i) => i !== value));
	};

	return (
		<div className="flex flex-col h-full p-6">
			{/* Price Range Section */}
			<div className="mb-8">
				<h3 className="text-base font-semibold text-gray-900 mb-3">Price Range</h3>
				<Slider defaultValue={[0, 200]} max={300} step={5} value={tempPriceRange} onValueChange={setTempPriceRange} className="w-full" />
				<div className="mt-4 flex justify-between items-center text-sm text-gray-600">
					<span className="font-medium bg-gray-100 px-3 py-1 rounded-full">₹{tempPriceRange[0]}</span>
					<span className="font-medium bg-gray-100 px-3 py-1 rounded-full">₹{tempPriceRange[1]}</span>
				</div>
			</div>

			{/* Skills Section */}
			<div className="mb-8">
				<h3 className="text-base font-semibold text-gray-900 mb-3">Expertise Skills</h3>
				<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="w-full justify-between rounded-lg border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
							{tempSelectedSkills.length > 0 ? `${tempSelectedSkills.length} interest${tempSelectedSkills.length > 1 ? "s" : ""} selected` : "Select Skills"}
							<ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-full p-0 bg-white rounded-lg shadow-lg border border-gray-100">
						<DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-gray-900">Skills</DropdownMenuLabel>
						<DropdownMenuSeparator className="bg-gray-100" />
						<DropdownMenuGroup className="max-h-[200px] overflow-y-auto" >
							{SKILL_OPTIONS.map((interest) => (
								<DropdownMenuItem key={interest.value} onSelect={() => handleInterestToggle(interest.label)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover: cursor-pointer transition-colors">
									<Check className={`h-4 w-4 ${tempSelectedSkills.includes(interest.label) ? "opacity-100" : "opacity-0"}`} />
									{interest.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Selected Skills */}
				{tempSelectedSkills.length > 0 && (
					<div className="mt-4 flex flex-wrap gap-2">
						{tempSelectedSkills.map((interest) => (
							<Badge key={interest} variant="default" className="flex items-center gap-1 rounded-full px-3 py-1 text-xs bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors">
								{SKILL_OPTIONS.find((opt) => opt.value === interest)?.label || interest}
								<button onClick={() => removeInterest(interest)} className="ml-1 text-indigo-800 hover:text-indigo-900 hover:cursor-pointer transition-colors">
									<X className="h-3 w-3" />
								</button>
							</Badge>
						))}
					</div>
				)}
			</div>

			{/* Apply Button */}
			<div className="mt-auto">
				<Button onClick={applyFilters} className="w-full text-white font-semibold py-2 rounded-lg transition-colors">
					Apply Filters
				</Button>
			</div>
		</div>
	);
};

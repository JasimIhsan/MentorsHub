import { Button } from "@/components/ui/button";
import { INTEREST_OPTIONS } from "@/constants/interest.option";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Slider } from "@radix-ui/react-slider";
import { CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "cmdk";
import { ChevronDown, Command, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BrowseMentorsFilterContentProps {
	tempPriceRange: number[];
	setTempPriceRange: (value: number[]) => void;
	tempSelectedInterests: string[];
	setTempSelectedInterests: (value: string[] | ((prev: string[]) => string[])) => void;
	dropdownOpen: boolean;
	setDropdownOpen: (value: boolean) => void;
	applyFilters: () => void;
}

export const BrowseMentorsFilterContent = ({ tempPriceRange, setTempPriceRange, tempSelectedInterests, setTempSelectedInterests, dropdownOpen, setDropdownOpen, applyFilters }: BrowseMentorsFilterContentProps) => {
	const handleInterestToggle = (value: string) => {
		setTempSelectedInterests((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
	};

	const removeInterest = (value: string) => {
		setTempSelectedInterests((prev) => prev.filter((i) => i !== value));
	};

	return (
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
								{tempSelectedInterests.length > 0 ? `${tempSelectedInterests.length} interest${tempSelectedInterests.length > 1 ? "s" : ""} selected` : "Select interests"}
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
												<Check className={`h-4 w-4 text-primary ${tempSelectedInterests.includes(interest.value) ? "opacity-100" : "opacity-0"}`} />
												{interest.label}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
					{tempSelectedInterests.length > 0 && (
						<div className="mt-4 flex flex-wrap gap-2">
							{tempSelectedInterests.map((interest) => (
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
			<Button onClick={applyFilters} className="w-full bg-indigo-600 hover:bg-indigo-700">
				Apply Filters
			</Button>
		</div>
	);
};

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// Interface for component props
interface TransactionFiltersProps {
	dateRange: { from: Date | undefined; to: Date | undefined };
	transactionType: string;
	setTransactionType: (type: string) => void;
	handleDateChange: (field: "from" | "to", value: string) => void;
	handleApplyFilters: () => void;
	handleClearFilters: () => void;
}

export function TransactionFilters({ dateRange, transactionType, setTransactionType, handleDateChange, handleApplyFilters, handleClearFilters }: TransactionFiltersProps) {
	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
			<div className="flex flex-col gap-4 md:flex-row md:gap-6">
				<div className="space-y-2 w-full md:w-auto">
					<Label htmlFor="from-date">From Date</Label>
					<Input id="from-date" type="date" value={dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : ""} onChange={(e) => handleDateChange("from", e.target.value)} placeholder="YYYY-MM-DD" className="w-full" />
				</div>
				<div className="space-y-2 w-full md:w-auto">
					<Label htmlFor="to-date">To Date</Label>
					<Input id="to-date" type="date" value={dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : ""} onChange={(e) => handleDateChange("to", e.target.value)} placeholder="YYYY-MM-DD" className="w-full" />
				</div>
				<div className="space-y-2 w-full md:w-48">
					<Label htmlFor="transaction-type">Transaction Type</Label>
					<Select value={transactionType} onValueChange={setTransactionType}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Transactions</SelectItem>
							<SelectItem value="credit">Credit Only</SelectItem>
							<SelectItem value="debit">Debit Only</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="flex flex-col gap-2 ">
				<Button onClick={handleApplyFilters} className="w-full md:w-auto">
					Apply Filters
				</Button>
				<Button onClick={handleClearFilters} variant="outline" className="w-full md:w-auto">
					Clear Filters
				</Button>
			</div>
		</div>
	);
}

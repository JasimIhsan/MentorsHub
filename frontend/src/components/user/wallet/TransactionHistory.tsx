import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { IWalletTransaction } from "@/pages/user/WalletPage";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { formatDate } from "date-fns";
import { Filter, CalendarIcon } from "lucide-react";
import { TransactionList } from "./TransactionList";

interface TransactionHistoryProps {
	transactions: IWalletTransaction[];
	isLoading: boolean;
	transactionType: string;
	setTransactionType: (value: string) => void;
	dateRange: { from: Date | undefined; to: Date | undefined };
	setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	totalPages: number;
}

// Component for displaying transaction history with filters
export function TransactionHistory({ transactions, isLoading, transactionType, setTransactionType, dateRange, setDateRange, currentPage, setCurrentPage, totalPages }: TransactionHistoryProps) {
	const handleClearFilters = () => {
		setDateRange({ from: undefined, to: undefined });
		setTransactionType("all");
		setCurrentPage(1); // Reset page to 1 on filter clear
	};

	const handleTransactionTypeChange = (value: string) => {
		setTransactionType(value);
		setCurrentPage(1); // Reset page to 1 on transaction type change
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	return (
		<Card className="shadow-lg">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Filter className="h-5 w-5" />
					Transaction History
				</CardTitle>
				<CardDescription>Filter and view your recent transactions</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="flex flex-col sm:flex-row justify-between gap-4">
					<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
						<div className="space-y-2 flex-1">
							<Label htmlFor="date-range">Date Range</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button id="date-range" variant="outline" className="w-full justify-start text-left font-normal border-gray-300">
										<CalendarIcon className="mr-2 h-4 w-4" />
										{dateRange.from ? (
											dateRange.to ? (
												<>
													{formatDate(dateRange.from.toString(), "yyyy-MM-dd")} - {formatDate(dateRange.to.toString(), "yyyy-MM-dd")}
												</>
											) : (
												formatDate(dateRange.from.toString(), "yyyy-MM-dd")
											)
										) : (
											<span>Pick a date range</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar initialFocus mode="range" defaultMonth={dateRange.from} selected={{ from: dateRange.from, to: dateRange.to }} onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })} numberOfMonths={2} />
								</PopoverContent>
							</Popover>
						</div>
						<div className="space-y-2 flex-1">
							<Label htmlFor="transaction-type">Transaction Type</Label>
							<Select value={transactionType} onValueChange={handleTransactionTypeChange}>
								<SelectTrigger className="border-gray-300">
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Transactions</SelectItem>
									<SelectItem value="credit">Credit Only</SelectItem>
									<SelectItem value="debit">Debit Only</SelectItem>
									<SelectItem value="withdrawal">Withdrawal Only</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="flex items-end">
						<Button onClick={handleClearFilters} variant="outline" className="border-gray-300 hover:bg-gray-100">
							Clear Filters
						</Button>
					</div>
				</div>
				<TransactionList transactions={transactions} isLoading={isLoading} currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
			</CardContent>
		</Card>
	);
}

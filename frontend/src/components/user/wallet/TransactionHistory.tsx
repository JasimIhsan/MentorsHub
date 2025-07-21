import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { TransactionList } from "./TransactionList";
import { IWalletTransaction } from "@/pages/user/WalletPage";

interface TransactionHistoryProps {
	transactions: IWalletTransaction[];
	isLoading: boolean;
	transactionType: string;
	setTransactionType: (value: string) => void;
	dateRange: { from: Date | undefined; to: Date | undefined };
	setDateRange: React.Dispatch<React.SetStateAction<{ from: Date | undefined; to: Date | undefined }>>;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	totalPages: number;
	fetchTransactions: () => Promise<void>;
}

// Component for displaying transaction history with filters
export function TransactionHistory({ transactions, isLoading, transactionType, setTransactionType, dateRange, setDateRange, currentPage, setCurrentPage, totalPages, fetchTransactions }: TransactionHistoryProps) {
	// Handle date input changes
	const handleDateChange = (field: "from" | "to", value: string) => {
		if (!value) {
			setDateRange((prev: { from: Date | undefined; to: Date | undefined }) => ({
				...prev,
				[field]: undefined,
			}));
			return;
		}
		const date = new Date(value);
		if (!isNaN(date.getTime())) {
			setDateRange((prev: { from: Date | undefined; to: Date | undefined }) => ({
				...prev,
				[field]: date,
			}));
		}
	};

	// Handle apply filters
	const handleApplyFilters = () => {
		setCurrentPage(1); // Reset to first page on filter apply
		fetchTransactions();
	};

	// Handle clear filters
	const handleClearFilters = () => {
		setDateRange({ from: undefined, to: undefined });
		setTransactionType("all");
		setCurrentPage(1);
		fetchTransactions();
	};

	// Handle transaction type change
	const handleTransactionTypeChange = (value: string) => {
		setTransactionType(value);
		setCurrentPage(1); // Reset page to 1 on transaction type change
	};

	// Handle page change
	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
			fetchTransactions();
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
							<Label htmlFor="from-date">From Date</Label>
							<Input id="from-date" type="date" value={dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : ""} onChange={(e) => handleDateChange("from", e.target.value)} placeholder="YYYY-MM-DD" />
						</div>
						<div className="space-y-2 flex-1">
							<Label htmlFor="to-date">To Date</Label>
							<Input id="to-date" type="date" value={dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : ""} onChange={(e) => handleDateChange("to", e.target.value)} placeholder="YYYY-MM-DD" />
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
					<div className="flex items-end space-x-2">
						<Button onClick={handleApplyFilters}>Apply Filters</Button>
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

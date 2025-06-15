import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Filter, CalendarIcon, Wallet, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { formatDate } from "@/utility/time-data-formater";
import { fetchPlatformTransactionsAPI, fetchPlatformWalletDataAPI, withdrawPlatformWalletAPI } from "@/api/wallet.api.service";

// Define admin transaction interface
export interface IWalletTransaction {
	_id: string;
	fromUserId: {
		id: string;
		name: string;
		avatar: string;
	};
	toUserId: {
		id: string;
		name: string;
		avatar: string;
	};
	fromRole: "user" | "mentor" | "admin";
	toRole: "user" | "mentor" | "admin";
	amount: number;
	type: "credit" | "debit";
	purpose: "session_fee" | "platform_fee" | "refund" | "withdrawal" | "wallet_topup";
	description?: string;
	sessionId?: {
		id: string;
		topic: string;
	} | null;
	createdAt: Date;
}

export function AdminWalletPage() {
	const [walletBalance, setWalletBalance] = useState<number | null>(null);
	const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
	const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
		from: undefined,
		to: undefined,
	});
	const [transactionType, setTransactionType] = useState<string>("all");
	const [transactions, setTransactions] = useState<IWalletTransaction[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoadingWallet, setIsLoadingWallet] = useState(true);
	const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
	const [withdrawAmount, setWithdrawAmount] = useState<string>("");
	const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

	const user = useSelector((state: RootState) => state.adminAuth.admin);
	const transactionsPerPage = 5;

	// Handle withdrawal
	const handleWithdraw = async () => {
		const amountNum = parseFloat(withdrawAmount);
		console.log("withdrawAmount: ", withdrawAmount);
		if (!withdrawAmount || amountNum <= 0) {
			setNotification({ type: "error", message: "Please enter a valid amount" });
			setTimeout(() => setNotification(null), 3000);
			return;
		}
		if (walletBalance !== null && amountNum > walletBalance) {
			setNotification({ type: "error", message: "Insufficient balance" });
			setTimeout(() => setNotification(null), 3000);
			return;
		}

		try {
			const response = await withdrawPlatformWalletAPI(user?.id as string, amountNum);
			if (response.success) {
				setWalletBalance(response.wallet.balance);
				setTransactions((prev) => [response.transaction, ...prev]);
				setNotification({ type: "success", message: "Withdrawal successfully!" });
				setIsWithdrawModalOpen(false);
				setWithdrawAmount("");
			} else {
				throw new Error("Failed to withdraw money");
			}
		} catch (error: any) {
			setNotification({ type: "error", message: error.message || "Failed to withdraw money" });
			setTimeout(() => setNotification(null), 3000);
		}
	};

	// Fetch admin wallet data
	useEffect(() => {
		const fetchWalletData = async () => {
			try {
				setIsLoadingWallet(true);
				const response = await fetchPlatformWalletDataAPI(user?.id as string);
				if (response.success) {
					setWalletBalance(response.wallet.balance);
				}
			} catch (error: any) {
				setNotification({ type: "error", message: error.message || "Failed to fetch wallet data" });
				setTimeout(() => setNotification(null), 3000);
			} finally {
				setIsLoadingWallet(false);
			}
		};
		if (user?.id) {
			fetchWalletData();
		}
	}, [user?.id]);

	// Fetch admin transactions
	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				setIsLoadingTransactions(true);
				const response = await fetchPlatformTransactionsAPI(
					user?.id as string,
					currentPage,
					transactionsPerPage,
					transactionType,
					dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "",
					dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : ""
				);
				if (response.success) {
					setTransactions(response.transactions);
					setTotalPages(Math.ceil(response.total / transactionsPerPage));
				}
			} catch (error: any) {
				setNotification({ type: "error", message: error.message || "Failed to fetch transactions" });
				setTimeout(() => setNotification(null), 3000);
			} finally {
				setIsLoadingTransactions(false);
			}
		};
		if (user?.id) {
			fetchTransactions();
		}
	}, [currentPage, transactionType, dateRange, user?.id]);

	const getStatusBadge = (type: string) => {
		const variants = {
			credit: "bg-green-100 text-green-800 border-green-200",
			debit: "bg-red-100 text-red-800 border-red-200",
		};
		return variants[type as keyof typeof variants] || "bg-gray-100 text-gray-800";
	};

	const getPurposeLabel = (purpose: string) => {
		const labels = {
			session_fee: "Session Fee",
			platform_fee: "Platform Fee",
			refund: "Refund",
			withdrawal: "Withdrawal",
			wallet_topup: "Wallet Topup",
		};
		return labels[purpose as keyof typeof labels] || purpose;
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const handleClearFilters = () => {
		setDateRange({ from: undefined, to: undefined });
		setTransactionType("all");
		setCurrentPage(1);
	};

	// Skeleton for Wallet Balance Card
	const WalletBalanceSkeleton = () => (
		<Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl lg:col-span-2">
			<CardContent className="p-6 sm:p-8">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="space-y-2">
						<Skeleton className="bg-gray-300/60 h-4 w-[100px]" />
						<Skeleton className="bg-gray-300/60 h-10 w-[200px]" />
					</div>
					<Skeleton className="bg-gray-300/60 h-12 w-12 rounded-full" />
				</div>
			</CardContent>
		</Card>
	);

	// Skeleton for Transaction Card
	const TransactionSkeleton = () => (
		<Card className="border border-gray-200 py-1">
			<CardContent className="p-4">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="flex items-center space-x-4">
						<Skeleton className="bg-gray-300/60 h-10 w-10 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="bg-gray-300/60 h-4 w-[150px]" />
							<Skeleton className="bg-gray-300/60 h-4 w-[200px]" />
							<Skeleton className="bg-gray-300/60 h-4 w-[100px]" />
							<Skeleton className="bg-gray-300/60 h-4 w-[120px]" />
						</div>
					</div>
					<div className="space-y-2 text-right">
						<Skeleton className="bg-gray-300/60 h-4 w-[80px]" />
						<div className="flex items-center gap-2">
							<Skeleton className="bg-gray-300/60 h-4 w-4 rounded-full" />
							<Skeleton className="bg-gray-300/60 h-4 w-[60px]" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<div>
			<div className="mx-auto max-w-7xl space-y-6">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Platform Wallet</h1>
					<p className="text-muted-foreground">Manage platform revenue and transactions</p>
				</div>

				{/* Notification */}
				{notification && (
					<Alert className={`${notification.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
						<AlertDescription className={notification.type === "success" ? "text-green-800" : "text-red-800"}>{notification.message}</AlertDescription>
					</Alert>
				)}

				{/* Wallet Balance */}
				{isLoadingWallet ? (
					<WalletBalanceSkeleton />
				) : (
					<Card className="bg-gradient-to-br text-white from-blue-600 to-blue-700 shadow-xl rounded-2xl overflow-hidden">
						<CardContent className="p-6 sm:p-8">
							<div className="flex flex-col sm:flex-row items-center justify-between gap-6">
								<div className="flex items-center gap-4">
									<div className="bg-white/20 p-4 rounded-full">
										<Wallet className="h-8 w-8" />
									</div>{" "}
									<div>
										<p className="text-blue-100 font-medium">Platform Balance</p>
										<p className="text-4xl font-extrabold text-white-800">{walletBalance !== null ? `₹${walletBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "Loading..."}</p>
									</div>
								</div>
								<Button onClick={() => user?.isSuperAdmin && setIsWithdrawModalOpen(true)} disabled={!user?.isSuperAdmin} variant="outline" className={`${user?.isSuperAdmin ? "" : "cursor-not-allowed"} text-primary  font-bold px-6 py-3 `}>
									Withdraw
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Withdraw Money Modal */}
				<Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Withdraw Money from Platform Wallet</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="amount">Amount (₹)</Label>
								<Input id="amount" type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Enter amount" min="1" />
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => {
									setIsWithdrawModalOpen(false);
									setWithdrawAmount("");
								}}>
								Cancel
							</Button>
							<Button onClick={handleWithdraw} disabled={!user?.isSuperAdmin || !withdrawAmount || parseFloat(withdrawAmount) <= 0}>
								Confirm Withdrawal
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Transaction History Section */}
				<Card className="shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-2xl">
							<Filter className="h-5 w-5" />
							Transaction History
						</CardTitle>
						<CardDescription>Filter and view platform transactions</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Filters */}
						<div className="flex justify-between">
							<div className="flex space-x-4">
								<div className="space-y-2">
									<Label htmlFor="date-range">Date Range</Label>
									<Popover>
										<PopoverTrigger asChild>
											<Button id="date-range" variant="outline" className="w-full justify-start text-left font-normal">
												<CalendarIcon className="mr-2 h-4 w-4" />
												{dateRange.from ? (
													dateRange.to ? (
														<>
															{formatDate(dateRange.from.toString())} - {formatDate(dateRange.to.toString())}
														</>
													) : (
														formatDate(dateRange.from.toString())
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
								<div className="space-y-2">
									<Label htmlFor="transaction-type">Transaction Type</Label>
									<Select value={transactionType} onValueChange={setTransactionType}>
										<SelectTrigger>
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
							<div className="flex items-end">
								<Button onClick={handleClearFilters}>Clear Filters</Button>
							</div>
						</div>

						{/* Recent Transactions List */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Recent Transactions</h3>
							{isLoadingTransactions ? (
								<div className="space-y-3">
									{[...Array(3)].map((_, index) => (
										<TransactionSkeleton key={index} />
									))}
								</div>
							) : transactions.length === 0 ? (
								<p className="text-gray-500">No transactions available.</p>
							) : (
								<>
									<div className="space-y-3">
										{transactions.map((transaction) => (
											<Card key={transaction._id} className="border border-gray-200 hover:shadow-md transition-shadow py-1">
												<CardContent className="p-4">
													<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
														<div className="flex items-center space-x-4">
															<div className={`p-2 rounded-full ${transaction.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
																{transaction.type === "credit" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
															</div>
															<div>
																<p className="font-medium text-gray-900">{getPurposeLabel(transaction.purpose)}</p>
																<p className="text-sm text-gray-500">{transaction.description || "No description"}</p>
																{transaction.fromUserId && transaction.purpose !== "withdrawal" && <p className="text-sm text-gray-500">From: {transaction.fromUserId.name}</p>}
																<p className="text-sm text-gray-500">{formatDate(String(transaction.createdAt))}</p>
															</div>
														</div>
														<div className="flex flex-col items-end space-y-1">
															<p className={`font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
																{transaction.type === "credit" ? "+" : "-"}₹
																{transaction.amount.toLocaleString("en-IN", {
																	minimumFractionDigits: 2,
																})}
															</p>
															<Badge variant="outline" className={`text-xs ${getStatusBadge(transaction.type)}`}>
																{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
															</Badge>
														</div>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
									{/* Pagination Controls */}
									<div className="flex justify-between items-center mt-4">
										<Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} variant="outline" className="text-sm">
											Previous
										</Button>
										<p className="text-sm text-gray-600">
											Page {currentPage} of {totalPages}
										</p>
										<Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="outline" className="text-sm">
											Next
										</Button>
									</div>
								</>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

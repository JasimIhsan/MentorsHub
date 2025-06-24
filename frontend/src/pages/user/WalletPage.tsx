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
import { Plus, Minus, ArrowUpRight, ArrowDownLeft, Filter, CalendarIcon, Wallet } from "lucide-react";
import { format } from "date-fns";
import { fetchTransactionsAPI, fetchWalletDataAPI, topupWalletAPI, withdrawWalletAPI } from "@/api/wallet.api.service";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { formatDate } from "@/utility/time-data-formater";
import { useMotionValue } from "framer-motion";
import { toast } from "sonner";

declare global {
	interface Window {
		Razorpay: any;
	}
}

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
	type: "credit" | "debit" | "withdrawal";
	purpose: "session_fee" | "platform_fee" | "refund" | "withdrawal" | "wallet_topup";
	description?: string;
	sessionId?: {
		id: string;
		topic: string;
	} | null;
	createdAt: Date;
}

export function WalletPage() {
	const [walletBalance, setWalletBalance] = useState<number | null>(null);
	const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
	const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
		from: undefined,
		to: undefined,
	});
	const [transactionType, setTransactionType] = useState<string>("all");
	const [isWalletCreated, setIsWalletCreated] = useState(false);
	const [transactions, setTransactions] = useState<IWalletTransaction[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoadingWallet, setIsLoadingWallet] = useState(true);
	const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
	const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
	const [amount, setAmount] = useState<string>("");
	const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
	const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
	const [withdrawAmount, setWithdrawAmount] = useState<string>("");

	const user = useSelector((state: RootState) => state.userAuth.user);
	const transactionsPerPage = 5;

	// Swipe button state
	const x = useMotionValue(0);

	// Load Razorpay checkout script
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.async = true;
		script.onload = () => setIsRazorpayLoaded(true);
		script.onerror = () => {
			setNotification({ type: "error", message: "Failed to load Razorpay SDK" });
			setTimeout(() => setNotification(null), 3000);
		};
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);

	// Fetch wallet data
	useEffect(() => {
		const fetchWalletData = async () => {
			try {
				setIsLoadingWallet(true);
				const response = await fetchWalletDataAPI(user?.id as string);
				if (response.success) {
					setIsWalletCreated(true);
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

	// Fetch transactions
	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				setIsLoadingTransactions(true);
				const response = await fetchTransactionsAPI(user?.id as string, currentPage, transactionsPerPage, transactionType, dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "", dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "");
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
		if (isWalletCreated && user?.id) {
			fetchTransactions();
		}
	}, [isWalletCreated, currentPage, transactionType, dateRange, user?.id]);

	const handleCreateWallet = async () => {
		try {
			setIsLoadingWallet(true);
			setNotification({ type: "success", message: "Wallet creation request submitted successfully!" });
			setTimeout(() => {
				setIsWalletCreated(true);
				setWalletBalance(0);
				setNotification({ type: "success", message: "Wallet created successfully!" });
				setTimeout(() => setNotification(null), 3000);
			}, 2000);
		} catch (error: any) {
			setNotification({ type: "error", message: error.message || "Failed to create wallet" });
			setTimeout(() => setNotification(null), 3000);
		} finally {
			setIsLoadingWallet(false);
		}
	};

	const handleWithdraw = async () => {
		const amountNum = parseFloat(withdrawAmount);
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
			const response = await withdrawWalletAPI(user?.id as string, amountNum);
			if (response.success) {
				setWalletBalance(response.wallet.balance);
				setTransactions((prev) => [response.transaction, ...prev]);
				setNotification({ type: "success", message: "Withdrawal successfully!" });
				setIsWithdrawModalOpen(false);
				setWithdrawAmount("");
			}
		} catch (error) {
			console.log(`Error  : `, error);
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	const handleAddMoney = async () => {
		if (!isRazorpayLoaded) {
			setNotification({ type: "error", message: "Razorpay SDK not loaded" });
			setTimeout(() => setNotification(null), 3000);
			return;
		}

		const amountInPaise = parseFloat(amount) * 100;
		if (!amount || amountInPaise <= 0) {
			setNotification({ type: "error", message: "Please enter a valid amount" });
			setTimeout(() => setNotification(null), 3000);
			return;
		}

		try {
			const options = {
				key: import.meta.env.VITE_RAZORPAY_KEY,
				amount: amountInPaise,
				currency: "INR",
				name: "MentorHub Wallet Topup",
				description: "Wallet Topup",
				handler: async (response: any) => {
					try {
						const topUpData = {
							amount: parseFloat(amount),
							purpose: "wallet_topup",
							description: "Wallet topup",
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_order_id: response.razorpay_order_id,
							razorpay_signature: response.razorpay_signature,
						};

						const topUpResponse = await topupWalletAPI(user?.id as string, topUpData);
						if (topUpResponse.success) {
							setWalletBalance(topUpResponse.data.wallet.balance);
							setTransactions((prev) => [topUpResponse.data.transaction, ...prev]);
							setNotification({ type: "success", message: "Money added successfully!" });
							setIsAddMoneyModalOpen(false);
							setAmount("");
						} else {
							throw new Error("Failed to top up wallet");
						}
					} catch (error: any) {
						setNotification({ type: "error", message: error.message || "Payment verification failed" });
					} finally {
						setTimeout(() => setNotification(null), 3000);
					}
				},
				prefill: {
					name: user?.firstName || "" + " " + user?.lastName || "",
					email: user?.email || "",
				},
				theme: {
					color: "#112d4e",
				},
			};

			const razorpay = new window.Razorpay(options);
			razorpay.open();
		} catch (error: any) {
			setNotification({ type: "error", message: error.message || "Failed to initiate payment" });
			setTimeout(() => setNotification(null), 3000);
		}
	};

	const getStatusBadge = (type: string) => {
		const variants = {
			credit: "bg-green-100 text-green-800 border-green-200",
			debit: "bg-red-100 text-red-800 border-red-200",
			withdrawal: "bg-orange-100 text-orange-800 border-orange-200",
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
		<div className="flex flex-col items-center w-full py-8">
			<div className="flex flex-col gap-4 px-10 md:px-20 xl:px-25 justify-center w-full min-h-screen">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">My Wallet</h1>
					<p className="text-muted-foreground">Manage your money with ease</p>
				</div>

				{/* Notification */}
				{notification && (
					<Alert className={`${notification.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
						<AlertDescription className={notification.type === "success" ? "text-green-800" : "text-red-800"}>{notification.message}</AlertDescription>
					</Alert>
				)}

				{/* Wallet Creation or Wallet Page */}
				{!isWalletCreated && !isLoadingWallet ? (
					<Card className="shadow-xl border border-gray-200 max-w-md mx-auto transition-transform hover:scale-[1.02]">
						<CardHeader className="text-center">
							<div className="mb-4 flex justify-center">
								<div className="bg-blue-100 p-3 rounded-full">
									<Wallet className="h-8 w-8 text-blue-600" />
								</div>
							</div>
							<CardTitle className="text-2xl font-bold text-gray-900">Get Started with Your Wallet</CardTitle>
							<CardDescription className="text-gray-600">Create your wallet to manage your money seamlessly.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6 text-center">
							<p className="text-gray-500">You don't have a wallet yet. Submit a request to create one and unlock all wallet features.</p>
							<Button onClick={handleCreateWallet} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 transition-all duration-200 hover:shadow-lg">
								<Wallet className="h-5 w-5 mr-2" />
								Create Wallet Now
							</Button>
						</CardContent>
					</Card>
				) : (
					<>
						{/* Wallet Balance and Actions */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
							{isLoadingWallet ? (
								<WalletBalanceSkeleton />
							) : (
								<Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl lg:col-span-2">
									<CardContent className="p-6 sm:p-8">
										<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
											<div>
												<p className="text-blue-100 text-sm font-medium mb-2">Current Balance</p>
												<p className="text-4xl sm:text-5xl font-bold">{walletBalance !== null ? `₹${walletBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "Loading..."}</p>
											</div>
											<div className="bg-white/20 p-4 rounded-full">
												<Wallet className="h-8 w-8" />
											</div>
										</div>
									</CardContent>
								</Card>
							)}
							<div className="flex flex-col gap-4">
								<Button onClick={() => setIsAddMoneyModalOpen(true)} className="flex-1 text-lg font-semibold bg-green-600 hover:bg-green-700 shadow-lg">
									<Plus className="h-6 w-6 mr-2" />
									Add Money
								</Button>
								<Button onClick={() => setIsWithdrawModalOpen(true)} variant="outline" className="flex-1 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-lg">
									<Minus className="h-6 w-6 mr-2" />
									Withdraw
								</Button>
							</div>
						</div>

						{/* Add Money Modal */}
						<Dialog open={isAddMoneyModalOpen} onOpenChange={setIsAddMoneyModalOpen}>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add Money to Wallet</DialogTitle>
								</DialogHeader>
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="amount">Amount (₹)</Label>
										<Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" min="1" />
									</div>
								</div>
								<DialogFooter>
									<Button variant="outline" onClick={() => setIsAddMoneyModalOpen(false)}>
										Cancel
									</Button>
									<Button onClick={handleAddMoney} disabled={!isRazorpayLoaded || !amount || parseFloat(amount) <= 0}>
										Proceed to Payment
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>

						{/* Withdraw Money Dialog */}
						<Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
							<DialogContent className="max-w-lg">
								<DialogHeader>
									<DialogTitle>Withdraw Money</DialogTitle>
								</DialogHeader>
								<div className="space-y-6">
									{/* Amount Input */}
									<div className="space-y-2">
										<Label htmlFor="withdraw-amount">Amount (₹)</Label>
										<Input id="withdraw-amount" type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Enter amount" min="1" className="border-gray-300 focus:ring-blue-500" />
									</div>
								</div>
								<DialogFooter>
									<Button onClick={handleWithdraw} disabled={!isRazorpayLoaded || !withdrawAmount || parseFloat(withdrawAmount) <= 0}>
										Withdraw
									</Button>
									<Button
										variant="outline"
										onClick={() => {
											setIsWithdrawModalOpen(false);
											setWithdrawAmount("");
											x.set(0);
										}}
										className="border-gray-300 hover:bg-gray-100">
										Cancel
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>

						{/* Transaction History Section */}
						<Card className="shadow-lg">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Filter className="h-5 w-5" />
									Transaction History
								</CardTitle>
								<CardDescription>Filter and view your recent transactions</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Filters */}
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
													<Calendar
														initialFocus
														mode="range"
														defaultMonth={dateRange.from}
														selected={{ from: dateRange.from, to: dateRange.to }}
														onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
														numberOfMonths={2}
													/>
												</PopoverContent>
											</Popover>
										</div>

										<div className="space-y-2 flex-1">
											<Label htmlFor="transaction-type">Transaction Type</Label>
											<Select value={transactionType} onValueChange={setTransactionType}>
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
																	<div className={`p-2 rounded-full ${transaction.type === "credit" ? "bg-green-100 text-green-600" : transaction.type === "withdrawal" ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"}`}>
																		{transaction.type === "credit" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
																	</div>
																	<div>
																		<p className="font-medium text-gray-900">{getPurposeLabel(transaction.purpose)}</p>
																		<p className="text-sm text-gray-500">{transaction.description || "No description"}</p>
																		{transaction.purpose !== "wallet_topup" && (
																			<p className="text-sm text-gray-500">{transaction.toUserId ? `To: ${transaction.toUserId.name}` : transaction.fromUserId ? `From: ${transaction.fromUserId.name}` : ""} </p>
																		)}
																		<p className="text-sm text-gray-500">{formatDate(String(transaction.createdAt))}</p>
																	</div>
																</div>
																<div className="flex flex-col items-end space-y-1">
																	<p className={`font-semibold ${transaction.type === "credit" ? "text-green-600" : transaction.type === "withdrawal" ? "text-orange-600" : "text-red-600"}`}>
																		{transaction.type === "credit" ? "+" : "-"}₹
																		{transaction.amount.toLocaleString("en-IN", {
																			minimumFractionDigits: 2,
																		})}
																	</p>
																	<div className="flex items-center gap-2">
																		<Badge variant="outline" className={`text-xs ${getStatusBadge(transaction.type)}`}>
																			{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
																		</Badge>
																	</div>
																</div>
															</div>
														</CardContent>
													</Card>
												))}
											</div>
											{/* Pagination Controls */}
											<div className="flex justify-between items-center mt-4">
												<Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} variant="outline" className="text-sm border-gray-300 hover:bg-gray-100">
													Previous
												</Button>
												<p className="text-sm text-gray-600">
													Page {currentPage} of {totalPages}
												</p>
												<Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="outline" className="text-sm border-gray-300 hover:bg-gray-100">
													Next
												</Button>
											</div>
										</>
									)}
								</div>
							</CardContent>
						</Card>
					</>
				)}
			</div>
		</div>
	);
}

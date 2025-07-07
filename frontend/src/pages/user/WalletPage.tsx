import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { fetchTransactionsAPI, fetchWalletDataAPI, topupWalletAPI, withdrawWalletAPI } from "@/api/wallet.api.service";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMotionValue } from "framer-motion";
import { toast } from "sonner";
import { WalletNotification } from "@/components/user/wallet/WalletNotification";
import { AddMoneyModal } from "@/components/user/wallet/AddMoneyModal";
import { TransactionHistory } from "@/components/user/wallet/TransactionHistory";
import { WalletBalanceCard } from "@/components/user/wallet/WalletBalanceCard";
import { WalletCreationCard } from "@/components/user/wallet/WalletCreationCard";
import { WithdrawMoneyModal } from "@/components/user/wallet/WithdrawMoneyModal";

// Interface for wallet transactions
export interface IWalletTransaction {
	_id: string;
	fromUserId: { id: string; name: string; avatar: string };
	toUserId: { id: string; name: string; avatar: string };
	fromRole: "user" | "mentor" | "admin";
	toRole: "user" | "mentor" | "admin";
	amount: number;
	type: "credit" | "debit" | "withdrawal";
	purpose: "session_fee" | "platform_fee" | "refund" | "withdrawal" | "wallet_topup";
	description?: string;
	sessionId?: { id: string; topic: string } | null;
	createdAt: Date;
}

// Declare Razorpay globally
declare global {
	interface Window {
		Razorpay: any;
	}
}

// Main WalletPage component
export function WalletPage() {
	const [walletBalance, setWalletBalance] = useState<number | null>(null);
	const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
	const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
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
	const x = useMotionValue(0); // Swipe button state

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

	// Handle wallet creation
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

	// Handle withdrawal
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
			console.log(`Error: `, error);
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	// Handle adding money
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

	return (
		<div className="flex flex-col items-center w-full py-8">
			<div className="flex flex-col gap-4 px-10 md:px-20 xl:px-25  w-full min-h-screen">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">My Wallet</h1>
					<p className="text-muted-foreground">Manage your money with ease</p>
				</div>
				<WalletNotification notification={notification} />
				{!isWalletCreated && !isLoadingWallet ? (
					<WalletCreationCard onCreateWallet={handleCreateWallet} isLoading={isLoadingWallet} />
				) : (
					<>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
							<WalletBalanceCard balance={walletBalance} isLoading={isLoadingWallet} />
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
						<AddMoneyModal isOpen={isAddMoneyModalOpen} onOpenChange={setIsAddMoneyModalOpen} amount={amount} setAmount={setAmount} onAddMoney={handleAddMoney} isRazorpayLoaded={isRazorpayLoaded} />
						<WithdrawMoneyModal isOpen={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen} amount={withdrawAmount} setAmount={setWithdrawAmount} onWithdraw={handleWithdraw} isRazorpayLoaded={isRazorpayLoaded} x={x} />
						<TransactionHistory
							transactions={transactions}
							isLoading={isLoadingTransactions}
							transactionType={transactionType}
							setTransactionType={setTransactionType}
							dateRange={dateRange}
							setDateRange={setDateRange}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							totalPages={totalPages}
						/>
					</>
				)}
			</div>
		</div>
	);
}

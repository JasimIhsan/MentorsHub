import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { createWalletAPI, fetchTransactionsAPI, fetchWalletDataAPI, topupWalletAPI } from "@/api/wallet.api.service";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMotionValue } from "framer-motion";
import { toast } from "sonner";
import { AddMoneyModal } from "@/components/user/wallet/AddMoneyModal";
import { TransactionHistory } from "@/components/user/wallet/TransactionHistory";
import { WalletBalanceCard } from "@/components/user/wallet/WalletBalanceCard";
import { WithdrawMoneyModal } from "@/components/user/wallet/WithdrawMoneyModal";
import { reqeustWithdrawalAPI } from "@/api/withdrawal.api.service";

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
	const [isRequestedWithdrawal, setIsRequestedWithdrawal] = useState(false);
	const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
	const [transactionType, setTransactionType] = useState<string>("all");
	const [isWalletCreated, setIsWalletCreated] = useState(false);
	const [transactions, setTransactions] = useState<IWalletTransaction[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoadingWallet, setIsLoadingWallet] = useState(true);
	const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
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
		script.onerror = () => toast.error("Failed to load Razorpay SDK");
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
					setIsRequestedWithdrawal(response.wallet.isRequestedWithdrawal);
				}
			} catch (error: any) {
				setWalletBalance(0); // Set balance to 0 if wallet doesn't exist
				setTransactions([]); // Set empty transactions
				toast.error(error.message || "Failed to fetch wallet data");
			} finally {
				setIsLoadingWallet(false);
			}
		};
		if (user?.id) {
			fetchWalletData();
		}
	}, [user?.id]);

	// Fetch transactions
	const fetchTransactions = async () => {
		try {
			setIsLoadingTransactions(true);
			const response = await fetchTransactionsAPI(user?.id as string, currentPage, transactionsPerPage, transactionType, dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "", dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "");
			if (response.success) {
				setTransactions(response.transactions);
				setTotalPages(Math.ceil(response.total / transactionsPerPage));
			}
		} catch (error: any) {
			toast.error(error.message || "Failed to fetch transactions");
		} finally {
			setIsLoadingTransactions(false);
		}
	};

	// Initial fetch on wallet creation
	useEffect(() => {
		if (user?.id) {
			fetchTransactions();
		}
	}, [isWalletCreated, user?.id]);

	// Handle wallet creation
	const handleCreateWallet = async () => {
		try {
			setIsLoadingWallet(true);
			const response = await createWalletAPI(user?.id!, user?.role!);
			if (response.success) {
				setIsWalletCreated(true);
				setWalletBalance(response.wallet.balance);
				toast.success("Wallet created successfully");
			}
		} catch (error: any) {
			toast.error(error.message || "Failed to create wallet");
		} finally {
			setIsLoadingWallet(false);
		}
	};

	// Handle withdrawal
	const handleWithdraw = async () => {
		if (!walletBalance) return;
		const amountNum = parseFloat(withdrawAmount);
		if (walletBalance < 0) {
			toast.error("Withdrawal not allowed. Your wallet is in debt to the platform.");
			return;
		}
		if (!withdrawAmount || amountNum <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}
		if (walletBalance !== null && amountNum > walletBalance) {
			toast.error("Insufficient balance");
			return;
		}
		try {
			const response = await reqeustWithdrawalAPI(user?.id as string, amountNum);
			if (response.success) {
				toast.success(response.message || "Withdrawal request submitted successfully.");
				setIsRequestedWithdrawal(true);
				setIsWithdrawModalOpen(false);
				setWithdrawAmount("");
			}
		} catch (error) {
			console.error(`Error: `, error);
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	// Handle adding money
	const handleAddMoney = async () => {
		if (!isRazorpayLoaded) {
			toast.error("Razorpay SDK not loaded");
			return;
		}
		const amountInPaise = parseFloat(amount) * 100;
		if (!amount || amountInPaise <= 0) {
			toast.error("Please enter a valid amount");
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
							toast.success("Money added successfully!");
							setIsAddMoneyModalOpen(false);
							setAmount("");
						} else {
							throw new Error("Failed to top up wallet");
						}
					} catch (error: any) {
						toast.error(error.message || "Payment verification failed");
					}
				},
				prefill: {
					name: `${user?.firstName || ""} ${user?.lastName || ""}`,
					email: user?.email || "",
				},
				theme: {
					color: "#112d4e",
				},
			};
			const razorpay = new window.Razorpay(options);
			razorpay.open();
		} catch (error: any) {
			toast.error(error.message || "Failed to initiate payment");
		}
	};

	return (
		<div className="flex flex-col items-center w-full py-12 bg-gradient-to-b from-gray-50 to-gray-100">
			<div className="flex flex-col gap-8 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 w-full max-w-7xl">
				<div className="text-center md:text-left">
					<h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">My Wallet</h1>
					<p className="mt-2 text-lg text-gray-600">Manage your balance and track your transactions seamlessly</p>
				</div>

				<>
					<div className={`${isWalletCreated ? "grid grid-cols-1 lg:grid-cols-3 gap-6" : "flex flex-col gap-8"}`}>
						<WalletBalanceCard
							isRequestedWithdrawal={isRequestedWithdrawal}
							isWalletExists={isWalletCreated}
							balance={walletBalance ?? 0}
							isLoading={isLoadingWallet}
							handleCreateWallet={handleCreateWallet} // Pass handleCreateWallet as prop
						/>
						{isWalletCreated && (
							<div className="flex sm:flex-col flex-row gap-4 lg:col-span-1">
								<Button onClick={() => setIsAddMoneyModalOpen(true)} className="flex-1 text-lg font-semibold bg-green-600 hover:bg-green-700 shadow-md rounded-lg py-3">
									<Plus className="h-6 w-6 mr-2" />
									Add Money
								</Button>
								<Button onClick={() => setIsWithdrawModalOpen(true)} variant="outline" className="flex-1 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-md rounded-lg py-3">
									<Minus className="h-6 w-6 mr-2" />
									Withdraw
								</Button>
							</div>
						)}
					</div>
					<AddMoneyModal isOpen={isAddMoneyModalOpen} onOpenChange={setIsAddMoneyModalOpen} amount={amount} setAmount={setAmount} onAddMoney={handleAddMoney} isRazorpayLoaded={isRazorpayLoaded} />
					<WithdrawMoneyModal walletBalance={walletBalance ?? 0} isOpen={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen} amount={withdrawAmount} setAmount={setWithdrawAmount} onWithdraw={handleWithdraw} isRazorpayLoaded={isRazorpayLoaded} x={x} />
				</>

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
					fetchTransactions={fetchTransactions}
				/>
			</div>
		</div>
	);
}

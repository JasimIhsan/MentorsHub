import { TransactionCard } from "@/components/admin/Wallet/TransactionCard";
import { TransactionFilters } from "@/components/admin/Wallet/TransactionFilters";
import { WalletBalance } from "@/components/admin/Wallet/WalletBalance";
import { WithdrawModal } from "@/components/admin/Wallet/WithdrawModal";
import { PaginationControls } from "@/components/custom/PaginationControls";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TransactionSkeleton } from "@/components/user/wallet/skeleton/TransactionSkeleton";
import { WalletBalanceSkeleton } from "@/components/user/wallet/skeleton/WalletBalanceSkeleton";
import { useAdminWalletData } from "@/hooks/useAdminWalletData";
import { Filter } from "lucide-react";

// Main wallet management page
export function AdminWalletPage() {
	const transactionsPerPage = 5;
	const {
		walletBalance,
		dateRange,
		transactionType,
		setTransactionType,
		transactions,
		currentPage,
		totalPages,
		isLoadingWallet,
		isLoadingTransactions,
		withdrawAmount,
		setWithdrawAmount,
		isWithdrawModalOpen,
		setIsWithdrawModalOpen,
		handleWithdraw,
		handleDateChange,
		handleApplyFilters,
		handleClearFilters,
		handlePageChange,
	} = useAdminWalletData(transactionsPerPage);

	return (
		<div>
			<div className="mx-auto max-w-7xl space-y-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Platform Wallet</h1>
					<p className="text-muted-foreground">Manage platform revenue and transactions</p>
				</div>
				{isLoadingWallet ? <WalletBalanceSkeleton /> : <WalletBalance walletBalance={walletBalance} setIsWithdrawModalOpen={setIsWithdrawModalOpen} />}
				<WithdrawModal isOpen={isWithdrawModalOpen} setIsOpen={setIsWithdrawModalOpen} withdrawAmount={withdrawAmount} setWithdrawAmount={setWithdrawAmount} handleWithdraw={handleWithdraw} />
				<Card className="shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-2xl">
							<Filter className="h-5 w-5" />
							Transaction History
						</CardTitle>
						<CardDescription>Filter and view platform transactions</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<TransactionFilters
							dateRange={dateRange}
							transactionType={transactionType}
							setTransactionType={setTransactionType}
							handleDateChange={handleDateChange}
							handleApplyFilters={handleApplyFilters}
							handleClearFilters={handleClearFilters}
						/>
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Recent Transactions</h3>
							{isLoadingTransactions ? (
								<div className="space-y-3">
									{[...Array(5)].map((_, index) => (
										<TransactionSkeleton key={index} />
									))}
								</div>
							) : transactions.length === 0 ? (
								<p className="text-gray-500">No transactions available.</p>
							) : (
								<>
									<div className="space-y-3">
										{transactions.map((transaction) => (
											<TransactionCard key={transaction._id} transaction={transaction} />
										))}
									</div>
									<PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
								</>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

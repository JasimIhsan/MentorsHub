import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IWalletTransaction } from "@/pages/user/WalletPage";
import { formatDate } from "@/utility/time-data-formatter";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { TransactionSkeleton } from "./skeleton/TransactionSkeleton";

// Component for rendering the transaction list
export function TransactionList({ transactions, isLoading, currentPage, totalPages, onPageChange }: { transactions: IWalletTransaction[]; isLoading: boolean; currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
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

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Recent Transactions</h3>
			{isLoading ? (
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
												{/* {!["wallet_topup", "refund", "withdrawal"].includes(transaction.purpose) && (
													<p className="text-sm text-gray-500">{transaction.toUserId ? `To: ${transaction.toUserId.name}` : transaction.fromUserId ? `From: ${transaction.fromUserId.name}` : ""} </p>
												)} */}
												<p className="text-sm text-gray-500">{formatDate(String(transaction.createdAt))}</p>
											</div>
										</div>
										<div className="flex flex-row-reverse justify-between items-center w-full sm:w-auto sm:flex-col sm:items-end sm:space-y-1 sm:space-x-0 space-x-reverse space-x-2">
											<p className={`font-semibold ${transaction.type === "credit" ? "text-green-600" : transaction.type === "withdrawal" ? "text-orange-600" : "text-red-600"}`}>
												{transaction.type === "credit" ? "+" : "-"}₹
												{transaction.amount.toLocaleString("en-IN", {
													minimumFractionDigits: 2,
												})}
											</p>

											<div className="flex items-center">
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
					<div className="flex justify-between items-center mt-4">
						<Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} variant="outline" className="text-sm border-gray-300 hover:bg-gray-100">
							Previous
						</Button>
						<p className="text-sm text-gray-600">
							Page {currentPage} of {totalPages}
						</p>
						<Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="outline" className="text-sm border-gray-300 hover:bg-gray-100">
							Next
						</Button>
					</div>
				</>
			)}
		</div>
	);
}

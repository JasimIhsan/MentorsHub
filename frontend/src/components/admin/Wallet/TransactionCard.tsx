import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatDate } from "@/utility/time-data-formatter";
import { IWalletTransaction } from "@/interfaces/transaction.interface";

interface TransactionCardProps {
	transaction: IWalletTransaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
	// Get status badge classes
	const getStatusBadge = (type: string) => {
		const variants = {
			credit: "bg-green-100 text-green-800 border-green-200",
			debit: "bg-red-100 text-red-800 border-red-200",
		};
		return variants[type as keyof typeof variants] || "bg-gray-100 text-gray-800";
	};

	// Get purpose label
	const getPurposeLabel = (purpose: string) => {
		const labels = {
			session_fee: "Session Fee",
			platform_fee: "Platform Fee",
			refund: "Refund",
			withdrawal: "Withdrawal",
			wallet_topup: "Wallet Topup",
			platform_commission: "Platform Commission",
		};
		return labels[purpose as keyof typeof labels] || purpose;
	};

	return (
		<Card className="border border-gray-200 hover:shadow-md transition-shadow py-1">
			<CardContent className="p-4">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="flex items-center space-x-4">
						<div className={`p-2 rounded-full ${transaction.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
							{transaction.type === "credit" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
						</div>
						<div>
							<p className="font-medium text-gray-900">{getPurposeLabel(transaction.purpose)}</p>
							<p className="text-sm text-gray-500">{transaction.description || "No description"}</p>
							{transaction.fromUserId && transaction.purpose !== "withdrawal" && transaction.purpose !== "wallet_topup" && transaction.purpose !== "refund" && <p className="text-sm text-gray-500">From: {transaction.fromUserId.name}</p>}
							<p className="text-sm text-gray-500">{formatDate(String(transaction.createdAt))}</p>
						</div>
					</div>
					<div className="flex flex-col items-end space-y-1">
						<p className={`font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
							{transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
						</p>
						<Badge variant="outline" className={`text-xs ${getStatusBadge(transaction.type)}`}>
							{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

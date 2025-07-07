import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { WalletBalanceSkeleton } from "./skeleton/WalletBalanceSkeleton";

// Card for displaying wallet balance and actions
export function WalletBalanceCard({ balance, isLoading }: { balance: number | null; isLoading: boolean }) {
	return isLoading ? (
		<WalletBalanceSkeleton />
	) : (
		<Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl lg:col-span-2">
			<CardContent className="p-6 sm:p-8">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div>
						<p className="text-blue-100 text-sm font-medium mb-2">Current Balance</p>
						<p className="text-4xl sm:text-5xl font-bold">{balance !== null ? `₹${balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "Loading..."}</p>
					</div>
					<div className="bg-white/20 p-4 rounded-full">
						<Wallet className="h-8 w-8" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

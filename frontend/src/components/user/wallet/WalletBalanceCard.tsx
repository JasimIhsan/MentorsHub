import { Card, CardContent } from "@/components/ui/card";
import { Wallet, PlusCircle } from "lucide-react";
import { WalletBalanceSkeleton } from "./skeleton/WalletBalanceSkeleton";
import { Button } from "@/components/ui/button";

// Interface for WalletBalanceCard props
interface WalletBalanceCardProps {
	balance: number | null;
	isLoading: boolean;
	isWalletExists: boolean;
	handleCreateWallet: () => void; // Add handleCreateWallet prop
}

// Card for displaying wallet balance and actions
export function WalletBalanceCard({ balance, isLoading, isWalletExists, handleCreateWallet }: WalletBalanceCardProps) {
	return isLoading ? (
		<WalletBalanceSkeleton />
	) : (
		<Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl lg:col-span-2">
			<CardContent className="p-6 sm:p-8">
				{!isWalletExists ? (
					<div className="flex flex-col items-start gap-4">
						<div className="flex items-center gap-3">
							<PlusCircle className="h-6 w-6 text-blue-200" />
							<p className="text-blue-100 text-lg font-semibold">No Wallet Found</p>
						</div>
						<p className="text-blue-200 text-sm">Create a wallet to start managing your funds securely.</p>
						<Button
							onClick={handleCreateWallet} // Attach handleCreateWallet to button
							className="bg-white text-blue-700 hover:bg-blue-100">
							Create Wallet Now
						</Button>
					</div>
				) : (
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div>
							<p className="text-blue-100 text-sm font-medium mb-2">Current Balance</p>
							<p className="text-4xl sm:text-5xl font-bold">{balance !== null ? `₹${balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "Loading..."}</p>
						</div>
						<div className="bg-white/20 p-4 rounded-full">
							<Wallet className="h-8 w-8" />
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

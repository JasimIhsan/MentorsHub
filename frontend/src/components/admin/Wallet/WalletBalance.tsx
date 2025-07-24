import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletBalanceProps {
	walletBalance: number | null;
	setIsWithdrawModalOpen: (open: boolean) => void;
}

export function WalletBalance({ walletBalance, setIsWithdrawModalOpen }: WalletBalanceProps) {
	return (
		<Card className="bg-gradient-to-br text-white from-blue-600 to-blue-700 shadow-xl rounded-2xl overflow-hidden">
			<CardContent className="p-6 sm:p-8">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
					<div className="flex items-center gap-4">
						<div className="bg-white/20 p-4 rounded-full">
							<Wallet className="h-8 w-8" />
						</div>
						<div>
							<p className="text-blue-100 font-medium">Platform Balance</p>
							<p className="text-4xl font-extrabold text-white-800">{walletBalance !== null ? `₹${walletBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "Loading..."}</p>
						</div>
					</div>
					<Button onClick={() => setIsWithdrawModalOpen(true)} variant="outline" className="text-primary font-bold px-6 py-3">
						Withdraw
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

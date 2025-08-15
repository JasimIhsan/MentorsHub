import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface AddMoneyModalProps {
	walletBalance: number;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	amount: string;
	setAmount: (value: string) => void;
	onWithdraw: () => void;
	isRazorpayLoaded: boolean;
	x: { set: (value: number) => void };
}

// Modal for withdrawing money from wallet
export function WithdrawMoneyModal({ walletBalance, isOpen, onOpenChange, amount, setAmount, onWithdraw, isRazorpayLoaded, x }: AddMoneyModalProps) {
	const isInDebt = walletBalance < 0;
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Withdraw Money</DialogTitle>
					<DialogDescription>Enter the amount you want to withdraw from your wallet.</DialogDescription>
				</DialogHeader>
				<div className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="withdraw-amount">Amount (₹)</Label>
						<Input id="withdraw-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" min="1" className="border-gray-300 focus:ring-blue-500" />
					</div>

					{!isInDebt && <div className="text-blue-600 bg-blue-50 rounded-lg p-4 text-sm">Once you submit a withdrawal request, our team will review and approve it within 24 hours. The amount will then be transferred to your bank account.</div>}
					{isInDebt && <div className="text-red-500 bg-red-50 rounded-lg p-4 text-sm">You are in debt. Please add money to your wallet before withdrawing.</div>}
				</div>

				<DialogFooter>
					<Button onClick={onWithdraw} disabled={!isRazorpayLoaded || !amount || parseFloat(amount) <= 0 || isInDebt}>
						Withdraw
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							onOpenChange(false);
							setAmount("");
							x.set(0);
						}}
						className="border-gray-300 hover:bg-gray-100">
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

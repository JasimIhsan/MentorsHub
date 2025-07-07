import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";

export interface AddMoneyModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	amount: string;
	setAmount: (value: string) => void;
	onWithdraw: () => void;
	isRazorpayLoaded: boolean;
	x: { set: (value: number) => void };
}

// Modal for withdrawing money from wallet
export function WithdrawMoneyModal({ isOpen, onOpenChange, amount, setAmount, onWithdraw, isRazorpayLoaded, x }: AddMoneyModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Withdraw Money</DialogTitle>
				</DialogHeader>
				<div className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="withdraw-amount">Amount (₹)</Label>
						<Input id="withdraw-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" min="1" className="border-gray-300 focus:ring-blue-500" />
					</div>
				</div>
				<DialogFooter>
					<Button onClick={onWithdraw} disabled={!isRazorpayLoaded || !amount || parseFloat(amount) <= 0}>
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

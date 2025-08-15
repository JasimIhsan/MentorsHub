// Withdrawal dialog component
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface WithdrawModalProps {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	withdrawAmount: string;
	setWithdrawAmount: (amount: string) => void;
	handleWithdraw: () => void;
}

export function WithdrawModal({ isOpen, setIsOpen, withdrawAmount, setWithdrawAmount, handleWithdraw }: WithdrawModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Withdraw Money from Platform Wallet</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="amount">Amount (₹)</Label>
						<Input id="amount" type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Enter amount" min="1" />
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => {
							setIsOpen(false);
							setWithdrawAmount("");
						}}>
						Cancel
					</Button>
					<Button onClick={handleWithdraw} disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}>
						Confirm Withdrawal
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

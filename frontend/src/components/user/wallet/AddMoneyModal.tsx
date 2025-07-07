import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";

interface AddMoneyModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	amount: string;
	setAmount: (value: string) => void;
	onAddMoney: () => void;
	isRazorpayLoaded: boolean;
}

// Modal for adding money to wallet
export function AddMoneyModal({ isOpen, onOpenChange, amount, setAmount, onAddMoney, isRazorpayLoaded }: AddMoneyModalProps		) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Money to Wallet</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="amount">Amount (₹)</Label>
						<Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" min="1" />
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={onAddMoney} disabled={!isRazorpayLoaded || !amount || parseFloat(amount) <= 0}>
						Proceed to Payment
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

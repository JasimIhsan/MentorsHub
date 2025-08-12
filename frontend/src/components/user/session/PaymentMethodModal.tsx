import { useState, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import axiosInstance from "@/api/config/api.config";
import { toast } from "sonner";
import { ISessionUserDTO } from "@/interfaces/session.interface";
import { createRazorpayOrderAPI } from "@/api/session.api.service";
import { SessionPaymentStatusEnum, SessionStatusEnum } from "@/interfaces/enums/session.status.enum";

interface PaymentMethodModalProps {
	isOpen: boolean;
	onClose: () => void;
	session: ISessionUserDTO;
	walletBalance: number;
	isRazorpayLoaded: boolean;
	setShowPaymentModal: Dispatch<SetStateAction<boolean>>;
	setPaidSession: Dispatch<SetStateAction<ISessionUserDTO | null>>;
	userId: string;
}

export function PaymentMethodModal({ isOpen, onClose, session, walletBalance, isRazorpayLoaded, setShowPaymentModal, setPaidSession, userId }: PaymentMethodModalProps) {
	const [isPaying, setIsPaying] = useState(false);

	// Handle wallet payment
	const handleWalletPayment = async () => {
		if (!session.totalAmount || walletBalance < session.totalAmount) {
			toast.error("Insufficient wallet balance.");
			return;
		}
		setIsPaying(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const response = await axiosInstance.post("/user/sessions/pay/wallet", {
				sessionId: session.id,
				userId: userId,
				paymentStatus: SessionPaymentStatusEnum.COMPLETED,
				status: SessionStatusEnum.UPCOMING,
			});
			if (response.data.success) {
				setPaidSession({ ...session, status: SessionStatusEnum.UPCOMING });
				setShowPaymentModal(true);
				toast.success("Payment successful using wallet!");
				onClose();
			} else {
				toast.error(response.data?.message || "Wallet payment failed.");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to process payment.");
		} finally {
			setIsPaying(false);
		}
	};

	// Handle gateway payment
	const handleGatewayPayment = async () => {
		if (!isRazorpayLoaded || !window.Razorpay) {
			toast.error("Payment gateway not loaded.");
			return;
		}
		setIsPaying(true);
		let order;
		try {
			order = await createRazorpayOrderAPI(session.id, userId);
			if (!order || !order.id || !order.amount) {
				throw new Error("Invalid order details.");
			}
		} catch (error: any) {
			toast.error(error.message || "Failed to create order.");
			setIsPaying(false);
			return;
		}
		try {
			const options = {
				key: import.meta.env.VITE_RAZORPAY_KEY,
				amount: order.amount,
				currency: "INR",
				name: "Mentor Session Payment",
				description: `Payment for session with ${session.mentor.firstName} ${session.mentor.lastName}`,
				order_id: order.id,
				handler: async function (response: any) {
					try {
						const paymentResponse = await axiosInstance.post("/user/sessions/pay/gateway", {
							sessionId: session.id,
							userId: userId,
							paymentId: response.razorpay_payment_id,
							orderId: response.razorpay_order_id,
							signature: response.razorpay_signature,
							paymentStatus: SessionPaymentStatusEnum.COMPLETED,
							status: SessionStatusEnum.UPCOMING,
						});
						if (paymentResponse.data.success) {
							setPaidSession({ ...session, status: SessionStatusEnum.UPCOMING });
							setShowPaymentModal(true);
							toast.success("Payment successful!");
							onClose();
						} else {
							toast.error(paymentResponse.data?.message || "Payment failed.");
						}
					} catch (error: any) {
						toast.error(error.response?.data?.message || "Failed to process payment.");
					}
					setIsPaying(false);
				},
				prefill: {
					name: `${session.mentor.firstName} ${session.mentor.lastName}`,
				},
				theme: {
					color: "#112d4e",
				},
				notes: {
					sessionId: session.id,
				},
				modal: {
					ondismiss: () => {
						setIsPaying(false);
						toast.info("Payment cancelled.");
					},
				},
			};
			const rzp = new window.Razorpay(options);
			rzp.on("payment.failed", (response: any) => {
				toast.error(`Payment failed: ${response.error?.description || "Unknown error"}.`);
				setIsPaying(false);
			});
			rzp.open();
		} catch (error: any) {
			toast.error(error.message || "Failed to initiate payment.");
			setIsPaying(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Select Payment Method</DialogTitle>
					<DialogDescription>
						Pay for your session with {session.mentor.firstName} {session.mentor.lastName} amounting to ₹{session.totalAmount || "N/A"}.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="flex items-center justify-between p-4 border rounded-lg">
						<div className="flex items-center gap-2">
							<Wallet className="h-5 w-5 text-primary" />
							<div>
								<p className="font-medium">Wallet Payment</p>
								<p className="text-sm text-muted-foreground">Available Balance: ₹{walletBalance}</p>
							</div>
						</div>
						<Button onClick={handleWalletPayment} disabled={isPaying || !session.totalAmount || walletBalance < session.totalAmount}>
							{isPaying ? "Processing..." : "Pay with Wallet"}
						</Button>
					</div>
					<div className="flex items-center justify-between p-4 border rounded-lg">
						<div className="flex items-center gap-2">
							<CreditCard className="h-5 w-5 text-primary" />
							<div>
								<p className="font-medium">Online Payment</p>
								<p className="text-sm text-muted-foreground">Pay with card, UPI, or net banking</p>
							</div>
						</div>
						<Button onClick={handleGatewayPayment} disabled={isPaying || !isRazorpayLoaded}>
							{isPaying ? "Processing..." : "Pay Online"}
						</Button>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isPaying}>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

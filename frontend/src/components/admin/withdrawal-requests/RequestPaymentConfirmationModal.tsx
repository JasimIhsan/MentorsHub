import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, User, Calendar, AlertCircle, IndianRupeeIcon } from "lucide-react";
import { IWithdrawalRequestDTO } from "@/interfaces/withdrawal.types";
import { formatDate } from "@/utility/time-data-formatter";
import { toast } from "sonner";
import { approveWithdrawalRequestAdminAPI, withdrawPaymentCreateOrderAdminAPI } from "@/api/withdrawal.api.service";

interface RequestPaymentConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	request: IWithdrawalRequestDTO | null;
	onPaymentSuccess: (requestId: string, transactionId: string) => void;
}

export function RequestPaymentConfirmationModal({ isOpen, onClose, request, onPaymentSuccess }: RequestPaymentConfirmationModalProps) {
	const [isProcessing, setIsProcessing] = useState(false);
	const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

	// Load Razorpay script dynamically
	useEffect(() => {
		let script: HTMLScriptElement | null = null;
		const loadRazorpayScript = () => {
			if (window.Razorpay) {
				setIsRazorpayLoaded(true);
				return;
			}
			script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.async = true;
			script.onload = () => setIsRazorpayLoaded(true);
			script.onerror = () => {
				toast.error("Failed to load payment gateway.");
				setIsRazorpayLoaded(false);
			};
			document.body.appendChild(script);
		};
		loadRazorpayScript();
		return () => {
			if (script && document.body.contains(script)) {
				document.body.removeChild(script);
			}
		};
	}, []);

	const handlePayment = async () => {
		if (!request || !isRazorpayLoaded) {
			toast.error("Payment gateway not loaded or request is invalid.");
			return;
		}

		setIsProcessing(true);

		try {
			// Step 1: Call your backend to create a Razorpay order
			const response = await withdrawPaymentCreateOrderAdminAPI(request.id);

			if (!response.success) {
				throw new Error("Failed to create order");
			}

			// Step 2: Configure Razorpay checkout options
			const options = {
				key: import.meta.env.VITE_RAZORPAY_KEY, // Your Razorpay Key ID from .env
				amount: response.amount, // Amount in paise
				currency: "INR",
				order_id: response.order.id, // Order ID from backend
				name: "MentorsHub	",
				description: `Withdrawal payment for request #${request.id}`,
				handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
					// Step 3: Verify payment on your backend
					try {
						const res = await approveWithdrawalRequestAdminAPI(request.id, response.razorpay_payment_id);

						if (res.success && res.request) {
							onPaymentSuccess(request.id || "", response.razorpay_payment_id);
							toast.success("Payment processed successfully!");
							onClose();
						} else {
							throw new Error("Payment verification failed");
						}
					} catch (error) {
						toast.error("Payment verification failed. Please contact support.");
					}
				},
				prefill: {
					name: `${request.user?.firstName} ${request.user?.lastName}`,
				},
				theme: {
					color: "#112d4e", // Tailwind blue-600
				},
				modal: {
					ondismiss: () => {
						setIsProcessing(false);
						toast.info("Payment cancelled by user.");
					},
				},
			};

			// Step 4: Initialize and open Razorpay checkout
			const razorpay = new window.Razorpay(options);
			razorpay.open();

			// Handle Razorpay errors
			razorpay.on("payment.failed", () => {
				toast.error("Payment failed. Please try again.");
				setIsProcessing(false);
			});
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
			setIsProcessing(false);
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
		}).format(amount);
	};

	if (!request) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<CreditCard className="w-5 h-5" />
						Process Payment
					</DialogTitle>
					<DialogDescription>Review and process the withdrawal request payment via Razorpay</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Request Details */}
					<div className="bg-gray-50 p-4 rounded-lg space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-gray-600 flex items-center gap-1">
								<User className="w-3 h-3" />
								User
							</span>
							<span className="text-sm">
								{request.user?.firstName} {request.user?.lastName}
							</span>
						</div>

						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-gray-600 flex items-center gap-1">
								<Calendar className="w-3 h-3" />
								Created
							</span>
							<span className="text-sm">{formatDate(request.createdAt || "")}</span>
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-gray-600 flex items-center gap-1">
								<IndianRupeeIcon className="w-3 h-3" />
								Amount
							</span>
							<span className="text-lg font-bold text-green-600">{formatCurrency(request.amount)}</span>
						</div>
					</div>

					{/* Warning */}
					<div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
						<AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
						<div className="text-sm text-yellow-800">
							<p className="font-medium">Payment Confirmation</p>
							<p>This action will process the payment immediately via Razorpay. Please ensure all details are correct.</p>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isProcessing}>
						Cancel
					</Button>
					<Button onClick={handlePayment} disabled={isProcessing || !isRazorpayLoaded} className="bg-blue-600 hover:bg-blue-700">
						{isProcessing ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
								Processing...
							</>
						) : (
							<>
								<CreditCard className="w-4 h-4 mr-2" />
								Process Payment
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export interface IPaymentService {
	createPaymentOrder(amount: number, currency: string, sessionRequestId: string): Promise<{ id: string; amount: number; currency: string }>;
	verifyPayment(paymentId: string, signature: string): Promise<boolean>;
}

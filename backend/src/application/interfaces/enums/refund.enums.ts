export enum RefundStatusEnum {
	REQUESTED = "requested", // Manual request waiting for review
	APPROVED = "approved", // Approved by admin
	REJECTED = "rejected", // Rejected by admin
	PROCESSED = "processed", // Refund successfully completed
	FAILED = "failed", // Refund processing failed
}

// export enum RefundMethodEnum {
// 	WALLET = "wallet", // Refund to in-app wallet
// 	ORIGINAL_PAYMENT = "original_payment", // Refund to original payment method
// }

export enum RefundInitiatorEnum {
	SYSTEM = "system", // Auto refund (cancellation)
	USER = "user", // Manual refund request
	ADMIN = "admin", // Admin-initiated refund
}

export interface IWalletTransactionDTO {
	_id: string;
	fromUserId: {
		id: string;
		name: string;
		avatar: string;
	} | null;
	toUserId: {
		id: string;
		name: string;
		avatar: string;
	} | null;
	fromRole: "user" | "mentor" | "admin";
	toRole: "user" | "mentor" | "admin";
	amount: number;
	type: "credit" | "debit" | "withdrawal";
	purpose: "session_fee" | "platform_fee" | "refund" | "withdrawal";
	description?: string;
	sessionId?: {
		id: string;
		topic: string;
	} | null;
	createdAt: Date;
}

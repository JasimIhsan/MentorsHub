export interface IWalletTransaction {
	_id: string;
	fromUserId: {
		id: string;
		name: string;
		avatar: string;
	};
	toUserId: {
		id: string;
		name: string;
		avatar: string;
	};
	fromRole: "user" | "mentor" | "admin";
	toRole: "user" | "mentor" | "admin";
	amount: number;
	type: "credit" | "debit";
	purpose: "session_fee" | "platform_fee" | "refund" | "withdrawal" | "wallet_topup" | "platform_commission";
	description?: string;
	sessionId?: {
		id: string;
		topic: string;
	} | null;
	createdAt: Date;
}

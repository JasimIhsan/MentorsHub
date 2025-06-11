import { ObjectId } from "mongoose";
import { IWalletTransactionDocument } from "../../infrastructure/database/models/wallet/wallet.transaction.model";

// Extend your purpose type to include wallet_topup
export type WalletTransactionPurpose = "session_fee" | "platform_fee" | "refund" | "withdrawal" | "wallet_topup";

export interface IWalletTransaction {
	_id?: ObjectId;
	fromUserId: ObjectId | null;
	toUserId: ObjectId;
	fromRole: "user" | "mentor" | "admin";
	toRole: "user" | "mentor" | "admin";
	amount: number;
	type: "credit" | "debit";
	purpose: WalletTransactionPurpose;
	description?: string;
	sessionId?: ObjectId | null;
	createdAt?: Date;
	updatedAt?: Date;
}

export class WalletTransactionEntity {
	private _id?: ObjectId;
	private fromUserId: ObjectId | null;
	private toUserId: ObjectId;
	private fromRole: "user" | "mentor" | "admin";
	private toRole: "user" | "mentor" | "admin";
	private amount: number;
	private type: "credit" | "debit";
	private purpose: WalletTransactionPurpose;
	private description?: string;
	private sessionId?: ObjectId | null;
	private createdAt?: Date;
	private updatedAt?: Date;

	private constructor(props: IWalletTransaction) {
		this._id = props._id;
		this.fromUserId = props.fromUserId;
		this.toUserId = props.toUserId;
		this.fromRole = props.fromRole;
		this.toRole = props.toRole;
		this.amount = props.amount;
		this.type = props.type;
		this.purpose = props.purpose;
		this.description = props.description;
		this.sessionId = props.sessionId;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
	}

	// ✅ Safe creation
	static create(data: {
		fromUserId?: ObjectId | null;
		toUserId: ObjectId;
		fromRole: "user" | "mentor" | "admin";
		toRole: "user" | "mentor" | "admin";
		amount: number;
		type: "credit" | "debit";
		purpose: WalletTransactionPurpose;
		description?: string;
		sessionId?: ObjectId | null;
	}): WalletTransactionEntity {
		return new WalletTransactionEntity({
			fromUserId: data.fromUserId ?? null,
			toUserId: data.toUserId,
			fromRole: data.fromRole,
			toRole: data.toRole,
			amount: data.amount,
			type: data.type,
			purpose: data.purpose,
			description: data.description,
			sessionId: data.sessionId ?? null,
		});
	}

	// ✅ To plain object (e.g., for repo.save())
	toObject(): IWalletTransaction {
		return {
			_id: this._id,
			fromUserId: this.fromUserId,
			toUserId: this.toUserId,
			fromRole: this.fromRole,
			toRole: this.toRole,
			amount: this.amount,
			type: this.type,
			purpose: this.purpose,
			description: this.description,
			sessionId: this.sessionId,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}

	// ✅ From DB to domain entity
	static fromDBDocument(doc: IWalletTransactionDocument): WalletTransactionEntity {
		return new WalletTransactionEntity({
			_id: doc._id,
			fromUserId: doc.fromUserId ?? null,
			toUserId: doc.toUserId,
			fromRole: doc.fromRole,
			toRole: doc.toRole,
			amount: doc.amount,
			type: doc.type,
			purpose: doc.purpose as WalletTransactionPurpose,
			description: doc.description,
			sessionId: doc.sessionId ?? null,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}

	// (Optional) You can add safe getters if needed
	getToUserId(): ObjectId {
		return this.toUserId;
	}

	getAmount(): number {
		return this.amount;
	}

	getPurpose(): WalletTransactionPurpose {
		return this.purpose;
	}
}

// domain/entities/wallet-transaction.entity.ts

import { ObjectId } from "mongoose";
import { IWalletTransactionDocument } from "../../infrastructure/database/models/wallet/wallet.transaction.model";

export class WalletTransactionEntity {
	private _id?: ObjectId;
	private fromUserId: ObjectId;
	private toUserId: ObjectId;
	private fromRole: string;
	private toRole: string;
	private amount: number;
	private type: string;
	private sessionId?: ObjectId;
	private createdAt?: Date;

	constructor(props: { _id?: ObjectId; fromUserId: ObjectId; toUserId: ObjectId; fromRole: string; toRole: string; amount: number; type: string; sessionId?: ObjectId; createdAt?: Date }) {
		this._id = props._id;
		this.fromUserId = props.fromUserId;
		this.toUserId = props.toUserId;
		this.fromRole = props.fromRole;
		this.toRole = props.toRole;
		this.amount = props.amount;
		this.type = props.type;
		this.sessionId = props.sessionId;
		this.createdAt = props.createdAt;
	}

	toObject() {
		return {
			_id: this._id,
			fromUserId: this.fromUserId,
			toUserId: this.toUserId,
			fromRole: this.fromRole,
			toRole: this.toRole,
			amount: this.amount,
			type: this.type,
			sessionId: this.sessionId,
			createdAt: this.createdAt,
		};
	}

	static fromDBDocument(doc: IWalletTransactionDocument): WalletTransactionEntity {
		return new WalletTransactionEntity({
			_id: doc._id,
			fromUserId: doc.fromUserId,
			toUserId: doc.toUserId,
			fromRole: doc.fromRole,
			toRole: doc.toRole,
			amount: doc.amount,
			type: doc.type,
			sessionId: doc.sessionId,
			createdAt: doc.createdAt,
		});
	}
}

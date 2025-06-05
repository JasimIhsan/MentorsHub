// domain/entities/wallet.entity.ts

import { ObjectId } from "mongoose";
import { IWalletDocument } from "../../infrastructure/database/models/wallet/wallet.model";

export class WalletEntity {
	private _id?: ObjectId;
	private userId: ObjectId;
	private role: string;
	private balance: number;
	private createdAt?: Date;
	private updatedAt?: Date;

	constructor(props: { _id?: ObjectId; userId: ObjectId; role: string; balance: number;  createdAt?: Date; updatedAt?: Date }) {
		this._id = props._id;
		this.userId = props.userId;
		this.role = props.role;
		this.balance = props.balance;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
	}

	getId() {
		return this._id;
	}

	getUserId() {
		return this.userId;
	}

	getRole() {
		return this.role;
	}

	getBalance() {
		return this.balance;
	}

	getCurrency() {
	}

	credit(amount: number) {
		this.balance += amount;
	}

	debit(amount: number) {
		if (amount > this.balance) throw new Error("Insufficient balance");
		this.balance -= amount;
	}

	toObject() {
		return {
			_id: this._id,
			userId: this.userId,
			role: this.role,
			balance: this.balance,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}

	static fromDBDocument(doc: IWalletDocument): WalletEntity {
		return new WalletEntity({
			_id: doc._id,
			userId: doc.userId,
			role: doc.role,
			balance: doc.balance,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}

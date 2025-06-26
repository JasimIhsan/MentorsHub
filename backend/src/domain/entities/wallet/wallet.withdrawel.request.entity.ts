import { ObjectId } from "mongoose";
import { IWithdrawalRequestDocument } from "../../../infrastructure/database/models/wallet/wallet.withdrawel.request.model";

export class WithdrawalRequestEntity {
	private _id?: ObjectId;
	private mentorId: ObjectId;
	private amount: number;
	private status: "pending" | "approved" | "rejected" | "completed";
	private createdAt?: Date;
	private updatedAt?: Date;

	constructor(props: { _id?: ObjectId; mentorId: ObjectId; amount: number; status?: "pending" | "approved" | "rejected" | "completed"; createdAt?: Date; updatedAt?: Date }) {
		this._id = props._id;
		this.mentorId = props.mentorId;
		this.amount = props.amount;
		this.status = props.status || "pending";
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
	}

	approve() {
		this.status = "approved";
	}

	reject() {
		this.status = "rejected";
	}

	toObject() {
		return {
			_id: this._id,
			mentorId: this.mentorId,
			amount: this.amount,
			status: this.status,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}

	static fromDBDocument(doc: IWithdrawalRequestDocument): WithdrawalRequestEntity {
		return new WithdrawalRequestEntity({
			_id: doc._id,
			mentorId: doc.mentorId,
			amount: doc.amount,
			status: doc.status,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}

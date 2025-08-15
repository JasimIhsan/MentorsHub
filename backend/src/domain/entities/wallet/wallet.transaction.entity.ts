// domain/entities/wallet.transaction.entity.ts

import { RoleEnum } from "../../../application/interfaces/enums/role.enum";
import { TransactionPurposeEnum } from "../../../application/interfaces/enums/transaction.purpose.enum";
import { TransactionsTypeEnum } from "../../../application/interfaces/enums/transaction.type.enum";
import { IWalletTransactionDocument } from "../../../infrastructure/database/models/wallet/wallet.transaction.model";



export class WalletTransactionEntity {
	private _id?: string;
	private _fromUserId: string | null;
	private _toUserId: string;
	private _fromRole: RoleEnum;
	private _toRole: RoleEnum;
	private _amount: number;
	private _type: TransactionsTypeEnum;
	private _purpose: TransactionPurposeEnum;
	private _description?: string;
	private _sessionId?: string | null;
	private _createdAt?: Date;
	private _updatedAt?: Date;

	private constructor(props: {
		_id?: string;
		fromUserId: string | null;
		toUserId: string;
		fromRole: RoleEnum;
		toRole: RoleEnum;
		amount: number;
		type: TransactionsTypeEnum;
		purpose: TransactionPurposeEnum;
		description?: string;
		sessionId?: string | null;
		createdAt?: Date;
		updatedAt?: Date;
	}) {
		this._id = props._id;
		this._fromUserId = props.fromUserId;
		this._toUserId = props.toUserId;
		this._fromRole = props.fromRole;
		this._toRole = props.toRole;
		this._amount = props.amount;
		this._type = props.type;
		this._purpose = props.purpose;
		this._description = props.description;
		this._sessionId = props.sessionId;
		this._createdAt = props.createdAt;
		this._updatedAt = props.updatedAt;
	}

	// ✅ Factory method (clean)
	static create(data: {
		fromUserId?: string | null;
		toUserId: string;
		fromRole: RoleEnum;
		toRole: RoleEnum;
		amount: number;
		type: TransactionsTypeEnum;
		purpose: TransactionPurposeEnum;
		description?: string;
		sessionId?: string | null;
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

	// ✅ Getters
	get id(): string | undefined {
		return this._id;
	}

	get fromUserId(): string | null {
		return this._fromUserId;
	}

	get toUserId(): string {
		return this._toUserId;
	}

	get fromRoleEnum(): RoleEnum {
		return this._fromRole;
	}

	get toRoleEnum(): RoleEnum {
		return this._toRole;
	}

	get transactionAmount(): number {
		return this._amount;
	}

	get transactionType(): TransactionsTypeEnum {
		return this._type;
	}

	get transactionPurpose(): TransactionPurposeEnum {
		return this._purpose;
	}

	get transactionDescription(): string | undefined {
		return this._description;
	}

	get sessionId(): string | null | undefined {
		return this._sessionId;
	}

	get created(): Date | undefined {
		return this._createdAt;
	}

	get updated(): Date | undefined {
		return this._updatedAt;
	}

	// ✅ For repository to save or serialize
	toObject() {
		return {
			_id: this._id,
			fromUserId: this._fromUserId,
			toUserId: this._toUserId,
			fromRole: this._fromRole,
			toRole: this._toRole,
			amount: this._amount,
			type: this._type,
			purpose: this._purpose,
			description: this._description,
			sessionId: this._sessionId,
			createdAt: this._createdAt,
			updatedAt: this._updatedAt,
		};
	}

	static fromDBDocument(doc: IWalletTransactionDocument): WalletTransactionEntity {
		return new WalletTransactionEntity({
			_id: doc._id?.toString(),
			fromUserId: doc.fromUserId?.toString() || null,
			toUserId: doc.toUserId?.toString(),
			fromRole: doc.fromRole,
			toRole: doc.toRole,
			amount: doc.amount,
			type: doc.type,
			purpose: doc.purpose,
			description: doc.description,
			sessionId: doc.sessionId?.toString() || null,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}

import { WithdrawalRequestStatusEnum } from "../../../application/interfaces/enums/withdrawel.request.status.enum";
import { IWithdrawalRequestDocument } from "../../../infrastructure/database/models/wallet/wallet.withdrawel.request.model";
import { PersonEntity } from "../session.entity";

export type WithdrawalRequestEntityProps = {
	id?: string;
	userId: string;
	amount: number;
	status: WithdrawalRequestStatusEnum;
	transactionId?: string;
	processedAt?: Date;
	createdAt?: Date;
	updatedAt?: Date;
};

export class WithdrawalRequestEntity {
	constructor(private props: WithdrawalRequestEntityProps) {}

	// Getters
	get id(): string | undefined {
		return this.props.id;
	}
	get userId(): string {
		return this.props.userId;
	}
	get amount(): number {
		return this.props.amount;
	}
	get status(): WithdrawalRequestStatusEnum {
		return this.props.status;
	}
	get processedDate(): Date | undefined {
		return this.props.processedAt;
	}
	get transactionId(): string | undefined {
		return this.props.transactionId;
	}
	get createdAt(): Date | undefined {
		return this.props.createdAt;
	}
	get updatedAt(): Date | undefined {
		return this.props.updatedAt;
	}

	// Domain actions with state checks
	reject(): void {
		if (this.props.status !== WithdrawalRequestStatusEnum.PENDING) {
			throw new Error("Only pending requests can be rejected.");
		}
		this.props.status = WithdrawalRequestStatusEnum.REJECTED;
		this.props.processedAt = new Date();
	}

	complete(transactionId: string): void {
		if (this.props.status !== WithdrawalRequestStatusEnum.PENDING) {
			throw new Error("Only pending requests can be completed.");
		}
		this.props.status = WithdrawalRequestStatusEnum.COMPLETED;
		this.props.transactionId = transactionId;
		this.props.processedAt = new Date();
	}

	// For saving/serialization
	toObject() {
		return {
			_id: this.props.id,
			userId: this.props.userId, // store just id in DB
			amount: this.props.amount,
			status: this.props.status,
			transactionId: this.props.transactionId,
			processedAt: this.props.processedAt,
			createdAt: this.props.createdAt,
			updatedAt: this.props.updatedAt,
		};
	}

	// Factory method to build entity from DB doc
	static fromDBDocument(doc: IWithdrawalRequestDocument): WithdrawalRequestEntity {
		return new WithdrawalRequestEntity({
			id: doc._id?.toString(),
			userId: doc.userId.toString(),
			amount: doc.amount,
			status: doc.status,
			transactionId: doc.transactionId?.toString(),
			processedAt: doc.processedAt,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}

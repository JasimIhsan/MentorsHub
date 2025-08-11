import { RefundInitiatorEnum, RefundMethodEnum, RefundStatusEnum } from "../../application/interfaces/enums/refund.enums";
import { IRefundDocument } from "../../infrastructure/database/models/refund/refund.model";

export interface IRefundEntityProps {
	id?: string;
	sessionId: string;
	paymentId: string;
	userId: string;
	initiatedBy: RefundInitiatorEnum;
	method: RefundMethodEnum;
	reason?: string;
	originalAmount: number;
	refundAmount: number;
	platformFeeRefunded: boolean;
	walletTransactionId?: string;
	status: RefundStatusEnum;
	processedAt?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

export class RefundEntity {
	private props: IRefundEntityProps;

	constructor(props: IRefundEntityProps) {
		// ===== Business validations =====
		if (props.refundAmount > props.originalAmount) {
			throw new Error("Refund amount cannot exceed original amount");
		}
		if (props.refundAmount <= 0) {
			throw new Error("Refund amount must be greater than zero");
		}

		this.props = {
			...props,
			createdAt: props.createdAt || new Date(),
			updatedAt: props.updatedAt || new Date(),
		};
	}

	// ===== GETTERS =====
	get id() {
		return this.props.id;
	}
	get sessionId() {
		return this.props.sessionId;
	}
	get paymentId() {
		return this.props.paymentId;
	}
	get userId() {
		return this.props.userId;
	}
	get initiatedBy() {
		return this.props.initiatedBy;
	}
	get method() {
		return this.props.method;
	}
	get reason() {
		return this.props.reason;
	}
	get originalAmount() {
		return this.props.originalAmount;
	}
	get refundAmount() {
		return this.props.refundAmount;
	}
	get platformFeeRefunded() {
		return this.props.platformFeeRefunded;
	}
	get walletTransactionId() {
		return this.props.walletTransactionId;
	}
	get status() {
		return this.props.status;
	}
	get processedAt() {
		return this.props.processedAt;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}

	// ===== SETTERS WITH BUSINESS LOGIC =====
	set refundAmount(amount: number) {
		if (amount <= 0) throw new Error("Refund amount must be greater than zero");
		if (amount > this.props.originalAmount) {
			throw new Error("Refund amount cannot exceed original amount");
		}
		this.props.refundAmount = amount;
		this.touch();
	}

	set reason(reason: string | undefined) {
		this.props.reason = reason;
		this.touch();
	}

	set status(newStatus: RefundStatusEnum) {
		// Prevent invalid status transitions
		if (this.props.status === RefundStatusEnum.PROCESSED && newStatus !== RefundStatusEnum.PROCESSED) {
			throw new Error("Cannot change status once refund is processed");
		}
		if (this.props.status === RefundStatusEnum.FAILED && newStatus === RefundStatusEnum.REQUESTED) {
			throw new Error("Cannot move from failed to requested");
		}

		this.props.status = newStatus;

		// Auto-set processedAt if processed
		if (newStatus === RefundStatusEnum.PROCESSED) {
			this.props.processedAt = new Date();
		}

		this.touch();
	}

	set method(method: RefundMethodEnum) {
		this.props.method = method;
		this.touch();
	}

	set walletTransactionId(txId: string | undefined) {
		this.props.walletTransactionId = txId;
		this.touch();
	}

	set platformFeeRefunded(refunded: boolean) {
		this.props.platformFeeRefunded = refunded;
		this.touch();
	}

	// ===== INTERNAL HELPERS =====
	private touch() {
		this.props.updatedAt = new Date();
	}

	// ===== FACTORY METHODS =====
	static createAutoRefund(props: Omit<IRefundEntityProps, "status" | "initiatedBy">): RefundEntity {
		return new RefundEntity({
			...props,
			status: RefundStatusEnum.PROCESSED, // Auto refunds are processed instantly
			initiatedBy: RefundInitiatorEnum.SYSTEM,
			processedAt: new Date(),
		});
	}

	static createManualRefundRequest(props: Omit<IRefundEntityProps, "status" | "initiatedBy">): RefundEntity {
		return new RefundEntity({
			...props,
			status: RefundStatusEnum.REQUESTED,
			initiatedBy: RefundInitiatorEnum.USER,
		});
	}

	static fromDBDocument(doc: IRefundDocument) {
		return new RefundEntity({
			id: doc._id.toString(),
			sessionId: doc.sessionId.toString(),
			paymentId: doc.paymentId,
			userId: doc.userId.toString(),
			initiatedBy: doc.initiatedBy,
			method: doc.method,
			reason: doc.reason,
			originalAmount: doc.originalAmount,
			refundAmount: doc.refundAmount,
			platformFeeRefunded: doc.platformFeeRefunded,
			walletTransactionId: doc.walletTransactionId?.toString(),
			status: doc.status,
			processedAt: doc.processedAt,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}

	static toObject(entity: RefundEntity) {
		return {
			id: entity.id,
			sessionId: entity.sessionId,
			paymentId: entity.paymentId,
			userId: entity.userId,
			initiatedBy: entity.initiatedBy,
			method: entity.method,
			reason: entity.reason,
			originalAmount: entity.originalAmount,
			refundAmount: entity.refundAmount,
			platformFeeRefunded: entity.platformFeeRefunded,
			walletTransactionId: entity.walletTransactionId,
			status: entity.status,
			processedAt: entity.processedAt,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}

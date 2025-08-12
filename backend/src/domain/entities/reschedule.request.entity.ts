import { RescheduleStatusEnum } from "../../application/interfaces/enums/reschedule.status.enum";
import { IRescheduleRequestDocument } from "../../infrastructure/database/models/session/reschedule.request.model";

// --- Proposal Interface ---
export interface IProposalProps {
	proposedDate: Date;
	proposedStartTime: string;
	proposedEndTime: string;
	message?: string;
}

// --- Domain Entity: Proposal (for future logic like time validation) ---
export class ProposalEntity {
	constructor(private props: IProposalProps) {}

	get proposedDate(): Date {
		return this.props.proposedDate;
	}

	get proposedStartTime(): string {
		return this.props.proposedStartTime;
	}

	get proposedEndTime(): string {
		return this.props.proposedEndTime;
	}

	get message(): string | undefined {
		return this.props.message;
	}

	toObject(): IProposalProps {
		return {
			proposedDate: this.proposedDate,
			proposedStartTime: this.proposedStartTime,
			proposedEndTime: this.proposedEndTime,
			message: this.message,
		};
	}
}

// --- Props for Main Entity ---
export interface IRescheduleRequestProps {
	id: string;
	sessionId: string;
	initiatedBy: string;
	oldProposal: ProposalEntity;
	currentProposal: ProposalEntity;
	counterProposal?: ProposalEntity;
	status: RescheduleStatusEnum;
	lastActionBy: string;
	createdAt: Date;
	updatedAt: Date;
}

// --- Main Domain Entity ---
export class RescheduleRequestEntity {
	constructor(private props: IRescheduleRequestProps) {}

	// --- Getters ---
	get id(): string {
		return this.props.id;
	}

	get sessionId(): string {
		return this.props.sessionId;
	}

	get initiatedBy(): string {
		return this.props.initiatedBy;
	}

	get oldProposal(): ProposalEntity {
		return this.props.oldProposal;
	}

	get currentProposal(): ProposalEntity {
		return this.props.currentProposal;
	}

	get counterProposal(): ProposalEntity | undefined {
		return this.props.counterProposal;
	}

	get status(): RescheduleStatusEnum {
		return this.props.status;
	}

	get lastActionBy(): string {
		return this.props.lastActionBy;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	// --- Business Logic ---
	acceptProposal(userId: string, isCounter: boolean = false) {
		if (this.status !== RescheduleStatusEnum.PENDING) {
			throw new Error("Cannot accept a non-pending proposal");
		}
		if (userId === this.initiatedBy && !isCounter) {
			throw new Error("Initiator cannot accept their own proposal");
		}
		this.props.status = RescheduleStatusEnum.ACCEPTED;
		this.props.lastActionBy = userId;
	}

	rejectProposal(userId: string, message?: string) {
		if (this.status !== RescheduleStatusEnum.PENDING) {
			throw new Error("Cannot reject a non-pending proposal");
		}
		if (userId === this.initiatedBy) {
			throw new Error("Initiator cannot reject their own proposal");
		}
		this.props.status = RescheduleStatusEnum.REJECTED;
		this.props.lastActionBy = userId;
	}

	proposeCounterProposal(userId: string, newProposal: IProposalProps) {
		if (this.status !== RescheduleStatusEnum.PENDING) {
			throw new Error("Cannot counter a non-pending proposal");
		}
		if (userId === this.props.lastActionBy) {
			throw new Error("Last actor cannot re-propose — wait for response");
		}
		this.props.counterProposal = new ProposalEntity(newProposal);
		this.props.lastActionBy = userId;
	}

	cancel(userId: string) {
		this.props.status = RescheduleStatusEnum.CANCELED;
		this.props.lastActionBy = userId;
	}

	// --- Mapper: from DB to Entity ---
	static fromDbDocument(doc: IRescheduleRequestDocument): RescheduleRequestEntity {
		const hasCounterProposal = doc.counterProposal && Object.keys(doc.counterProposal).length > 0 && doc.counterProposal.proposedDate && doc.counterProposal.proposedStartTime && doc.counterProposal.proposedEndTime;

		const counter = hasCounterProposal ? new ProposalEntity(doc.counterProposal as IProposalProps) : undefined;

		return new RescheduleRequestEntity({
			id: doc._id.toString(),
			sessionId: doc.sessionId.toString(),
			initiatedBy: doc.initiatedBy.toString(),
			oldProposal: new ProposalEntity(doc.oldProposal),
			currentProposal: new ProposalEntity(doc.currentProposal),
			counterProposal: counter,
			status: doc.status,
			lastActionBy: doc.lastActionBy.toString(),
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}

	// --- Mapper: Entity to Plain Object (for response/DTO)
	static toObject(entity: RescheduleRequestEntity) {
		const counterProposalObj = entity.counterProposal?.toObject();
		const hasCounterProposal = counterProposalObj && counterProposalObj.proposedDate && counterProposalObj.proposedStartTime && counterProposalObj.proposedEndTime;

		return {
			id: entity.id,
			sessionId: entity.sessionId,
			initiatedBy: entity.initiatedBy,
			oldProposal: entity.oldProposal.toObject(),
			currentProposal: entity.currentProposal.toObject(),
			counterProposal: hasCounterProposal ? counterProposalObj : undefined,
			status: entity.status,
			lastActionBy: entity.lastActionBy,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}

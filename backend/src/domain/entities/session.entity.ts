import { ISessionDocument, ISessionParticipant, SessionFormat, SessionPaymentStatus, SessionStatus } from "../../infrastructure/database/models/session/session.model";

export interface ISessionParticipantDTO {
	userId: string;
	paymentStatus: SessionPaymentStatus;
	paymentId?: string;
}

export interface ISessionInterface {
	id?: string;
	participants: ISessionParticipantDTO[];
	mentorId: string;
	topic: string;
	sessionType: string;
	sessionFormat: SessionFormat;
	date: Date;
	time: string;
	hours: number;
	message: string;
	status: SessionStatus;
	pricing: "free" | "paid";
	totalAmount?: number;
	rejectReason?: string;
	createdAt?: Date;
}

export class SessionEntity {
	private id?: string;
	private participants: ISessionParticipantDTO[];
	private mentorId: string;
	private topic: string;
	private sessionType: string;
	private sessionFormat: string;
	private date: Date;
	private time: string;
	private hours: number;
	private message: string;
	private status: string;
	private pricing: string;
	private totalAmount?: number;
	private rejectReason?: string;
	private createdAt: Date;

	constructor(session: ISessionInterface) {
		this.id = session.id;
		this.participants = session.participants;
		this.mentorId = session.mentorId;
		this.topic = session.topic;
		this.sessionType = session.sessionType;
		this.sessionFormat = session.sessionFormat;
		this.date = session.date;
		this.time = session.time;
		this.hours = session.hours;
		this.message = session.message;
		this.status = session.status;
		this.pricing = session.pricing;
		this.totalAmount = session.totalAmount;
		this.rejectReason = session.rejectReason;
		this.createdAt = session.createdAt || new Date();
	}

	static fromDBDocument(doc: ISessionDocument): SessionEntity {
		const participants = doc.participants.map((p: ISessionParticipant) => ({
			userId: p.userId.toString(),
			paymentStatus: p.paymentStatus,
			paymentId: p.paymentId,
		}));

		return new SessionEntity({
			id: doc._id.toString(),
			participants,
			mentorId: doc.mentorId.toString(),
			topic: doc.topic,
			sessionType: doc.sessionType,
			sessionFormat: doc.sessionFormat,
			date: doc.date,
			time: doc.time,
			hours: doc.hours,
			message: doc.message,
			status: doc.status,
			pricing: doc.pricing,
			totalAmount: doc.totalAmount,
			rejectReason: doc.rejectReason,
			createdAt: doc.createdAt,
		});
	}

	// You can add more getter methods if needed
	getId(): string | undefined {
		return this.id;
	}

	getParticipants(): ISessionParticipantDTO[] {
		return this.participants;
	}

	getPaidParticipants(): ISessionParticipantDTO[] {
		return this.participants.filter((p) => p.paymentStatus === "completed");
	}

	getTopic(): string {
		return this.topic;
	}

	getStatus(): string {
		return this.status;
	}

	getCreatedAt(): Date {
		return this.createdAt;
	}

	getTime(): string {
		return this.time;
	}

	getHours(): number{
		return this.hours;
	}

	toObject() {
		return {
			id: this.id,
			participants: this.participants,
			mentorId: this.mentorId,
			topic: this.topic,
			sessionType: this.sessionType,
			sessionFormat: this.sessionFormat,
			date: this.date,
			time: this.time,
			hours: this.hours,
			message: this.message,
			status: this.status,
			pricing: this.pricing,
			totalAmount: this.totalAmount,
			rejectReason: this.rejectReason,
			createdAt: this.createdAt,
		};
	}
}

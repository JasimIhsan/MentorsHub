import { ISessionDocument } from "../../infrastructure/database/models/session/session.model"; // adjust path as needed

export interface ISessionInterface {
	id?: string;
	mentorId: string;
	userId: string;
	topic: string;
	sessionType: string;
	sessionFormat: string;
	date: Date;
	time: string;
	hours: number;
	message: string;
	status: "upcoming" | "completed" | "canceled" | "approved" | "pending";
	paymentStatus?: "pending" | "completed" | "failed";
	pricing: "free" | "paid" | "both-pricing";
	paymentId?: string;
	totalAmount?: number;
	createdAt?: Date;
}

export class SessionEntity {
	private id?: string;
	private mentorId: string;
	private userId: string;
	private topic: string;
	private sessionType: string;
	private sessionFormat: string;
	private date: Date;
	private time: string;
	private hours: number;
	private message: string;
	private status: "upcoming" | "completed" | "canceled" | "approved" | "pending";
	private paymentStatus?: "pending" | "completed" | "failed";
	private pricing: "free" | "paid" | "both-pricing";
	private paymentId?: string;
	private totalAmount?: number;
	private createdAt: Date;

	constructor(session: ISessionInterface) {
		this.id = session.id;
		this.mentorId = session.mentorId;
		this.userId = session.userId;
		this.topic = session.topic;
		this.sessionType = session.sessionType;
		this.sessionFormat = session.sessionFormat;
		this.date = session.date;
		this.time = session.time;
		this.hours = session.hours;
		this.message = session.message;
		this.status = session.status;
		this.paymentStatus = session.paymentStatus;
		this.paymentId = session.paymentId;
		this.pricing = session.pricing;
		this.totalAmount = session.totalAmount;
		this.createdAt = session.createdAt || new Date();
	}

	static async createSession(session: Omit<ISessionInterface, "id" | "status" | "paymentStatus" | "createdAt">): Promise<SessionEntity> {
		return new SessionEntity({
			...session,
			status: "pending",
			paymentStatus: "pending",
			createdAt: new Date(),
		});
	}

	static fromDBDocument(doc: ISessionDocument): SessionEntity {
		return new SessionEntity({
			id: doc._id.toString(),
			mentorId: doc.mentorId.toString(),
			userId: doc.userId.toString(),
			topic: doc.topic,
			sessionType: doc.sessionType,
			sessionFormat: doc.sessionFormat,
			date: doc.date,
			time: doc.time,
			hours: doc.hours,
			message: doc.message,
			status: doc.status,
			pricing: doc.pricing,
			paymentStatus: doc.paymentStatus,
			paymentId: doc.paymentId,
			totalAmount: doc.totalAmount,
			createdAt: doc.createdAt,
		});
	}

	// Getters
	getId(): string | undefined {
		return this.id;
	}

	getMentorId(): string {
		return this.mentorId;
	}

	getUserId(): string {
		return this.userId;
	}

	getTopic(): string {
		return this.topic;
	}

	getSessionType(): string {
		return this.sessionType;
	}

	getSessionFormat(): string {
		return this.sessionFormat;
	}

	getDate(): Date {
		return this.date;
	}

	getTime(): string {
		return this.time;
	}

	getHours(): number {
		return this.hours;
	}

	getMessage(): string {
		return this.message;
	}

	getStatus(): "upcoming" | "completed" | "canceled" | "approved" | "pending" {
		return this.status;
	}

	getPaymentStatus(): "pending" | "completed" | "failed" | undefined {
		return this.paymentStatus;
	}

	getPaymentId(): string | undefined {
		return this.paymentId;
	}

	getTotalAmount(): number | undefined {
		return this.totalAmount;
	}

	getCreatedAt(): Date {
		return this.createdAt;
	}
}

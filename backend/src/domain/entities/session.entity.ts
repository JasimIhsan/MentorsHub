import { SessionPaymentStatusEnum } from "../../application/interfaces/enums/session.payment.status.enum";
import { SessionStatusEnum } from "../../application/interfaces/enums/session.status.enums";

export type SessionFormat = "one-on-one" | "group";
export type PricingType = "free" | "paid";

export interface PersonEntity {
	id: string;
	firstName?: string;
	lastName?: string;
	avatar?: string;
}

export interface SessionParticipantEntity {
	user: PersonEntity;
	paymentStatus: SessionPaymentStatusEnum;
	paymentId?: string;
}

export interface SessionProps {
	id: string;
	mentor: PersonEntity;
	participants: SessionParticipantEntity[];
	topic: string;
	sessionFormat: SessionFormat;
	date: Date;
	startTime: string;
	endTime: string;
	hours: number;
	message: string;
	status: SessionStatusEnum;
	pricing: PricingType;
	totalAmount?: number;
	rejectReason?: string;
	createdAt: Date;
}

export class SessionEntity {
	constructor(private props: SessionProps) {}

	get id() {
		return this.props.id;
	}
	get mentor() {
		return this.props.mentor;
	}
	get participants() {
		return this.props.participants;
	}
	get topic() {
		return this.props.topic;
	}

	get sessionFormat() {
		return this.props.sessionFormat;
	}
	get date() {
		return this.props.date;
	}
	get startTime() {
		return this.props.startTime;
	}
	get endTime() {
		return this.props.endTime;
	}
	get hours() {
		return this.props.hours;
	}
	get message() {
		return this.props.message;
	}
	get status() {
		return this.props.status;
	}
	get pricing() {
		return this.props.pricing;
	}
	get totalAmount() {
		return this.props.totalAmount ?? 0;
	}
	get rejectReason() {
		return this.props.rejectReason;
	}
	get createdAt() {
		return this.props.createdAt;
	}

	get paidParticipants() {
		return this.props.participants.filter((p) => p.paymentStatus === SessionPaymentStatusEnum.COMPLETED);
	}

	get fee() {
		return this.props.pricing === "free" ? 0 : this.totalAmount;
	}

	findParticipant(userId: string) {
		return this.props.participants.find((p) => p.user.id === userId) || null;
	}

	updateSchedule(date: Date, startTime: string, endTime: string) {
		this.props.date = date;
		this.props.startTime = startTime;
		this.props.endTime = endTime;
	}

	toObject(): SessionProps {
		return { ...this.props };
	}

	static fromDB(doc: any): SessionEntity {
		const mentorUser = doc.mentorId || {}; // populated
		const participants = (doc.participants || []).map((p: any) => {
			const user = p.userId || {};
			return {
				user: {
					id: user._id?.toString?.() || user.toString(),
					firstName: user.firstName,
					lastName: user.lastName,
					avatar: user.avatar,
				},
				paymentStatus: p.paymentStatus,
				paymentId: p.paymentId,
			};
		});

		return new SessionEntity({
			id: doc._id.toString(),
			mentor: {
				id: mentorUser._id?.toString?.() || mentorUser.toString(),
				firstName: mentorUser.firstName,
				lastName: mentorUser.lastName,
				avatar: mentorUser.avatar,
			},
			participants,
			topic: doc.topic,
			sessionFormat: doc.sessionFormat,
			date: doc.date,
			startTime: doc.startTime,
			endTime: doc.endTime,
			hours: doc.hours,
			message: doc.message,
			status: doc.status,
			pricing: doc.pricing,
			totalAmount: doc.totalAmount,
			rejectReason: doc.rejectReason,
			createdAt: doc.createdAt,
		});
	}

	static toObject(session: SessionEntity) {
		return {
			id: session.id,
			mentor: session.mentor,
			participants: session.participants,
			topic: session.topic,
			sessionFormat: session.sessionFormat,
			date: session.date,
			startTime: session.startTime,
			endTime: session.endTime,
			hours: session.hours,
			message: session.message,
			status: session.status,
			pricing: session.pricing,
			totalAmount: session.totalAmount,
			rejectReason: session.rejectReason,
			createdAt: session.createdAt,
		};
	}
}

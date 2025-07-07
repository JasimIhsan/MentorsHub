// domain/entities/session.entity.ts


export type SessionStatus = "upcoming" | "completed" | "canceled" | "approved" | "pending" | "rejected" | "expired" | "ongoing";

export type SessionPaymentStatus = "pending" | "completed" | "failed";
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
	paymentStatus: SessionPaymentStatus;
	paymentId?: string;
}

export interface SessionProps {
	id: string;
	mentor: PersonEntity;
	participants: SessionParticipantEntity[];
	topic: string;
	sessionType: string;
	sessionFormat: SessionFormat;
	date: Date;
	time: string;
	hours: number;
	message: string;
	status: SessionStatus;
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
	get sessionType() {
		return this.props.sessionType;
	}
	get sessionFormat() {
		return this.props.sessionFormat;
	}
	get date() {
		return this.props.date;
	}
	get time() {
		return this.props.time;
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
		return this.props.participants.filter((p) => p.paymentStatus === "completed");
	}

	get fee() {
		return this.props.pricing === "free" ? 0 : this.totalAmount;
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
}

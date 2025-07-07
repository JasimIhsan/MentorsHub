import { PersonEntity, PricingType, SessionEntity, SessionPaymentStatus, SessionStatus } from "../../domain/entities/session.entity";

interface BaseSession {
	topic: string;
	sessionType: string;
	sessionFormat: string;
	date: string;
	time: string;
	hours: number;
	message: string;
	status: SessionStatus;
	paymentStatus?: SessionPaymentStatus;
	pricing: PricingType;
	rejectReason?: string;
	paymentId?: string;
	totalAmount?: number;
	createdAt: string;
}

interface Person {
	_id: string;
	firstName: string;
	lastName: string;
	avatar?: string;
}

export interface MentorInfo extends Person {}
export interface Mentee extends Person {}

export interface SessionParticipant extends Mentee {
	paymentStatus?: SessionPaymentStatus;
	paymentId?: string;
}

export interface ISessionUserDTO extends BaseSession {
	id: string;
	mentor: MentorInfo;
	userId: string;
}

export interface ISessionMentorDTO extends BaseSession {
	id: string;
	mentor: string;
	participants: SessionParticipant[];
}

function mapToPerson(user: PersonEntity): Mentee {
	return {
		_id: user.id,
		firstName: user.firstName!,
		lastName: user.lastName!,
		avatar: user.avatar,
	};
}

// ✅ Mapper: Entity → ISessionUserDTO
export function mapToUserSessionDTO(session: SessionEntity, userId: string): ISessionUserDTO {
	const mentor = session.mentor;

	return {
		id: session.id,
		mentor: mapToPerson(mentor),
		userId,
		topic: session.topic,
		sessionType: session.sessionType,
		sessionFormat: session.sessionFormat,
		date: session.date.toISOString(),
		time: session.time,
		hours: session.hours,
		message: session.message,
		status: session.status,
		pricing: session.pricing,
		rejectReason: session.rejectReason,
		totalAmount: session.fee,
		createdAt: session.createdAt.toISOString(),
	};
}

// ✅ Mapper: Entity → ISessionMentorDTO
export function mapToMentorSessionDTO(session: SessionEntity): ISessionMentorDTO {
	const participants: SessionParticipant[] = session.participants.map((p) => ({
		...mapToPerson(p.user),
		paymentStatus: p.paymentStatus,
		paymentId: p.paymentId,
	}));

	return {
		id: session.id,
		mentor: session.mentor.id,
		participants,
		topic: session.topic,
		sessionType: session.sessionType,
		sessionFormat: session.sessionFormat,
		date: session.date.toISOString(),
		time: session.time,
		hours: session.hours,
		message: session.message,
		status: session.status,
		pricing: session.pricing,
		rejectReason: session.rejectReason,
		totalAmount: session.fee,
		createdAt: session.createdAt.toISOString(),
	};
}

import { RescheduleRequestEntity } from "../../domain/entities/reschedule.request.entity";
import { PersonEntity, PricingType, SessionEntity } from "../../domain/entities/session.entity";
import { SessionPaymentStatusEnum } from "../interfaces/enums/session.payment.status.enum";
import { SessionStatusEnum } from "../interfaces/enums/session.status.enums";
import { IRescheduleRequestDTO, mapToRescheduleRequestDTO } from "./reschedule.request.dto";

interface BaseSession {
	topic: string;
	sessionFormat: string;
	date: string;
	startTime: string;
	endTime: string;
	hours: number;
	message: string;
	status: SessionStatusEnum;
	paymentStatus?: SessionPaymentStatusEnum;
	pricing: PricingType;
	rejectReason?: string;
	paymentId?: string;
	totalAmount?: number;
	rescheduleRequest?: IRescheduleRequestDTO;
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
	paymentStatus?: SessionPaymentStatusEnum;
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
export function mapToUserSessionDTO(session: SessionEntity, userId: string, rescheduleRequest?: RescheduleRequestEntity): ISessionUserDTO {
	const mentor = session.mentor;

	return {
		id: session.id,
		mentor: mapToPerson(mentor),
		userId,
		topic: session.topic,
		sessionFormat: session.sessionFormat,
		date: session.date?.toISOString(),
		startTime: session.startTime,
		endTime: session.endTime,
		hours: session.hours,
		message: session.message,
		status: session.status,
		pricing: session.pricing,
		rejectReason: session.rejectReason,
		totalAmount: session.totalAmount,
		rescheduleRequest: rescheduleRequest ? mapToRescheduleRequestDTO(rescheduleRequest) : undefined,
		createdAt: session.createdAt?.toISOString(),
	};
}

// ✅ Mapper: Entity → ISessionMentorDTO
export function mapToMentorSessionDTO(session: SessionEntity, rescheduleRequest?: RescheduleRequestEntity): ISessionMentorDTO {
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
		sessionFormat: session.sessionFormat,
		date: session.date.toISOString(),
		startTime: session.startTime,
		endTime: session.endTime,
		hours: session.hours,
		message: session.message,
		status: session.status,
		pricing: session.pricing,
		rejectReason: session.rejectReason,
		totalAmount: session.fee,
		rescheduleRequest: rescheduleRequest ? mapToRescheduleRequestDTO(rescheduleRequest) : undefined,
		createdAt: session.createdAt.toISOString(),
	};
}

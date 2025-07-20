import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IMentorProfileRepository } from "../../../../domain/repositories/mentor.details.repository";
import { SessionEntity, SessionParticipantEntity, PricingType } from "../../../../domain/entities/session.entity";
import { IGetAvailabilityUseCase } from "../../../interfaces/mentors/mentors.interface";
import { ISessionUserDTO, mapToUserSessionDTO } from "../../../dtos/session.dto";
import { IRequestSessionUseCase } from "../../../interfaces/session";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { SessionPaymentStatusEnum } from "../../../interfaces/enums/session.payment.status.enum";
import { INotifyUserUseCase } from "../../../interfaces/notification/notification.usecase";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";

export interface SessionRequestInput {
	mentorId: string;
	userId: string;
	topic: string;
	sessionFormat: "one-on-one" | "group";
	date: Date;
	time: string;
	hours: number;
	message: string;
	pricing: PricingType;
	totalAmount?: number;
}

export class RequestSessionUseCase implements IRequestSessionUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly mentorRepo: IMentorProfileRepository, private readonly getAvailability: IGetAvailabilityUseCase, private readonly notifyUserUseCase: INotifyUserUseCase) {}

	async execute(dto: SessionRequestInput): Promise<ISessionUserDTO> {
		const mentorProfile = await this.mentorRepo.findMentorByUserId(dto.mentorId);
		if (!mentorProfile) {
			throw new Error("Mentor not found");
		}

		const slots = await this.getAvailability.execute(dto.mentorId, dto.date);
		if (!slots.includes(dto.time)) {
			throw new Error("The requested slot is already booked or unavailable.");
		}

		const participants: SessionParticipantEntity[] = [
			{
				user: { id: dto.userId },
				paymentStatus: SessionPaymentStatusEnum.PENDING,
				paymentId: undefined,
			},
		];

		const session = new SessionEntity({
			id: "",
			mentor: { id: dto.mentorId },
			participants,
			topic: dto.topic,
			sessionFormat: dto.sessionFormat,
			date: dto.date,
			time: dto.time,
			hours: dto.hours,
			message: dto.message,
			status: SessionStatusEnum.PENDING,
			pricing: dto.pricing,
			totalAmount: dto.totalAmount,
			createdAt: new Date(),
			rejectReason: undefined,
		});

		const saved = await this.sessionRepo.create(session);

		await this.notifyUserUseCase.execute({
			title: "📥 New Session Request",
			message: `You received a session request for "${session.topic}".`,
			isRead: false,
			recipientId: dto.mentorId,
			type: NotificationTypeEnum.SESSION,
			link: "/mentor/requests",
		});

		return mapToUserSessionDTO(saved, dto.userId);
	}
}

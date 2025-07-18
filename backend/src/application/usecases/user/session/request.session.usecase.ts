// application/use‑cases/session/request-session.usecase.ts
import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IMentorProfileRepository } from "../../../../domain/repositories/mentor.details.repository";
import { SessionEntity, SessionParticipantEntity, PricingType } from "../../../../domain/entities/session.entity"; // <- now imported from Entity
import { IGetAvailabilityUseCase } from "../../../interfaces/mentors/mentors.interface";
import { ISessionUserDTO, mapToUserSessionDTO } from "../../../dtos/session.dto";
import { IRequestSessionUseCase } from "../../../interfaces/session";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { SessionPaymentStatusEnum } from "../../../interfaces/enums/session.payment.status.enum";

export interface SessionRequestInput {
	mentorId: string; // who you’re booking
	userId: string; // current logged‑in user
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
	constructor(private readonly sessionRepo: ISessionRepository, private readonly mentorRepo: IMentorProfileRepository, private readonly getAvailability: IGetAvailabilityUseCase) {}

	async execute(dto: SessionRequestInput): Promise<ISessionUserDTO> {
		/* Make sure the mentor exists */
		const mentorProfile = await this.mentorRepo.findMentorByUserId(dto.mentorId);
		if (!mentorProfile) {
			throw new Error("Mentor not found");
		}

		/* Check slot availability */
		const slots = await this.getAvailability.execute(dto.mentorId, dto.date); // e.g. ["10:00", "14:30"]
		if (!slots.includes(dto.time)) {
			throw new Error("The requested slot is already booked or unavailable.");
		}

		/* Build participants array with the *new* shape */
		// const participantPayment: SessionPaymentStatusEnum = dto.pricing === "free" ? SessionPaymentStatusEnum.COMPLETED : SessionPaymentStatusEnum.PENDING;

		const participants: SessionParticipantEntity[] = [
			{
				user: { id: dto.userId }, // PersonEntity with just an id for now
				paymentStatus: SessionPaymentStatusEnum.PENDING,
				paymentId: undefined,
			},
		];

		/* Create the SessionEntity */
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

		/* Persist through the repository */
		const saved = await this.sessionRepo.create(session);
		return mapToUserSessionDTO(saved, dto.userId); // entity goes back to controller
	}
}

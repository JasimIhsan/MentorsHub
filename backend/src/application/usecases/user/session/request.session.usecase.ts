import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IMentorProfileRepository } from "../../../../domain/repositories/mentor.details.repository";
import { ISessionParticipantDTO, SessionEntity } from "../../../../domain/entities/session.entity";
import { IRequestSessionUseCase } from "../../../interfaces/session";
import { SessionFormat, SessionPaymentStatus, PricingType } from "../../../../infrastructure/database/models/session/session.model";
import { IGetAvailabilityUseCase } from "../../../interfaces/mentors/mentors.interface";

export interface SessionDTO {
	mentorId: string;
	userId: string;
	topic: string;
	sessionType: string;
	sessionFormat: SessionFormat;
	date: Date;
	time: string;
	hours: number;
	message: string;
	totalAmount: number;
	pricing: PricingType;
}
export class RequestSessionUseCase implements IRequestSessionUseCase {
	constructor(private sessionRepo: ISessionRepository, private mentorRepo: IMentorProfileRepository, private getMentorAvailabilityUseCase: IGetAvailabilityUseCase) {}

	async execute(data: SessionDTO) {
		const mentor = await this.mentorRepo.findMentorByUserId(data.mentorId);
		if (!mentor) {
			throw new Error("Mentor not found");
		}

		// Get available slots for the selected date
		const availableSlots: string[] = await this.getMentorAvailabilityUseCase.execute(data.mentorId, data.date);

		// Check if the requested slot is available
		if (!availableSlots.includes(data.time)) {
			throw new Error("The requested slot is already booked or unavailable.");
		}

		// Proceed to create session
		const userPaymentStatus: SessionPaymentStatus = data.pricing === "free" ? "completed" : "pending";

		const participants: ISessionParticipantDTO[] = [
			{
				userId: data.userId,
				paymentStatus: userPaymentStatus,
			},
		];

		const sessionEntity = new SessionEntity({
			participants,
			mentorId: data.mentorId,
			topic: data.topic,
			sessionType: data.sessionType,
			sessionFormat: data.sessionFormat || "one-on-one",
			date: data.date,
			time: data.time,
			hours: data.hours,
			message: data.message,
			status: "pending",
			pricing: data.pricing,
			totalAmount: data.totalAmount,
			createdAt: new Date(),
		});

		const savedSession = await this.sessionRepo.createSession(sessionEntity);

		return savedSession;
	}
}

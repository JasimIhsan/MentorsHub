import { v4 as uuidv4 } from "uuid";
import { ISessionRepository } from "../../../../domain/dbrepository/session.repository";
import { IMentorProfileRepository } from "../../../../domain/dbrepository/mentor.details.repository";
import { ISessionParticipantDTO, SessionEntity } from "../../../../domain/entities/session.entity";
import { IRequestSessionUseCase } from "../../../interfaces/session";
import { SessionFormat, SessionPaymentStatus, PricingType, SessionStatus } from "../../../../infrastructure/database/models/session/session.model";

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
	constructor(private sessionRepo: ISessionRepository, private mentorRepo: IMentorProfileRepository) {}

	async execute(data: SessionDTO) {
		const mentor = await this.mentorRepo.findMentorByUserId(data.mentorId);
		if (!mentor) {
			throw new Error("Mentor not found");
		}
		let userPaymentStatus: SessionPaymentStatus = data.pricing === "free" ? "completed" : "pending";

		const participants = [
			{
				userId: data.userId,
				paymentStatus: userPaymentStatus,
			},
		];

		const sessionEntity = new SessionEntity({
			participants: participants as ISessionParticipantDTO[],
			mentorId: data.mentorId,
			topic: data.topic,
			sessionType: data.sessionType,
			sessionFormat: "one-on-one",
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

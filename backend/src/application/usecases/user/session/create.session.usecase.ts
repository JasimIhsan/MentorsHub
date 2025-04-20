import { v4 as uuidv4 } from "uuid";
import { IMentorProfileRepository } from "../../../../domain/dbrepository/mentor.details.repository";
import { ISessionRepository } from "../../../../domain/dbrepository/session.repository";
import { SessionEntity } from "../../../../domain/entities/session.entity";
import { IRequestSessionUseCase } from "../../../interfaces/session";

export interface SessionDTO {
	mentorId: string;
	userId: string;
	topic: string;
	sessionType: string;
	sessionFormat: string;
	date: Date;
	time: string;
	hours: number;
	message: string;
	totalAmount: number;
	pricing: "free" | "paid" | "both-pricing";
}

export class RequestSessionUseCase implements IRequestSessionUseCase {
	constructor(private sessionRepo: ISessionRepository, private mentorRepo: IMentorProfileRepository) {}

	async execute(data: SessionDTO) {
		const mentor = await this.mentorRepo.findMentorByUserId(data.mentorId);
		if (!mentor) throw new Error("Mentor not found");

		let paymentStatus: "pending" | "completed" = "pending";
		if (data.pricing === "free") {
			paymentStatus = "completed";
		}

		const sessionEntity = new SessionEntity({
			mentorId: data.mentorId,
			userId: data.userId,
			topic: data.topic,
			sessionType: data.sessionType,
			sessionFormat: data.sessionFormat,
			date: data.date,
			time: data.time,
			hours: data.hours,
			message: data.message,
			status: "pending",
			paymentStatus: paymentStatus,
			totalAmount: data.totalAmount,
			pricing: data.pricing,
			createdAt: new Date(),
		});

		const savedSession = await this.sessionRepo.createSession(sessionEntity);

		return savedSession;
	}
}

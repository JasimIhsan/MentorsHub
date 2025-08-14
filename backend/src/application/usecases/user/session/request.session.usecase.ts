import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IMentorProfileRepository } from "../../../../domain/repositories/mentor.details.repository";
import { SessionEntity, SessionParticipantEntity, PricingType } from "../../../../domain/entities/session.entity";
import { IGetAvailabilityUseCase } from "../../../interfaces/usecases/mentors/mentors.interface";
import { ISessionUserDTO, mapToUserSessionDTO } from "../../../dtos/session.dto";
import { IRequestSessionUseCase } from "../../../interfaces/usecases/session";
import { SessionStatusEnum } from "../../../interfaces/enums/session.status.enums";
import { SessionPaymentStatusEnum } from "../../../interfaces/enums/session.payment.status.enum";
import { INotifyUserUseCase } from "../../../interfaces/usecases/notification/notification.usecase";
import { NotificationTypeEnum } from "../../../interfaces/enums/notification.type.enum";

export interface SessionRequestInput {
	mentorId: string;
	userId: string;
	topic: string;
	sessionFormat: "one-on-one" | "group";
	date: Date;
	startTime: string; // e.g., "13:00"
	endTime: string; // e.g., "14:00"
	hours: number;
	message: string;
	pricing: PricingType;
	totalAmount?: number;
}

export class RequestSessionUseCase implements IRequestSessionUseCase {
	constructor(private readonly sessionRepo: ISessionRepository, private readonly mentorRepo: IMentorProfileRepository, private readonly getAvailability: IGetAvailabilityUseCase, private readonly notifyUserUseCase: INotifyUserUseCase) {}

	async execute(input: SessionRequestInput): Promise<ISessionUserDTO> {
		const mentorProfile = await this.mentorRepo.findMentorByUserId(input.mentorId);
		if (!mentorProfile) throw new Error("Mentor not found");

		// Check if date is exactly tomorrow
		// const today = new Date();
		// today.setHours(0, 0, 0, 0); // midnight today

		// const tomorrow = new Date(today);
		// tomorrow.setDate(today.getDate() + 1); // midnight tomorrow

		// const requestedDate = new Date(input.date);
		// requestedDate.setHours(0, 0, 0, 0);

		// if (requestedDate.getTime() !== tomorrow.getTime()) {
		// 	throw new Error("You can only request sessions for the next day.");
		// }

		const availableSlots = await this.getAvailability.execute(input.mentorId, input.date, input.hours);
		if (!availableSlots.includes(input.startTime)) {
			throw new Error("The requested slot is already booked or unavailable.");
		}

		const participants: SessionParticipantEntity[] = [
			{
				user: { id: input.userId },
				paymentStatus: SessionPaymentStatusEnum.PENDING,
				paymentId: undefined,
			},
		];

		const session = new SessionEntity({
			id: "",
			mentor: { id: input.mentorId },
			participants,
			topic: input.topic,
			sessionFormat: input.sessionFormat,
			date: input.date,
			startTime: input.startTime,
			endTime: input.endTime,
			hours: input.hours,
			message: input.message,
			status: SessionStatusEnum.PENDING,
			pricing: input.pricing,
			totalAmount: input.totalAmount,
			createdAt: new Date(),
			rejectReason: undefined,
		});

		const saved = await this.sessionRepo.create(session);

		await this.notifyUserUseCase.execute({
			title: "📥 New Session Request",
			message: `You received a session request for "${session.topic}".`,
			isRead: false,
			recipientId: input.mentorId,
			type: NotificationTypeEnum.SESSION,
			link: "/mentor/requests",
		});

		return mapToUserSessionDTO(saved, input.userId);
	}
}

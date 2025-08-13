import { ProposalEntity, RescheduleRequestEntity } from "../../../domain/entities/reschedule.request.entity";
import { IRescheduleRequestRepository } from "../../../domain/repositories/reschedule.request.repository";
import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IRescheduleRequestDTO, mapToRescheduleRequestDTO } from "../../dtos/reschedule.request.dto";
import { RescheduleStatusEnum } from "../../interfaces/enums/reschedule.status.enum";
import { INotifyUserUseCase } from "../../interfaces/notification/notification.usecase";
import { ICreateRescheduleRequestInput, ICreateRescheduleRequestUsecase } from "../../interfaces/reschedule.request";

export class CreateRescheduleRequestUseCase implements ICreateRescheduleRequestUsecase {
	constructor(private rescheduleRequestRepo: IRescheduleRequestRepository, private sessionRepo: ISessionRepository, private readonly notifyUserUseCase: INotifyUserUseCase) {}

	async execute(input: ICreateRescheduleRequestInput): Promise<IRescheduleRequestDTO> {
		const sessionEntity = await this.sessionRepo.findById(input.sessionId);
		if (!sessionEntity) throw new Error("Session not found");

		const isSameTime = sessionEntity.startTime === input.proposedStartTime && sessionEntity.endTime === input.proposedEndTime;
		const isSameDate = new Date(sessionEntity.date).getTime() === new Date(input.proposedDate).getTime();
		if (isSameTime && isSameDate) throw new Error("You cannot reschedule to the same time and date.");

		const existingRequest = await this.rescheduleRequestRepo.findBySessionId(input.sessionId);
		if (existingRequest) {
			throw new Error("A reschedule request is already pending for this session.");
		}

		const proposalEntity = new ProposalEntity({
			proposedDate: input.proposedDate,
			proposedStartTime: input.proposedStartTime,
			proposedEndTime: input.proposedEndTime,
			message: input.message,
		});

		const rescheduleRequest = new RescheduleRequestEntity({
			id: "",
			sessionId: input.sessionId,
			oldProposal: new ProposalEntity({
				proposedDate: sessionEntity.date,
				proposedStartTime: sessionEntity.startTime,
				proposedEndTime: sessionEntity.endTime,
			}),
			currentProposal: proposalEntity,
			initiatedBy: input.userId,
			counterProposal: undefined,
			status: RescheduleStatusEnum.PENDING,
			lastActionBy: input.userId,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const entity = await this.rescheduleRequestRepo.create(rescheduleRequest);

		// await this.notifyUserUseCase.execute({
		// 	title: "📅 Reschedule Request Pending",
		// 	message: `You have a reschedule request pending for the session "${sessionEntity.topic}".`,
		// 	isRead: false,
		// 	type: NotificationTypeEnum.RESCHEDULE_REQUEST,
		// 	recipientId: sessionEntity.mentor.id,
		// });

		// return mapToUserSessionDTO(sessionEntity, input.userId, entity);
		return mapToRescheduleRequestDTO(entity);
	}
}

import { IRescheduleRequestRepository } from "../../../domain/repositories/reschedule.request.repository";
import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { CommonStringMessage } from "../../../shared/constants/string.messages";
import { IRescheduleRequestDTO, mapToRescheduleRequestDTO } from "../../dtos/reschedule.request.dto";
import { INotifyUserUseCase } from "../../interfaces/usecases/notification/notification.usecase";
import { ICounterRescheduleRequestUseCase } from "../../interfaces/usecases/reschedule.request";

export class CouterRescheduleRequestUseCase implements ICounterRescheduleRequestUseCase {
	constructor(private readonly rescheduleRequestRepo: IRescheduleRequestRepository, private readonly sessionRepo: ISessionRepository, private readonly notifyUserUseCase: INotifyUserUseCase) {}

	async execute(userId: string, sessionId: string, startTime: string, endTime: string, message: string, date: Date): Promise<IRescheduleRequestDTO> {
		const session = await this.sessionRepo.findById(sessionId);
		if (!session) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);

		const isOriginalProposal = session.startTime === startTime && session.endTime === endTime && new Date(session.date).getTime() === new Date(date).getTime();
		if (isOriginalProposal) throw new Error("You cannot reschedule to the original time and date.");

		const rescheduleRequest = await this.rescheduleRequestRepo.findBySessionId(session.id);
		if (!rescheduleRequest) throw new Error("Reschedule request not found.");

		const isSameCurrentProposal =
			rescheduleRequest.currentProposal.proposedStartTime === startTime &&
			rescheduleRequest.currentProposal.proposedEndTime === endTime && //
			new Date(rescheduleRequest.currentProposal.proposedDate).getTime() === new Date(date).getTime();

		if (isSameCurrentProposal) throw new Error("You cannot propose the same time and date as the current proposal.");

		rescheduleRequest.proposeCounterProposal(userId, { proposedDate: date, proposedStartTime: startTime, proposedEndTime: endTime, message: message });

		await this.rescheduleRequestRepo.update(rescheduleRequest);

		// await this.notifyUserUseCase.execute({
		// 	title: "📅 Counter Proposal Received",
		// 	recipientId: userId,
		// 	message: `A counter proposal has been made for your reschedule request. Please review the details and accept or reject the proposal.`,
		// 	isRead: false,
		// 	type: NotificationTypeEnum.RESCHEDULE_REQUEST,
		// });

		return mapToRescheduleRequestDTO(rescheduleRequest);
	}
}

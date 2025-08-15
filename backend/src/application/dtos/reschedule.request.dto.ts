import { ProposalEntity, RescheduleRequestEntity } from "../../domain/entities/reschedule.request.entity";
import { RescheduleStatusEnum } from "../interfaces/enums/reschedule.status.enum";

export interface IProposalDTO {
	proposedDate: string;
	proposedStartTime: string;
	proposedEndTime: string;
	message?: string;
}

export interface IRescheduleRequestDTO {
	id: string;
	sessionId: string;
	initiatedBy: string;
	oldProposal: IProposalDTO;
	currentProposal: IProposalDTO;
	counterProposal?: IProposalDTO;
	status: RescheduleStatusEnum;
	lastActionBy: string;
	createdAt: string;
	updatedAt: string;
}

function mapToProposal(proposal: ProposalEntity): IProposalDTO {
	return {
		proposedDate: proposal.proposedDate?.toISOString(),
		proposedStartTime: proposal.proposedStartTime,
		proposedEndTime: proposal.proposedEndTime,
		message: proposal.message,
	};
}

export function mapToRescheduleRequestDTO(rescheduleRequest: RescheduleRequestEntity): IRescheduleRequestDTO {

	return {
		id: rescheduleRequest.id,
		sessionId: rescheduleRequest.sessionId,
		initiatedBy: rescheduleRequest.initiatedBy,
		oldProposal: mapToProposal(rescheduleRequest.oldProposal),
		currentProposal: mapToProposal(rescheduleRequest.currentProposal),
		counterProposal: rescheduleRequest.counterProposal ? mapToProposal(rescheduleRequest.counterProposal) : undefined,
		status: rescheduleRequest.status,
		lastActionBy: rescheduleRequest.lastActionBy,
		createdAt: rescheduleRequest.createdAt?.toISOString(),
		updatedAt: rescheduleRequest.updatedAt?.toISOString(),
	};
}

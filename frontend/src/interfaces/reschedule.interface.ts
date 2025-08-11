import { RescheduleStatusEnum } from "./enums/reschedule.request.enum";

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

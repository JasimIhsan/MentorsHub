import { ISessionMentorDTO, ISessionUserDTO } from "@/interfaces/session.interface";
import { IProposalDTO, IRescheduleRequestDTO } from "@/interfaces/reschedule.interface";
import { convertUTCtoLocal } from "./utcToLocal";

// Generic type to support both session types
type SessionType = ISessionMentorDTO | ISessionUserDTO;

/**
 * Converts UTC session times → Local times (IST)
 * Works for both ISessionMentorDTO and ISessionUserDTO
 */
export function convertSessionsArrayToLocal<T extends SessionType>(sessions: T[]): T[] {
	return sessions.map((session) => {
		const { startTime, endTime, date } = convertUTCtoLocal(session.startTime, session.endTime, session.date);
		return { ...session, startTime, endTime, date, rescheduleRequest: convertRescheduleRequestToLocal(session.rescheduleRequest) };
	});
}

// Convert a single proposal to local
export function convertProposalToLocal(proposal?: IProposalDTO): IProposalDTO | undefined {
	if (!proposal) return proposal;
	const local = convertUTCtoLocal(proposal.proposedStartTime, proposal.proposedEndTime, proposal.proposedDate);
	return {
		...proposal,
		proposedDate: local.date,
		proposedStartTime: local.startTime,
		proposedEndTime: local.endTime,
	};
}

// Convert reschedule request
export function convertRescheduleRequestToLocal(request?: IRescheduleRequestDTO): IRescheduleRequestDTO | undefined {
	if (!request) return request;
	return {
		...request,
		oldProposal: convertProposalToLocal(request.oldProposal)!,
		currentProposal: convertProposalToLocal(request.currentProposal)!,
		counterProposal: convertProposalToLocal(request.counterProposal),
	};
}

// Convert session (works for both Mentor and User)
export function convertSessionToLocal<T extends SessionType>(session: T): T {
	const local = convertUTCtoLocal(session.startTime, session.endTime, session.date);
	return {
		...session,
		date: local.date,
		startTime: local.startTime,
		endTime: local.endTime,
		rescheduleRequest: convertRescheduleRequestToLocal(session.rescheduleRequest),
	};
}

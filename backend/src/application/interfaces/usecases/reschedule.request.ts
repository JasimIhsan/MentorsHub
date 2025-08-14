import { IRescheduleRequestDTO } from "../../dtos/reschedule.request.dto";
import { ISessionMentorDTO, ISessionUserDTO } from "../../dtos/session.dto";
import { RescheduleStatusEnum } from "../enums/reschedule.status.enum";

export interface ICreateRescheduleRequestInput {
	sessionId: string;
	userId: string;
	proposedDate: Date;
	proposedStartTime: string;
	proposedEndTime: string;
	message: string;
}

export interface ICreateRescheduleRequestUsecase {
	execute(input: ICreateRescheduleRequestInput): Promise<IRescheduleRequestDTO>;
}

export interface IGetSessionRescheduleRequestsByMentorUseCase {
	execute(mentorId: string, filters: { page: number; limit: number; status?: RescheduleStatusEnum }): Promise<{ sessions: ISessionMentorDTO[]; total: number }>;
}

export interface ICounterRescheduleRequestUseCase {
	execute(userId: string, sessionId: string, startTime: string, endTime: string, message: string, date: Date): Promise<IRescheduleRequestDTO>;
}

export interface IAcceptRescheduleRequestUseCase {
	execute(userId: string, sessionId: string, isCounter: boolean): Promise<ISessionUserDTO | ISessionMentorDTO>;
}

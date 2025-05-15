import { SessionEntity } from "../../domain/entities/session.entity";
import { ISessionUserDTO } from "../dtos/session.dto";
import { SessionDTO } from "../usecases/user/session/request.session.usecase";

export interface IRequestSessionUseCase {
	execute(data: SessionDTO): Promise<SessionEntity>;
}

export interface IGetSessionsByUserUseCase {
	execute(userId: string): Promise<ISessionUserDTO[]>;
}

export interface IUpdateSessionStatusUseCase {
	execute(sessionId: string, status: string, rejectReason?: string): Promise<void>;
}

export interface IPaySessionUseCase {
	execute(sessionId: string, userId: string, paymentId: string, paymentStatus: string, status: string): Promise<void>;
}

export interface IStartSessionUseCase {
	execute(sessionId: string): Promise<void>;
}
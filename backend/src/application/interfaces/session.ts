import { SessionEntity } from "../../domain/entities/session.entity";
import { ISessionUserDTO } from "../dtos/session.dto";
import { SessionDTO } from "../usecases/user/session/create.session.usecase";

export interface IRequestSessionUseCase {
	execute(data: SessionDTO): Promise<SessionEntity>
}

export interface IFetchSessionsByUserUseCase{
	execute(userId: string): Promise<ISessionUserDTO[]>
}

export interface IUpdateRequestStatusUseCase{
	execute(sessionId: string, status: string): Promise<void>
}

export interface IPaySessionUseCase{
	execute(sessionId: string, paymentId: string, paymentStatus: string, status: string): Promise<void>
}
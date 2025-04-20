import { SessionEntity } from "../../domain/entities/session.entity";
import { ISessionDTO } from "../dtos/session.dto";
import { SessionDTO } from "../usecases/user/session/create.session.usecase";

export interface IRequestSessionUseCase {
	execute(data: SessionDTO): Promise<SessionEntity>
}

export interface IFetchSessionsByUserUseCase{
	execute(userId: string): Promise<ISessionDTO[]>
}
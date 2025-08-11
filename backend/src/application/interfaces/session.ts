import { ISessionUserDTO } from "../dtos/session.dto";
import { SessionRequestInput } from "../usecases/user/session/request.session.usecase";

export interface IRequestSessionUseCase {
	execute(data: SessionRequestInput): Promise<ISessionUserDTO>;
}

export interface IGetSessionByUserUseCase {
	execute(sessionId: string, userId: string): Promise<ISessionUserDTO>;
}

export interface IGetSessionsByUserUseCase {
	execute(
		userId: string,
		options?: {
			page?: number;
			limit?: number;
			search?: string;
			status?: string;
		}
	): Promise<{sessions: ISessionUserDTO[]; total: number}>;
}

export interface IUpdateSessionStatusUseCase {
	execute(sessionId: string, status: string, rejectReason?: string): Promise<void>;
}

export interface IPaySessionWithWalletUseCase {
	execute(sessionId: string, userId: string, paymentId: string, paymentStatus: string, status: string): Promise<void>;
}

export interface IPaySessionWithGatewayUseCase {
	execute(sessionId: string, userId: string, paymentId: string, paymentStatus: string, status: string): Promise<void>;
}

export interface IStartSessionUseCase {
	execute(sessionId: string): Promise<void>;
}

export interface ICancelSessionUseCase {
	execute(sessionId: string, userId: string): Promise<ISessionUserDTO>;
}

export interface IVerifySessionPaymentUseCase {
	execute(sessionId: string, userId: string): Promise<boolean>;
}

export interface ICreateSessionPaymentOrderUseCase {
	execute(sessionId: string, userId: string): Promise<string>;
}

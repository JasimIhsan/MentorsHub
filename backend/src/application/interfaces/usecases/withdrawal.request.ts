import { IWithdrawalRequestDTO } from "../../dtos/withdrawal.request.dto";

export interface IRequestWithdrawalUseCase {
	execute(userId: string, amount: number): Promise<IWithdrawalRequestDTO>;
}

export interface IGetWithdrawalRequestsUseCase {
	execute(input: { page: number; limit: number; status: string; searchTerm?: string }): Promise<IWithdrawalRequestDTO[]>;
}

export interface IWithdrawPaymentCreateOrderUseCase {
	execute(requestId: string): Promise<string>;
}

export interface IApproveWithdrawalRequestUseCase {
	execute(requestId: string, paymentId: string): Promise<IWithdrawalRequestDTO> 
}
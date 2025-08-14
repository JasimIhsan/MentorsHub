import { IWithdrawalRequestDTO } from "../../dtos/withdrawal.request.dto";

export interface IRequestWithdrawalUseCase {
	execute(userId: string, amount: number): Promise<IWithdrawalRequestDTO>;
}

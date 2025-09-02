import { WithdrawalRequestEntity } from "../entities/wallet/wallet.withdrawel.request.entity";

export interface IWithdrawalRequestRepository {
	create(entity: WithdrawalRequestEntity): Promise<WithdrawalRequestEntity>;
	findById(id: string): Promise<WithdrawalRequestEntity | null>;
	findByUserId(userId: string): Promise<WithdrawalRequestEntity[] | null>;
	findPendingByUserId(userId: string): Promise<WithdrawalRequestEntity | null>;
	find(input: { page: number; limit: number; status: string; searchTerm?: string }): Promise<{requests: WithdrawalRequestEntity[], totalCount: number}>;
	update(entity: WithdrawalRequestEntity): Promise<WithdrawalRequestEntity | null>;
	delete(id: string): Promise<void>;
}

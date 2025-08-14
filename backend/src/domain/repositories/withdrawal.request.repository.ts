import { WithdrawalRequestEntity } from "../entities/wallet/wallet.withdrawel.request.entity";

export interface IWithdrawalRequestRepository {
	create(entity: WithdrawalRequestEntity): Promise<WithdrawalRequestEntity>;
	findById(id: string): Promise<WithdrawalRequestEntity | null>;
	findByUserId(userId: string): Promise<WithdrawalRequestEntity | null>;
	update(entity: WithdrawalRequestEntity): Promise<WithdrawalRequestEntity | null>;
	delete(id: string): Promise<void>;
}

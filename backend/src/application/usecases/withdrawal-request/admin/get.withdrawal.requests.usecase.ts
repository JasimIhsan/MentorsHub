import { UserEntity } from "../../../../domain/entities/user.entity";
import { WithdrawalRequestEntity } from "../../../../domain/entities/wallet/wallet.withdrawel.request.entity";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { IWithdrawalRequestRepository } from "../../../../domain/repositories/withdrawal.request.repository";
import { IWithdrawalRequestDTO, mapToWithdrawalRequestDTO } from "../../../dtos/withdrawal.request.dto";
import { WithdrawalRequestStatusEnum } from "../../../interfaces/enums/withdrawel.request.status.enum";
import { IGetWithdrawalRequestsUseCase } from "../../../interfaces/usecases/withdrawal.request";

export class GetWithdrawalRequestsUseCase implements IGetWithdrawalRequestsUseCase {
	constructor(private readonly _withdrawalRequestRepo: IWithdrawalRequestRepository, private readonly _userRepo: IUserRepository) {}

	async execute(input: { page: number; limit: number; status: string; searchTerm?: string }): Promise<{requests: IWithdrawalRequestDTO[], totalCount: number}> {
		const result = await this._withdrawalRequestRepo.find(input);
		const withdrawalRequests = result.requests;

		const userIds = withdrawalRequests.map((r) => r.userId);

		const users = await this._userRepo.findUsersByIds(userIds);

		const usersMap = new Map<string, UserEntity>();

		users.forEach((u) => usersMap.set(u.id!, u));

		return { requests: withdrawalRequests.map((r) => mapToWithdrawalRequestDTO(r, usersMap.get(r.userId))), totalCount: result.totalCount };
	}
}

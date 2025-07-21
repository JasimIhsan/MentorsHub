import { IAdminRepository } from "../../../domain/repositories/admin.repository";
import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWalletTransactionDTO, mapToTransactionDTO } from "../../dtos/wallet.transation.dto";
import { RoleEnum } from "../../interfaces/enums/role.enum";
import { IGetTransactionsUsecase } from "../../interfaces/wallet";

export class GetTransactionsUseCase implements IGetTransactionsUsecase {
	constructor(
		private walletRepo: IWalletRepository, //
		private userRepo: IUserRepository,
		private sessionRepo: ISessionRepository,
		private adminRepo: IAdminRepository
	) {}

	async execute(userId: string, role: string, page: number, limit: number, filter: Record<string, any> = {}): Promise<{ data: IWalletTransactionDTO[]; total: number }> {
		const { data: transactions, total } = await this.walletRepo.getTransactionsByUser(userId, page, limit, filter);

		const userIds: Set<string> = new Set();
		const adminIds: Set<string> = new Set();
		const sessionIds: Set<string> = new Set();

		// Identify unique user/admin/session IDs involved in the transactions
		transactions.forEach((tx) => {
			// From
			if ((tx.fromRoleEnum === RoleEnum.USER || tx.fromRoleEnum === RoleEnum.MENTOR) && tx.fromUserId) {
				userIds.add(tx.fromUserId);
			} else if (tx.fromRoleEnum === RoleEnum.ADMIN && tx.fromUserId) {
				adminIds.add(tx.fromUserId);
			}

			// To
			if ((tx.toRoleEnum === RoleEnum.USER || tx.toRoleEnum === RoleEnum.MENTOR) && tx.toUserId) {
				userIds.add(tx.toUserId);
			} else if (tx.toRoleEnum === RoleEnum.ADMIN && tx.toUserId) {
				adminIds.add(tx.toUserId);
			}

			// Session
			if (tx.sessionId) {
				sessionIds.add(tx.sessionId.toString());
			}
		});

		// Fetch required users, admins, and sessions
		const [users, admins, sessions] = await Promise.all([this.userRepo.findUsersByIds([...userIds]), this.adminRepo.findByIds([...adminIds]), this.sessionRepo.findByIds([...sessionIds])]);

		// Create ID-based lookup maps
		const allUserMap = new Map<string, any>();
		users.forEach((u) => allUserMap.set(u.id!, u));
		admins.forEach((a) => allUserMap.set(a.id!, a));

		const sessionMap = new Map(sessions.map((s) => [s.id, s]));

		// Convert transactions to DTOs
		const dtos = transactions.flatMap((tx) => {
			const toUser = allUserMap.get(tx.toUserId.toString());
			if (!toUser) return [];

			const fromUser = tx.fromUserId ? allUserMap.get(tx.fromUserId.toString()) : null;
			const session = tx.sessionId ? sessionMap.get(tx.sessionId.toString()) : null;

			return [mapToTransactionDTO(tx, fromUser ?? null, toUser, session ?? null)];
		});

		return { data: dtos, total };
	}
}

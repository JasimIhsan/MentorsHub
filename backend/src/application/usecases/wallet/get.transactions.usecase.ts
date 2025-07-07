import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository";
import { IWalletTransactionDTO, mapToTransactionDTO } from "../../dtos/wallet.transation.dto";
import { IGetTransactionsUsecase } from "../../interfaces/wallet";

export class GetTransactionsUseCase implements IGetTransactionsUsecase {
	constructor(private walletRepo: IWalletRepository, private userRepo: IUserRepository, private sessionRepo: ISessionRepository) {}

	async execute(userId: string, role: string, page: number, limit: number, filter: Record<string, any> = {}): Promise<{ data: IWalletTransactionDTO[]; total: number }> {
		// 1️⃣ fetch transactions (entities only)
		const { data: transactions, total } = await this.walletRepo.getTransactionsByUser(userId, page, limit, filter);

		// 2️⃣ collect all distinct IDs we’ll need
		const userIdSet = new Set<string>();
		const sessionIdSet = new Set<string>();

		transactions.forEach((tx) => {
			if (tx.fromUserId) userIdSet.add(tx.fromUserId.toString());
			userIdSet.add(tx.toUserId.toString());
			if (tx.sessionId) sessionIdSet.add(tx.sessionId.toString());
		});

		// 3️⃣ batch‑load users & sessions
		const [users, sessions] = await Promise.all([this.userRepo.findUsersByIds([...userIdSet]), this.sessionRepo.findSessionsByIds([...sessionIdSet])]);

		// 4️⃣ index them for O(1) lookup
		const userMap = new Map(users.map((u) => [u.id!, u]));
		const sessionMap = new Map(sessions.map((s) => [s.getId()!, s]));

		// 5️⃣ build DTOs in a single synchronous pass
		const dtos = transactions.flatMap((tx) => {
			const toUser = userMap.get(tx.toUserId.toString());
			if (!toUser) return []; // graceful skip

			const fromUser = tx.fromUserId ? userMap.get(tx.fromUserId.toString()) : null;
			const session = tx.sessionId ? sessionMap.get(tx.sessionId.toString()) : null;

			return [mapToTransactionDTO(tx, fromUser ?? null, toUser, session ?? null)];
		});

		return { data: dtos, total };
	}
}

import { IAdminRepository } from "../../../../domain/repositories/admin.repository";
import { ISessionRepository } from "../../../../domain/repositories/session.repository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { AdminStatsResponse, IGetAdminStatsUseCase } from "../../../interfaces/admin/admin.dashboard.interface";



export class GetAdminStatsUseCase implements IGetAdminStatsUseCase {
	constructor(private readonly _adminRepository: IAdminRepository, private readonly _userRepo: IUserRepository, private readonly _sessionRepo: ISessionRepository, private readonly _walletRepo: IWalletRepository) {}

	async execute(adminId: string): Promise<AdminStatsResponse> {
		try {
			const adminEntity = await this._adminRepository.findAdminById(adminId);
			if (!adminEntity) throw new Error("Admin not found");

			const [totalUsers, totalMentors, totalSessions, totalRevenue] = await Promise.all([this._userRepo.countUsers(), this._userRepo.countMentors(), this._sessionRepo.countSessions(), this._walletRepo.adminRevenue(adminEntity.id!)]);

			return { totalUsers, totalMentors, totalSessions, totalRevenue };
		} catch (error) {
			if (error instanceof Error) throw new Error(`Failed to fetch admin stats: ${error.message}`);
			throw new Error("Failed to fetch admin stats");
		}
	}
}

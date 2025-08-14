import { IAdminRepository } from "../../../../domain/repositories/admin.repository";
import { IWalletRepository } from "../../../../domain/repositories/wallet.repository";
import { IPlatformRevenueChartDataDTO } from "../../../dtos/admin.dashboard.dtos";
import { IGetPlatformRevenueChartDataUseCase } from "../../../interfaces/usecases/admin/admin.dashboard.interface";

export class GetPlatformRevenueChartDataUseCase implements IGetPlatformRevenueChartDataUseCase {
	constructor(private readonly _walletRepo: IWalletRepository, private readonly _adminRepo: IAdminRepository) {}

	async execute(adminId: string, months: number): Promise<IPlatformRevenueChartDataDTO[]> {
		try {
			const adminEntity = await this._adminRepo.findAdminById(adminId);
			if (!adminEntity) throw new Error("Admin not found");

			const revenueData = await this._walletRepo.revenueChartData(adminId, months);
			return revenueData.map((revenue) => {
				return {
					name: revenue.name,
					total: revenue.total,
				};
			});
		} catch (error) {
			if (error instanceof Error) throw new Error(`Failed to fetch platform revenue chart data: ${error.message}`);
			throw new Error("Failed to fetch platform revenue chart data");
		}
	}
}

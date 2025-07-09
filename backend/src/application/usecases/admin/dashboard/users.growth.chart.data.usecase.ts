import { IAdminRepository } from "../../../../domain/repositories/admin.repository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { IGetUsersGrowthChartDataUseCase } from "../../../interfaces/admin/admin.dashboard.interface";

export class GetUsersGrowthChartDataUseCase implements IGetUsersGrowthChartDataUseCase {
	constructor(private readonly _adminRepo: IAdminRepository, private readonly _userRepo: IUserRepository) {}

	execute(adminId: string, months: number): Promise<{ users: number; mentors: number; name: string }[]> {
		try {
			const adminEntity = this._adminRepo.findAdminById(adminId);
			if (!adminEntity) throw new Error("Admin not found");

			const usersGrowthData = this._userRepo.userGrowthChartData(months);

			return usersGrowthData;
		} catch (error) {
			if (error instanceof Error) throw new Error(`Failed to fetch users growth chart data: ${error.message}`);
			throw new Error("Failed to fetch users growth chart data");
		}
	}
}

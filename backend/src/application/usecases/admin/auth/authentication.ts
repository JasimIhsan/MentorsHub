import { IAdminRepository } from "../../../../domain/repositories/admin.repository";
import { AdminEntity } from "../../../../domain/entities/admin.entity";
import { comparePassword } from "../../../../infrastructure/utils/compare.password";
import { AdminDTO } from "../../../dtos/admin.dtos";
import { IAdminAuthUsecase } from "../../../interfaces/admin/admin.auth.interface";
import { ITokenService } from "../../../interfaces/user/token.service.interface";

export class AdminLoginUsecase implements IAdminAuthUsecase {
	constructor(private adminAuthRepo: IAdminRepository, private tokenService: ITokenService) {}
	async execute(username: string, password: string): Promise<{ admin: AdminDTO; refreshToken: string; accessToken: string }> {
		try {
			const admin = await this.adminAuthRepo.findAdminByUsername(username);
			if (!admin) throw new Error("Admin not found");

			const isPasswordValid = await comparePassword(password, admin.password);
			if (!isPasswordValid) throw new Error("Invalid admin credentials");

			const accessToken = this.tokenService.generateAccessToken(admin.id, true);
			const refreshToken = this.tokenService.generateRefreshToken(admin.id, true);

			return { admin, refreshToken, accessToken };
		} catch (error) {
			// console.error("Admin authentication error: ", error);
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("An error occurred during admin authentication");
		}
	}
}

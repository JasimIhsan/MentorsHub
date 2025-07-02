import { IAdminRepository } from "../../../../domain/repositories/admin.repository";
import { comparePassword } from "../../../../infrastructure/utils/compare.password";
import { IAdminDTO, mapToAdminDTO } from "../../../dtos/admin.dtos";
import { IAdminAuthUsecase } from "../../../interfaces/admin/admin.auth.interface";
import { ITokenService } from "../../../interfaces/user/token.service.interface";

export class AdminLoginUsecase implements IAdminAuthUsecase {
	constructor(private adminAuthRepo: IAdminRepository, private tokenService: ITokenService) {}
	async execute(username: string, password: string): Promise<{ admin: IAdminDTO; refreshToken: string; accessToken: string }> {
		try {
			const adminEntity = await this.adminAuthRepo.findAdminByUsername(username);
			if (!adminEntity) throw new Error("Admin not found");

			const isPasswordValid = await comparePassword(password, adminEntity.password);
			if (!isPasswordValid) throw new Error("Invalid adminEntity credentials");

			const accessToken = this.tokenService.generateAccessToken(adminEntity.id!, true);
			const refreshToken = this.tokenService.generateRefreshToken(adminEntity.id!, true);

			const admin = mapToAdminDTO(adminEntity);
			
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

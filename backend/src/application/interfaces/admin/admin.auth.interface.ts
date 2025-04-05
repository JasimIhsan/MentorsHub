import { AdminDTO } from "../../dtos/admin.dtos";

export interface IAdminAuthUsecase {
	execute(username: string, password: string): Promise<{ admin: AdminDTO; refreshToken: string; accessToken: string }>;
}

import { IAdminDTO } from "../../../dtos/admin.dtos";

export interface IAdminAuthUsecase {
	execute(username: string, password: string): Promise<{ admin: IAdminDTO; refreshToken: string; accessToken: string }>;
}

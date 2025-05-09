import { AdminEntity } from "../entities/admin.entity";
import { AdminDTO } from "../../application/dtos/admin.dtos";

export interface IAdminRepository {
	createAdmin(admin: AdminEntity): Promise<AdminEntity>;
	findAdminById(id: string): Promise<AdminDTO | null>;
	findAdminByUsername(username: string): Promise<AdminDTO | null>;
	save(admin: AdminEntity): Promise<void>;
}

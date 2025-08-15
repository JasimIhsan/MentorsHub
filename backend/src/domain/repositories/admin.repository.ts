import { AdminEntity } from "../entities/admin.entity";

export interface IAdminRepository {
	createAdmin(admin: AdminEntity): Promise<AdminEntity>;
	findAdminById(id: string): Promise<AdminEntity | null>;
	findByIds(ids: string[]): Promise<AdminEntity[]>;
	findAdminByUsername(username: string): Promise<AdminEntity | null>;
	save(admin: AdminEntity): Promise<void>;
}

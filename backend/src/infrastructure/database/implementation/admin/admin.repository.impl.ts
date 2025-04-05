import { AdminDTO } from "../../../../application/dtos/admin.dtos";
import { IAdminRepository } from "../../../../domain/dbrepository/admin.repository";
import { AdminEntity } from "../../../../domain/entities/admin.entity";
import { AdminModel } from "../../models/admin/admin.model";

export class AdminRepositoryImpl implements IAdminRepository {
	async createAdmin(admin: AdminEntity): Promise<any> {
		const adminModel = new AdminModel(admin);
		const savedAdmin = await adminModel.save();
		const adminEntity = AdminEntity.fromDBDocument(savedAdmin);
		return AdminDTO.fromEntity(adminEntity);
	}

	async findAdminById(id: string): Promise<any | null> {
		const adminModel = await AdminModel.findById(id);
		if (adminModel) {
			const adminEntity = AdminEntity.fromDBDocument(adminModel);
			return AdminDTO.fromEntity(adminEntity);
		}
		return null;
	}

	async findAdminByUsername(username: string): Promise<any | null> {
		const adminModel = await AdminModel.findOne({ username });
		if (adminModel) {
			const adminEntity = AdminEntity.fromDBDocument(adminModel);
			return AdminDTO.fromEntity(adminEntity);
		}
		return null;
	}

	async save(admin: AdminEntity): Promise<void> {
		const adminModel = new AdminModel(admin);
		await adminModel.save();
	}
}

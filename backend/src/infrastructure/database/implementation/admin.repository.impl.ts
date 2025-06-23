import { AdminDTO } from "../../../application/dtos/admin.dtos";
import { IAdminRepository } from "../../../domain/repositories/admin.repository";
import { AdminEntity } from "../../../domain/entities/admin.entity";
import { AdminModel } from "../models/admin/admin.model";
import { handleExceptionError } from "../../utils/handle.exception.error";

export class AdminRepositoryImpl implements IAdminRepository {
	async createAdmin(admin: AdminEntity): Promise<AdminEntity> {
		try {
			const adminModel = new AdminModel(admin);
			const savedAdmin = await adminModel.save();
			return AdminEntity.fromDBDocument(savedAdmin);
		} catch (error) {
			return handleExceptionError(error, "Error creating admin");
		}
	}

	async findAdminById(id: string): Promise<AdminDTO | null> {
		try {
			const adminModel = await AdminModel.findById(id);
			if (!adminModel) return null;

			const adminEntity = AdminEntity.fromDBDocument(adminModel);
			return AdminDTO.fromEntity(adminEntity);
		} catch (error) {
			return handleExceptionError(error, "Error finding admin by ID");
		}
	}

	async findAdminByUsername(username: string): Promise<AdminDTO | null> {
		try {
			const adminModel = await AdminModel.findOne({ username });
			if (!adminModel) return null;

			const adminEntity = AdminEntity.fromDBDocument(adminModel);
			return AdminDTO.fromEntity(adminEntity);
		} catch (error) {
			return handleExceptionError(error, "Error finding admin by username");
		}
	}

	async save(admin: AdminEntity): Promise<void> {
		try {
			const adminModel = new AdminModel(admin);
			await adminModel.save();
		} catch (error) {
			return handleExceptionError(error, "Error saving admin");
		}
	}
}

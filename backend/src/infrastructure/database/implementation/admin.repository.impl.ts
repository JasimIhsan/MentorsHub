import { IAdminRepository } from "../../../domain/repositories/admin.repository";
import { AdminEntity } from "../../../domain/entities/admin.entity";
import { AdminModel } from "../models/admin/admin.model";
import { handleExceptionError } from "../../utils/handle.exception.error";

export class AdminRepositoryImpl implements IAdminRepository {
	async createAdmin(admin: AdminEntity): Promise<AdminEntity> {
		try {
			const adminModel = new AdminModel(admin);
			const savedAdmin = await adminModel.save();
			return new AdminEntity(savedAdmin);
		} catch (error) {
			return handleExceptionError(error, "Error creating admin");
		}
	}

	async findAdminById(id: string): Promise<AdminEntity | null> {
		try {
			const adminModel = await AdminModel.findById(id);
			if (!adminModel) return null;

			return new AdminEntity(adminModel);
		} catch (error) {
			return handleExceptionError(error, "Error finding admin by ID");
		}
	}

	async findByIds(ids: string[]): Promise<AdminEntity[]> {
		try {
			const admins = await AdminModel.find({ _id: { $in: ids } });
			return admins.map((admin) => new AdminEntity(admin));
		} catch (error) {
			return handleExceptionError(error, "Error finding admin by IDs");
		}
	}

	async findAdminByUsername(username: string): Promise<AdminEntity | null> {
		try {
			const adminModel = await AdminModel.findOne({ username });
			if (!adminModel) return null;

			return new AdminEntity(adminModel);
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

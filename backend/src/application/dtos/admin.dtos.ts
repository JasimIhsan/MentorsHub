import { AdminEntity } from "../../domain/entities/admin.entity";

export interface IAdminDTO {
	id: string;
	name: string;
	avatar: string;
	username: string;
	password: string;
	isSuperAdmin: boolean;
}

export function mapToAdminDTO(entity: AdminEntity): IAdminDTO {
	return {
		id: entity.id!,
		name: entity.name || "",
		avatar: entity.avatar || "",
		username: entity.username,
		password: entity.password,
		isSuperAdmin: entity.isSuperAdmin,
	};
}

import { AdminEntity } from "../../domain/entities/admin.entity";

export interface IAdminDTO {
	id: string;
	name: string;
	avatar: string;
	username: string;
	password: string;
	isSuperAdmin: boolean;
}

export class AdminDTO {
	id: string;
	username: string;
	name: string;
	avatar: string;
	password: string;
	isSuperAdmin: boolean;

	constructor(id: string, name: string, username: string, password: string, isSuperAdmin: boolean, avatar?: string) {
		this.id = id;
		this.username = username;
		this.name = name;
		this.avatar = avatar || "";
		this.password = password;
		this.isSuperAdmin = isSuperAdmin;
	}

	static fromEntity(admin: AdminEntity): AdminDTO {
		return new AdminDTO(admin.getId() || "", admin.getProfile().name || "", admin.getUsername(), admin.getPassword(), admin.getIsSuperAdmin(), admin.getProfile().avatar);
	}
}

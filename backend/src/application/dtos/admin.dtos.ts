import { AdminEntity } from "../../domain/entities/admin.entity";

export interface IAdminDTO {
	id: string;
	username: string;
	password: string;
	isSuperAdmin: boolean;
}

export class AdminDTO {
	id: string;
	username: string;
	password: string;
	isSuperAdmin: boolean;

	constructor(id: string, username: string, password: string, isSuperAdmin: boolean) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.isSuperAdmin = isSuperAdmin;
	}

	static fromEntity(admin: AdminEntity): AdminDTO {
		return new AdminDTO(admin.getId() || "", admin.getUsername(), admin.getPassword(), admin.getIsSuperAdmin());
	}
}

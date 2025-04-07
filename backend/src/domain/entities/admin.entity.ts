import bcrypt from "bcrypt";

interface AdminInterface {
	id?: string;
	name?: string;
	username: string;
	password: string;
	isSuperAdmin: boolean;
	avatar?: string;
}

export class AdminEntity {
	private id?: string;
	private name?: string;
	private username: string;
	private password: string;
	private isSuperAdmin: boolean;
	private avatar?: string;
	constructor(admin: AdminInterface) {
		this.id = admin.id;
		this.name = admin.name;
		this.username = admin.username;
		this.password = admin.password;
		this.isSuperAdmin = admin.isSuperAdmin;
		this.avatar = admin.avatar;
	}

	static async createAdmin(admin: AdminInterface) {
		const hashedPassword = await bcrypt.hash(admin.password, 10);
		return new AdminEntity({
			...admin,
			password: hashedPassword,
		});
	}

	static fromDBDocument(doc: AdminInterface): AdminEntity {
		return new AdminEntity({
			id: doc.id,
			name: doc.name,
			avatar: doc.avatar,
			username: doc.username,
			password: doc.password,
			isSuperAdmin: doc.isSuperAdmin,
		});
	}

	async comparePassword(password: string): Promise<boolean> {
		return await bcrypt.compare(password, this.password);
	}

	getProfile(): AdminInterface {
		return {
			id: this.id,
			name: this.name,
			avatar: this.avatar,
			username: this.username,
			password: this.password,
			isSuperAdmin: this.isSuperAdmin,
		};
	}

	getId(): string | undefined {
		return this.id;
	}

	getUsername(): string {
		return this.username;
	}

	getPassword(): string {
		return this.password;
	}

	getIsSuperAdmin(): boolean {
		return this.isSuperAdmin;
	}
}

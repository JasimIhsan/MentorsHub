import bcrypt from "bcrypt";

interface AdminInterface {
	id?: string;
	username: string;
	password: string;
	isSuperAdmin: boolean;
}

export class AdminEntity {
	private id?: string;
	private username: string;
	private password: string;
	private isSuperAdmin: boolean;
	constructor(admin: AdminInterface) {
		this.id = admin.id;
		this.username = admin.username;
		this.password = admin.password;
		this.isSuperAdmin = admin.isSuperAdmin;
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

import bcrypt from "bcrypt";

interface AdminInterface {
	id?: string;
	name?: string;
	username: string;
	password: string;
	role: "admin" | "super-admin";
	avatar?: string;
}

export class AdminEntity {
	private id?: string;
	private name?: string;
	private username: string;
	private password: string;
	private role: "admin" | "super-admin";
	private avatar?: string;
	constructor(admin: AdminInterface) {
		this.id = admin.id;
		this.name = admin.name;
		this.username = admin.username;
		this.password = admin.password;
		this.role = admin.role === "admin" ? "admin" : "super-admin";
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
			role: doc.role,
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
			role: this.role,
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
		return this.role === "super-admin";
	}
}

export interface AdminProps {
	id?: string;
	name?: string;
	username: string;
	password: string;
	role: "admin" | "super-admin";
	avatar?: string;
}

export class AdminEntity {
	private readonly _id?: string;
	private readonly _name?: string;
	private readonly _username: string;
	private _password: string;
	private readonly _role: "admin" | "super-admin";
	private readonly _avatar?: string;

	constructor(props: AdminProps) {
		this._id = props.id;
		this._name = props.name;
		this._username = props.username;
		this._password = props.password;
		this._role = props.role;
		this._avatar = props.avatar;
	}

	// 👇 Public Getters
	get id(): string | undefined {
		return this._id;
	}

	get name(): string | undefined {
		return this._name;
	}

	get username(): string {
		return this._username;
	}

	get password(): string {
		return this._password;
	}

	get role(): "admin" | "super-admin" {
		return this._role;
	}

	get avatar(): string | undefined {
		return this._avatar;
	}

	get isSuperAdmin(): boolean {
		return this._role === "super-admin";
	}

	// 🔒 You can allow password update
	updatePassword(newPassword: string) {
		this._password = newPassword;
	}
}

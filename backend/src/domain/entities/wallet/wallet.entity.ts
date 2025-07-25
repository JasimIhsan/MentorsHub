export class WalletEntity {
	private _id?: string;
	private _userId: string;
	private _role: string;
	private _balance: number;
	private _createdAt?: Date;
	private _updatedAt?: Date;

	constructor(props: { _id?: string; userId: string; role: string; balance: number; createdAt?: Date; updatedAt?: Date }) {
		this._id = props._id;
		this._userId = props.userId;
		this._role = props.role;
		this._balance = props.balance;
		this._createdAt = props.createdAt;
		this._updatedAt = props.updatedAt;
	}

	// ✅ Getters
	get id(): string | undefined {
		return this._id;
	}

	get userId(): string {
		return this._userId;
	}

	get role(): string {
		return this._role;
	}

	get balance(): number {
		return this._balance;
	}

	get createdAt(): Date | undefined {
		return this._createdAt;
	}

	get updatedAt(): Date | undefined {
		return this._updatedAt;
	}

	credit(amount: number): void {
		this._balance += amount;
	}

	debit(amount: number): void {
		if (amount > this._balance) {
			throw new Error("Insufficient balance");
		}
		this._balance -= amount;
	}

	toObject() {
		return {
			_id: this._id,
			userId: this._userId,
			role: this._role,
			balance: this._balance,
			createdAt: this._createdAt,
			updatedAt: this._updatedAt,
		};
	}

	static fromDBDocument(doc: any): WalletEntity {
		return new WalletEntity({
			_id: doc._id?.toString(),
			userId: doc.userId,
			role: doc.role,
			balance: doc.balance,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}

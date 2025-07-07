export type WithdrawalStatus = "pending" | "approved" | "rejected" | "completed";

export class WithdrawalRequestEntity {
	private _id?: string;
	private mentorId: string;
	private amount: number;
	private status: WithdrawalStatus;
	private createdAt?: Date;
	private updatedAt?: Date;

	constructor(props: { _id?: string; mentorId: string; amount: number; status?: WithdrawalStatus; createdAt?: Date; updatedAt?: Date }) {
		this._id = props._id;
		this.mentorId = props.mentorId;
		this.amount = props.amount;
		this.status = props.status ?? "pending";
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
	}

	// ✅ Getters
	get id(): string | undefined {
		return this._id;
	}

	get mentor(): string {
		return this.mentorId;
	}

	get withdrawalAmount(): number {
		return this.amount;
	}

	get withdrawalStatus(): WithdrawalStatus {
		return this.status;
	}

	get created(): Date | undefined {
		return this.createdAt;
	}

	get updated(): Date | undefined {
		return this.updatedAt;
	}

	// ✅ Domain actions
	approve(): void {
		this.status = "approved";
	}

	reject(): void {
		this.status = "rejected";
	}

	complete(): void {
		this.status = "completed";
	}

	// ✅ For saving or serialization
	toObject() {
		return {
			_id: this._id,
			mentorId: this.mentorId,
			amount: this.amount,
			status: this.status,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}

	static fromDBDocument(doc: any): WithdrawalRequestEntity {
		return new WithdrawalRequestEntity({
			_id: doc._id?.toString(),
			mentorId: doc.mentorId,
			amount: doc.amount,
			status: doc.status,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}

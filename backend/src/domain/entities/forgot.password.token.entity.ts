import { ObjectId } from "mongoose";

export interface IForgotPasswordTokens {
	userId: string;
	token: string;
	expiresAt: Date;

	createdAt?: Date;
	updatedAt?: Date | null;
}

export class ForgotPasswordTokenEntity {
	private userId: string;
	private token: string;
	private expiresAt: Date;
	private createdAt: Date;
	private updatedAt: Date | null;

	constructor(data: IForgotPasswordTokens) {
		this.userId = data.userId;
		this.token = data.token;
		this.expiresAt = new Date(data.expiresAt);
		this.createdAt = data.createdAt ?? new Date();
		this.updatedAt = data.updatedAt ?? null;
	}

	static create(userId: string, token: string, expiresInMinutes: number): ForgotPasswordTokenEntity {
		const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
		return new ForgotPasswordTokenEntity({ userId, token, expiresAt });
	}

	isExpired(): boolean {
		return Date.now() > this.expiresAt.getTime();
	}

	toDBDocument(): IForgotPasswordTokens {
		return {
			userId: this.userId,
			token: this.token,
			expiresAt: this.expiresAt,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}

	static fromDBDocument(doc: IForgotPasswordTokens): ForgotPasswordTokenEntity {
		return new ForgotPasswordTokenEntity({
			userId: doc.userId.toString(),
			token: doc.token,
			expiresAt: new Date(doc.expiresAt),
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}

	getUserId(): string {
		return this.userId;
	}

	getToken(): string {
		return this.token;
	}

	getExpires(): Date {
		return this.expiresAt;
	}

	getCreatedAt(): Date {
		return this.createdAt;
	}

	getUpdatedAt(): Date | null {
		return this.updatedAt;
	}
}

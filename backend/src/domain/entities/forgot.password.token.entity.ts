export interface ForgotPasswordTokenProps {
	userId: string;
	token: string;
	expiresAt: Date;
}

export class ForgotPasswordTokenEntity {
	private readonly _userId: string;
	private readonly _token: string;
	private readonly _expiresAt: Date;

	private constructor(props: ForgotPasswordTokenProps) {
		this._userId = props.userId;
		this._token = props.token;
		this._expiresAt = props.expiresAt;
	}


	static create(userId: string, token: string, ttlMinutes: number): ForgotPasswordTokenEntity {
		const expiresAt = new Date(Date.now() + ttlMinutes * 60_000);
		return new ForgotPasswordTokenEntity({ userId, token, expiresAt });
	}


	static restore(props: ForgotPasswordTokenProps): ForgotPasswordTokenEntity {
		return new ForgotPasswordTokenEntity(props);
	}

	// ✅ Domain logic
	isExpired(now: Date = new Date()): boolean {
		return now > this._expiresAt;
	}

	// ✅ Use these like: tokenEntity.userId, tokenEntity.token
	get userId(): string {
		return this._userId;
	}

	get token(): string {
		return this._token;
	}

	get expiresAt(): Date {
		return this._expiresAt;
	}
}

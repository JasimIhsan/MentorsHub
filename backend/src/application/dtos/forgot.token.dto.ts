
export interface IForgotUserDTO {
	_id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: "user" | "mentor";
	avatar: string | null;
	isVerified: boolean | null;
}

export interface IForgotPasswordTokenDTO {
	token: string;
	expiresAt: Date;
	user: IForgotUserDTO;
}

export class ForgotPasswordTokenDTO {
	token: string;
	expiresAt: Date;
	user: IForgotUserDTO;

	constructor(data: IForgotPasswordTokenDTO) {
		this.token = data.token;
		this.expiresAt = data.expiresAt;
		this.user = data.user;
	}

	static fromEntity(tokenDoc: any): ForgotPasswordTokenDTO {
		return new ForgotPasswordTokenDTO({
			token: tokenDoc.token,
			expiresAt: tokenDoc.expiresAt,
			user: {
				_id: tokenDoc.userId._id.toString(),
				email: tokenDoc.userId.email,
				firstName: tokenDoc.userId.firstName,
				lastName: tokenDoc.userId.lastName,
				role: tokenDoc.userId.role,
				avatar: tokenDoc.userId.avatar,
				isVerified: tokenDoc.userId.isVerified,
			},
		});
	}
}

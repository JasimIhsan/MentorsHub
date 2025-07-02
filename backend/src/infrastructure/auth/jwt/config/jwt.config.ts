export class TokenConfig {
	static ACCESS_TOKEN_SECRET: string;
	static REFRESH_TOKEN_SECRET: string;

	static init(secrets: { access: string; refresh: string }) {
		this.ACCESS_TOKEN_SECRET = secrets.access;
		this.REFRESH_TOKEN_SECRET = secrets.refresh;
	}
}

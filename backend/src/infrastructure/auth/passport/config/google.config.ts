export class GoogleConfig {
	static GOOGLE_CLIENT_ID: string;
	static GOOGLE_CLIENT_SECRET: string;

	static init(payload: { GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string }) {
		this.GOOGLE_CLIENT_ID = payload.GOOGLE_CLIENT_ID;
		this.GOOGLE_CLIENT_SECRET = payload.GOOGLE_CLIENT_SECRET;
	}
}

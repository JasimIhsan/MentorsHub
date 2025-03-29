export interface IEmailService {
	sendPasswordResetEmail(email: string, token: string, username: string): Promise<void>;
}

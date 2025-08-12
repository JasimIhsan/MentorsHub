export interface IUserCancelSessionRefundUseCase {
	execute(sessionId: string, userId: string): Promise<void>;
}

export interface ICancelSessionRefundUseCase {
	execute(sessionId: string, userId: string): Promise<void>;
}

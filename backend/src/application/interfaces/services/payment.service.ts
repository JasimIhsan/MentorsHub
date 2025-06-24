export interface IPaymentGateway {
	createOrder(amount: number, receipt: string, notes: Record<string, any>): Promise<any>;
}

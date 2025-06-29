import Razorpay from "razorpay";
import { IPaymentGateway } from "../../../application/interfaces/services/payment.service";
import { razorpayClient } from "./razorpay.service.config";

export class RazorpayGatewayImpl implements IPaymentGateway {
	async createOrder(amount: number, receipt: string, notes: Record<string, any>): Promise<any> {
		try {
			const order = await razorpayClient.orders.create({
				amount,
				currency: "INR",
				receipt,
				notes,
			});
			console.log(`order : `, order);

			return order;
		} catch (error) {
			console.log(`Error from razorpay impl : `, error);
			throw new Error(error as string);
		}
	}
}

// src/infrastructure/services/payment/razorpay.gateway.impl.ts
import Razorpay from "razorpay";
import { RazorpayConfig } from "./config/razorpay.config";
import { IPaymentGateway } from "../../../application/interfaces/services/payment.service";

export class RazorpayGatewayImpl implements IPaymentGateway {
	private client: Razorpay;

	constructor() {
		if (!RazorpayConfig.RAZORPAY_KEY || !RazorpayConfig.RAZORPAY_SECRET) {
			throw new Error("RazorpayConfig is not initialized");
		}

		this.client = new Razorpay({
			key_id: RazorpayConfig.RAZORPAY_KEY,
			key_secret: RazorpayConfig.RAZORPAY_SECRET,
		});
	}

	async createOrder(amount: number, receipt: string, notes: Record<string, any>): Promise<any> {
		try {
			return await this.client.orders.create({
				amount,
				currency: "INR",
				receipt,
				notes,
			});
		} catch (error) {
			console.error("Error in RazorpayGatewayImpl:", error);
			throw error;
		}
	}
}

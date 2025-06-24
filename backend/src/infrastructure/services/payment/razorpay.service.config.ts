import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

export const razorpayClient = new Razorpay({
	key_id: process.env.RAZORPAY_KEY!,
	key_secret: process.env.RAZORPAY_SECRET!,
});

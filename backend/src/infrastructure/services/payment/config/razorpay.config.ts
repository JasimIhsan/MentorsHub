export class RazorpayConfig {
	static RAZORPAY_KEY: string;
	static RAZORPAY_SECRET: string;

	static init(secrets: { RAZORPAY_KEY: string; RAZORPAY_SECRET: string }) {
		this.RAZORPAY_KEY = secrets.RAZORPAY_KEY;
		this.RAZORPAY_SECRET = secrets.RAZORPAY_SECRET;
	}
}

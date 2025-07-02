import { TokenConfig } from "./infrastructure/auth/jwt/config/jwt.config";
import { CloudinaryConfig } from "./infrastructure/cloud/cloudinary/config/cloudinary.config";
import { S3Config } from "./infrastructure/cloud/S3 bucket/config/s3.config";
import { RazorpayConfig } from "./infrastructure/services/payment/config/razorpay.config";
import { GoogleConfig } from "./infrastructure/auth/passport/config/google.config";
import { kmsService } from "./infrastructure/composer";

export async function loadSecrets() {
	// JWT
	const access = await kmsService.getSecret("mentorshub/prod/jwt", "JWT_ACCESS_TOKEN");
	const refresh = await kmsService.getSecret("mentorshub/prod/jwt", "JWT_REFRESH_TOKEN");
	TokenConfig.init({ access, refresh });

	// Cloudinary
	const cloudinaryName = await kmsService.getSecret("mentorshub/prod/cloudinary", "CLOUDINARY_NAME");
	const cloudinaryAPIKey = await kmsService.getSecret("mentorshub/prod/cloudinary", "CLOUDINARY_API_KEY");
	const cloudinaryAPISecret = await kmsService.getSecret("mentorshub/prod/cloudinary", "CLOUDINARY_API_SECRET");
	CloudinaryConfig.init({ CLOUDINARY_CLOUD_NAME: cloudinaryName, CLOUDINARY_API_KEY: cloudinaryAPIKey, CLOUDINARY_API_SECRET: cloudinaryAPISecret });

	// AWS S3
	const awsAccessKey = await kmsService.getSecret("mentorshub/prod/aws", "AWS_ACCESS_KEY_ID");
	const awsSecretAccessKey = await kmsService.getSecret("mentorshub/prod/aws", "AWS_SECRET_ACCESS_KEY");
	S3Config.init({ AWS_ACCESS_KEY_ID: awsAccessKey, AWS_SECRET_ACCESS_KEY: awsSecretAccessKey });

	// Razorpay
	const razorpayKey = await kmsService.getSecret("mentorshub/prod/razorpay", "RAZORPAY_KEY");
	const razorpaySecret = await kmsService.getSecret("mentorshub/prod/razorpay", "RAZORPAY_SECRET");
	RazorpayConfig.init({ RAZORPAY_KEY: razorpayKey, RAZORPAY_SECRET: razorpaySecret });

	// Google
	const googleClientId = await kmsService.getSecret("mentorshub/prod/google", "GOOGLE_CLIENT_ID");
	const googleClientSecret = await kmsService.getSecret("mentorshub/prod/google", "GOOGLE_CLIENT_SECRET");
	GoogleConfig.init({ GOOGLE_CLIENT_ID: googleClientId, GOOGLE_CLIENT_SECRET: googleClientSecret });
}

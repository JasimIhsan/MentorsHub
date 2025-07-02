import { createServer } from "http";
import { app } from "./app";
import { logger } from "./infrastructure/utils/logger";
import { createSocketServer } from "./infrastructure/socket/socket.server";
import initializeSocket from "./infrastructure/socket/socket.io";
import { SessionModel } from "./infrastructure/database/models/session/session.model";
import { TokenConfig } from "./infrastructure/auth/jwt/config/jwt.config";
import { kmsService } from "./infrastructure/composer";
import { CloudinaryConfig } from "./infrastructure/cloud/cloudinary/config/cloudinary.config";
import { S3Config } from "./infrastructure/cloud/S3 bucket/config/s3.config";
import { RazorpayConfig } from "./infrastructure/services/payment/config/razorpay.config";

(async () => {
	// Load jwt secrets
	const access = await kmsService.getSecret("mentorshub/prod/jwt", "JWT_ACCESS_TOKEN");
	const refresh = await kmsService.getSecret("mentorshub/prod/jwt", "JWT_REFRESH_TOKEN");
	TokenConfig.init({ access, refresh });

	// load cloudinary secrets
	const cloudinaryName = await kmsService.getSecret("mentorshub/prod/cloudinary", "CLOUDINARY_NAME");
	const cloudinaryAPIKey = await kmsService.getSecret("mentorshub/prod/cloudinary", "CLOUDINARY_API_KEY");
	const cloudinaryAPISecret = await kmsService.getSecret("mentorshub/prod/cloudinary", "CLOUDINARY_API_SECRET");
	CloudinaryConfig.init({ CLOUDINARY_CLOUD_NAME: cloudinaryName, CLOUDINARY_API_KEY: cloudinaryAPIKey, CLOUDINARY_API_SECRET: cloudinaryAPISecret });

	// load aws secrets
	const awsAccessKey = await kmsService.getSecret("mentorshub/prod/aws", "AWS_ACCESS_KEY_ID");
	const awsSecretAccessKey = await kmsService.getSecret("mentorshub/prod/aws", "AWS_SECRET_ACCESS_KEY");
	S3Config.init({ AWS_ACCESS_KEY_ID: awsAccessKey, AWS_SECRET_ACCESS_KEY: awsSecretAccessKey });

	// load razorpay secrets
	const razorpayKey = await kmsService.getSecret("mentorshub/prod/razorpay", "RAZORPAY_KEY");
	const razorpaySecret = await kmsService.getSecret("mentorshub/prod/razorpay", "RAZORPAY_SECRET");
	RazorpayConfig.init({ RAZORPAY_KEY: razorpayKey, RAZORPAY_SECRET: razorpaySecret });

	// Create server
	const server = createServer(app);

	// Create & expose io instance
	const io = createSocketServer(server);

	// Initialize events
	initializeSocket(io, SessionModel);

	const PORT = process.env.PORT || 5858;
	server.listen(PORT, () => logger.info(`Server running : ✅✅✅`));
})();

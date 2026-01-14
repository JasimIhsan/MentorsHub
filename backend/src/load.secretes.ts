import { TokenConfig } from "./infrastructure/auth/jwt/config/jwt.config";
import { GoogleConfig } from "./infrastructure/auth/passport/config/google.config";
import { CloudinaryConfig } from "./infrastructure/cloud/cloudinary/config/cloudinary.config";
import { S3Config } from "./infrastructure/cloud/S3 bucket/config/s3.config";
import { RazorpayConfig } from "./infrastructure/services/payment/config/razorpay.config";
// import { kmsService } from "./infrastructure/composer";

export async function loadSecrets() {
   // JWT
   // const access = await kmsService.getSecret("mentorshub/prod/jwt", "JWT_ACCESS_TOKEN");
   // const refresh = await kmsService.getSecret("mentorshub/prod/jwt", "JWT_REFRESH_TOKEN");
   const access = process.env.JWT_ACCESS_TOKEN as string;
   const refresh = process.env.JWT_REFRESH_TOKEN as string;
   TokenConfig.init({ access, refresh });

   // Cloudinary
   // const cloudinaryName = await kmsService.getSecret("mentorshub/prod/cloudinary", "CLOUDINARY_NAME");
   // const cloudinaryAPIKey = await kmsService.getSecret("mentorshub/prod/cloudinary", "CLOUDINARY_API_KEY");
   // const cloudinaryAPISecret = await kmsService.getSecret("mentorshub/prod/cloudinary", "CLOUDINARY_API_SECRET");
   const cloudinaryName = process.env.CLOUDINARY_NAME as string;
   const cloudinaryAPIKey = process.env.CLOUDINARY_API_KEY as string;
   const cloudinaryAPISecret = process.env.CLOUDINARY_API_SECRET as string;
   CloudinaryConfig.init({ CLOUDINARY_CLOUD_NAME: cloudinaryName, CLOUDINARY_API_KEY: cloudinaryAPIKey, CLOUDINARY_API_SECRET: cloudinaryAPISecret });

   // AWS S3
   // const awsAccessKey = await kmsService.getSecret("mentorshub/prod/aws", "AWS_ACCESS_KEY_ID");
   // const awsSecretAccessKey = await kmsService.getSecret("mentorshub/prod/aws", "AWS_SECRET_ACCESS_KEY");
   const awsAccessKey = process.env.AWS_ACCESS_KEY_ID as string;
   const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;
   S3Config.init({ AWS_ACCESS_KEY_ID: awsAccessKey, AWS_SECRET_ACCESS_KEY: awsSecretAccessKey });

   // Razorpay
   // const razorpayKey = await kmsService.getSecret("mentorshub/prod/razorpay", "RAZORPAY_KEY");
   // const razorpaySecret = await kmsService.getSecret("mentorshub/prod/razorpay", "RAZORPAY_SECRET");
   const razorpayKey = process.env.RAZORPAY_KEY as string;
   const razorpaySecret = process.env.RAZORPAY_SECRET as string;
   RazorpayConfig.init({ RAZORPAY_KEY: razorpayKey, RAZORPAY_SECRET: razorpaySecret });

   // Google
   // const googleClientId = await kmsService.getSecret("mentorshub/prod/google", "GOOGLE_CLIENT_ID");
   // const googleClientSecret = await kmsService.getSecret("mentorshub/prod/google", "GOOGLE_CLIENT_SECRET");
   const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
   const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
   GoogleConfig.init({ GOOGLE_CLIENT_ID: googleClientId, GOOGLE_CLIENT_SECRET: googleClientSecret });
}

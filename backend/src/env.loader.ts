import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvSchema = z.object({
	PORT: z.string().default("5858"),
	FRONTEND_ORIGIN: z.string().url(),
	AWS_REGION: z.string().default("ap-south-1"),
	// optional fallbacks for local/dev
	JWT_ACCESS_TOKEN: z.string().optional(),
	JWT_REFRESH_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;
export const env: Env = EnvSchema.parse(process.env);

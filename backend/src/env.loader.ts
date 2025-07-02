// src/envLoader.ts
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.string().default("5858"),

  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  FRONTEND_ORIGIN: z.string().url(),
  BACKEND_ORIGIN: z.string().url(),

  AWS_REGION: z.string().default("ap-south-1"),
  REDIS_URL: z.string().min(1),
});

export const env = EnvSchema.parse(process.env);


import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../../../utils/logger";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/MentorsHub";

async function connectDB() {
	try {
		await mongoose.connect(MONGO_URI);
		logger.info(` MongoDB connected  : ✅✅✅`);
	} catch (error: any) {
		logger.error(` MongoDB connected  : ❌❌❌`);
		console.error("Error connecting to MongoDB:", error.message);
		process.exit(1);
	}
}

export default connectDB;
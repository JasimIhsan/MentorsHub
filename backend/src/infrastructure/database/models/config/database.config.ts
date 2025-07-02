import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../../../utils/logger";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/MentorsHub";

async function connectDB() {
	try {
		await mongoose.connect(MONGO_URI);
		logger.info(` MongoDB connected  : ✅✅✅`);
	} catch (error) {
		logger.error(` MongoDB connected  : ❌❌❌`);
		if (error instanceof Error) console.error("Error connecting to MongoDB:", error.message);
		else console.error("Error connecting to MongoDB:", error);
		process.exit(1);
	}
}

export default connectDB;

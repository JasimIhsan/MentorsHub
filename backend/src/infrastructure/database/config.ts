import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/MentorsHub";

console.log(MONGO_URI);
async function connectDB() {
	try {
		await mongoose.connect(MONGO_URI);
		console.log(` MongoDB connected  : ✅✅✅`);
	} catch (error: any) {
		console.log(` MongoDB connected  : ❌❌❌`);
		console.error("Error connecting to MongoDB:", error.message);
		process.exit(1);
	}
}

export default connectDB;
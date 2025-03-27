import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./infrastructure/database/config";
import { authRouter } from "./presentation/routes/auth.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use(helmet());
app.use(
	cors({
		origin: "http://localhost:5173",
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
);

connectDB();

app.use(morgan("dev"));
app.use("/api", authRouter);

app.listen(process.env.PORT, () => {
	console.log(` Server is running  : ✅✅✅`);
});

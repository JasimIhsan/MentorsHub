import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./infrastructure/database/database.config";
import authRouter from "./presentation/routes/user/auth.routes";
import passport from "passport";
import { googleAuthRouter } from "./presentation/routes/user/google.auth.routes";
import { configurePassport } from "./infrastructure/auth/passport/passport.config";
import { tokenInterface, userRepository } from "./infrastructure/composer";
import { adminAuthRouter } from "./presentation/routes/admin/admin.auth.routes";
import { usertabRouter } from "./presentation/routes/admin/admin.usertab.routes";
import { userProfileRoutes } from "./presentation/routes/user/user.profile.routes";

dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(passport.initialize());
configurePassport(userRepository, tokenInterface);

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
app.use("/api/auth", googleAuthRouter);
app.use("/api/admin", adminAuthRouter);
app.use("/api/admin/users", usertabRouter);
app.use("/api/user-profile", userProfileRoutes);

app.listen(process.env.PORT, () => {
	console.log(` Server is running  : ✅✅✅`);
});

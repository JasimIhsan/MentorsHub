import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import { Server, Socket } from "socket.io";
import connectDB from "./infrastructure/database/models/config/database.config";
import authRouter from "./presentation/routes/user/auth.routes";
import { logger } from "./infrastructure/utils/logger";
import passport from "passport";
import { googleAuthRouter } from "./presentation/routes/user/google.auth.routes";
import { configurePassport } from "./infrastructure/auth/passport/passport.config";
import { hashService, tokenInterface, userRepository } from "./infrastructure/composer";
import { adminAuthRouter } from "./presentation/routes/admin/admin.auth.routes";
import { usertabRouter } from "./presentation/routes/admin/admin.usertab.routes";
import { userProfileRoutes } from "./presentation/routes/user/user.profile.routes";
import { mentorRouter } from "./presentation/routes/user/mentor.routes";
import { mentorApplicationRouter } from "./presentation/routes/admin/admin.mentor.application.routes";
import { sessionRouter } from "./presentation/routes/user/session.routes";
import { userSideMentorRouter } from "./presentation/routes/user/user.side.mentor.routes";
import { documentsRouter } from "./presentation/routes/common/documents.routes";
import { mentorSessionRouter } from "./presentation/routes/mentors/mentor.session.routes";
import { SessionModel } from "./infrastructure/database/models/session/session.model";
import initializeSocket from "./infrastructure/socket/socket.io";
import { notificationRouter } from "./presentation/routes/common/notification.routes";
import { reviewRouter } from "./presentation/routes/user/review.routes";
import { userWalletRouter } from "./presentation/routes/user/wallet.routes";
import { adminWalletRouter } from "./presentation/routes/admin/admin.wallet.routes";
import { messageRouter } from "./presentation/routes/user/message.routes";
import { errorHandler } from "./presentation/middlewares/error.handler.middleware";
import { adminGamificationTaskRouter } from "./presentation/routes/admin/admin.gamification.task.routes";
import { gamificationRoute } from "./presentation/routes/user/gamification.routes";

dotenv.config();

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173"],
		methods: ["GET", "POST"],
		credentials: true,
	},
});

initializeSocket(io, SessionModel);

// Express Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(passport.initialize());
configurePassport(userRepository, tokenInterface, hashService);
app.use(helmet());
app.use(
	cors({
		origin: ["http://localhost:5173"],
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		credentials: true,
	})
);

//  Winston and Morgan as logger
app.use(morgan("dev"));
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms", {
		stream: {
			write: (message) => logger.http(message.trim()),
		},
	})
);

connectDB();

// Routes
app.use("/api/user", authRouter);
app.use("/api/user/auth", googleAuthRouter);
app.use("/api/user/user-profile", userProfileRoutes);
app.use("/api/user/sessions", sessionRouter);
app.use("/api/user/mentor", userSideMentorRouter);
app.use("/api/user/reviews", reviewRouter);
app.use("/api/user/wallet", userWalletRouter);
app.use("/api/user/messages", messageRouter);
app.use("/api/user/gamification", gamificationRoute);

app.use("/api/admin", adminAuthRouter);
app.use("/api/admin/users", usertabRouter);
app.use("/api/admin/mentor-application", mentorApplicationRouter);
app.use("/api/admin/wallet", adminWalletRouter);
app.use("/api/admin/gamification", adminGamificationTaskRouter);

app.use("/api/mentor", mentorRouter);
app.use("/api/mentor/sessions", mentorSessionRouter);

app.use("/api/documents", documentsRouter);
app.use("/api/notifications", notificationRouter);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5858;
server.listen(PORT, () => {
	logger.info(`Server is running on port ${PORT} : ✅✅✅`);
});

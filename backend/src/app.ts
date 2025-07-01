import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";
import morgan from "morgan";
import { configurePassport } from "./infrastructure/auth/passport/passport.config";
import { errorHandler } from "./presentation/middlewares/error.handler.middleware";
import connectDB from "./infrastructure/database/models/config/database.config";
import { hashService, tokenService, userRepository } from "./infrastructure/composer";
import { logger } from "./infrastructure/utils/logger";
import { registerRoutes } from "./routes";
import { applyGlobalMiddlewares } from "./middlewares";

export const app = express();

// Connect to MongoDB
connectDB();

// Passport setup
app.use(passport.initialize());
configurePassport(userRepository, tokenService, hashService);

// Middlewares
applyGlobalMiddlewares(app);

// Routes
registerRoutes(app);

// Error Handling
app.use(errorHandler);

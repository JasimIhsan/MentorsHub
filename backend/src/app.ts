import express from "express";
import passport from "passport";
import { errorHandler } from "./presentation/middlewares/error.handler.middleware";
import connectDB from "./infrastructure/database/models/config/database.config";
import { registerRoutes } from "./routes";
import { applyGlobalMiddlewares } from "./middlewares";
import { startSessionExpiryJob } from "./infrastructure/schedulers/session.expiry.job";

export const app = express();

// Connect to MongoDB
connectDB();

// start Schedulers
startSessionExpiryJob();

// Passport setup
app.use(passport.initialize());

// Middlewares
applyGlobalMiddlewares(app);

// Routes
registerRoutes(app);

// Error Handling
app.use(errorHandler);

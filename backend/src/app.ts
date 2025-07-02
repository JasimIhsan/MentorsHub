import express from "express";
import passport from "passport";
import { errorHandler } from "./presentation/middlewares/error.handler.middleware";
import connectDB from "./infrastructure/database/models/config/database.config";
import { registerRoutes } from "./routes";
import { applyGlobalMiddlewares } from "./middlewares";

export const app = express();

// Connect to MongoDB
connectDB();

// Passport setup
app.use(passport.initialize());

// Middlewares
applyGlobalMiddlewares(app);

// Routes
registerRoutes(app);

// Error Handling
app.use(errorHandler);

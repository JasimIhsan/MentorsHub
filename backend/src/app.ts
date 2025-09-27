import express from "express";
import passport from "passport";
import { errorHandler } from "./presentation/middlewares/error.handler.middleware";
import { registerRoutes } from "./routes";
import { applyGlobalMiddlewares } from "./middlewares";
import { startSessionExpiryJob } from "./infrastructure/schedulers/session.expiry.scheduler";
import { startSessionReminderJob } from "./infrastructure/schedulers/session.reminder.scheduler";
import { startSlotCleanupJob } from "./infrastructure/schedulers/delete.expired.date.specific.slots";

export const app = express();

// start Schedulers
startSessionExpiryJob();
startSessionReminderJob();
startSlotCleanupJob();

// ⚠️ Important for secure cookies (SameSite=None + Secure) in production
// Express needs to trust the proxy (Vercel, Nginx, AWS LB, etc.)
// Without this, `secure: true` cookies will not be set over HTTPS
if (process.env.NODE_ENV === "production") {
	app.set("trust proxy", 1);
}

// Passport setup
app.use(passport.initialize());

// Middlewares
applyGlobalMiddlewares(app);

// Routes
registerRoutes(app);

// Error Handling
app.use(errorHandler);

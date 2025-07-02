import { createServer } from "http";
import { app } from "./app";
import { logger } from "./infrastructure/utils/logger";
import { createSocketServer } from "./infrastructure/socket/socket.server";
import initializeSocket from "./infrastructure/socket/socket.io";
import { SessionModel } from "./infrastructure/database/models/session/session.model";
import { loadSecrets } from "./load.secretes";
import { configurePassport } from "./infrastructure/auth/passport/passport.config";
import { hashService, tokenService, userRepository } from "./infrastructure/composer";

(async () => {
	try {
		// Load all secrets (JWT, Cloudinary, AWS, Razorpay, Google)
		await loadSecrets();

		// Setup Passport
		configurePassport(userRepository, tokenService, hashService);

		// Create HTTP + Socket.IO server
		const server = createServer(app);
		const io = createSocketServer(server);
		initializeSocket(io, SessionModel);

		// Start listening
		const PORT = process.env.PORT || 5858;
		server.listen(PORT, () => logger.info("Server running : ✅✅✅"));
	} catch (err) {
		logger.error("❌ Failed to start server", err);
		process.exit(1);
	}
})();

import { createServer } from "http";
import { app } from "./app";
import { logger } from "./infrastructure/utils/logger";
import { createSocketServer } from "./infrastructure/socket/socket.server";
import initializeSocket from "./infrastructure/socket/socket.io";
import { SessionModel } from "./infrastructure/database/models/session/session.model";
import { TokenConfig } from "./infrastructure/auth/jwt/jwt.config";
import { kmsService } from "./infrastructure/composer";

(async () => {
	// Load secrets
	const access = await kmsService.getSecret("mentorshub/prod/jwt", "JWT_ACCESS_TOKEN");
	const refresh = await kmsService.getSecret("mentorshub/prod/jwt", "JWT_REFRESH_TOKEN");
	console.log("access: ", access);
	console.log("refresh: ", refresh);
	TokenConfig.init({ access, refresh });

	// Create server
	const server = createServer(app);

	// Create & expose io instance
	const io = createSocketServer(server);

	// Initialize events
	initializeSocket(io, SessionModel);

	const PORT = process.env.PORT || 5858;
	server.listen(PORT, () => logger.info(`Server running : ✅✅✅`));
})();

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { IHashService } from "../../../application/interfaces/services/hash.service";

export class HashServiceImpl implements IHashService {
	private readonly saltRounds = 10;

	async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, this.saltRounds);
	}

	async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
		return bcrypt.compare(plainPassword, hashedPassword);
	}

	generatePassword(length = 12): string {
		return crypto
			.randomBytes(length)
			.toString("base64")
			.replace(/[^a-zA-Z0-9]/g, "")
			.slice(0, length);
	}
}

import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { IKmsService } from "../../../application/interfaces/services/kms.service";

export class KmsServiceImpl implements IKmsService {
	private cache = new Map<string, Record<string, string>>();
	private client = new SecretsManagerClient({ region: process.env.AWS_REGION! });

	async init(): Promise<void> {
		/* noop – lazy load */
	}

	async getSecret(group: string, field: string): Promise<string> {
		if (!this.cache.has(group)) {
			const cmd = new GetSecretValueCommand({ SecretId: group });
			const res = await this.client.send(cmd);
			if (!res.SecretString) throw new Error(`Secret ${group} empty`);
			this.cache.set(group, JSON.parse(res.SecretString));
		}
		const groupObj = this.cache.get(group)!;
		const value = groupObj[field] ?? process.env[field]; // fallback for dev
		if (!value) throw new Error(`Field ${field} missing in ${group}`);
		return value;
	}
}

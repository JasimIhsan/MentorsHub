import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { IKmsService } from "../../../application/interfaces/services/kms.service";

export class KmsServiceImpl implements IKmsService {
   private cache = new Map<string, Record<string, string>>();
   private client = new SecretsManagerClient({ region: process.env.AWS_REGION! });

   async getSecret(group: string, field: string): Promise<string> {
      if (!this.cache.has(group)) {
         try {
            const cmd = new GetSecretValueCommand({ SecretId: group });
            const res = await this.client.send(cmd);
            if (res.SecretString) {
               this.cache.set(group, JSON.parse(res.SecretString));
            }
         } catch (error) {
            console.warn(`⚠️ Failed to fetch secret group '${group}' from KMS. Using process.env fallback. Error: ${(error as Error).message}`);
            // Initialize empty object for this group in cache so we don't retry and fail repeatedly,
            // allowing fallback to process.env below.
            this.cache.set(group, {});
         }
      }
      const groupObj = this.cache.get(group)!;
      const value = groupObj[field] ?? process.env[field]; // fallback for dev
      if (!value) throw new Error(`Field ${field} missing in ${group}`);
      return value;
   }
}

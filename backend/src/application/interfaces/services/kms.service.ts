export interface IKmsService {
	init(): Promise<void>;
	getSecret(group: string, key: string): Promise<string>;
}

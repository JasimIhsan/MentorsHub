export interface IKmsService {
	getSecret(group: string, key: string): Promise<string>;
}

export interface IHashService {
	hashPassword(password: string): Promise<string>;
	comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
	generatePassword(length?: number): string;
}

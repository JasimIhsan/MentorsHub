import { UserRepositoryImpl } from "./database/implementation/user.repository.impl";
import { ForgotPasswordResetTokenImpl } from "./database/implementation/forgot.password.token.impl";
import { TokenServicesImpl } from "./jwt/jwt.services";
import { EmailServiceImpl } from "./services/email-services/email.service";
import { RedisCacheRepository } from "./cache/redis.cache.repository";
import { IUserRepository } from "../domain/dbrepository/user.repository";
import { IForgotPasswordTokensRepository } from "../domain/dbrepository/forgot.password.token.respository";
import { ITokenService } from "../application/interfaces/token.service.interface";
import { IEmailService } from "../application/interfaces/email.service.interface";
import { ICacheRepository } from "../domain/dbrepository/cache.respository";

// Initialize Database Implementations
export const userRepository: IUserRepository = new UserRepositoryImpl();
export const forgotResetRepository: IForgotPasswordTokensRepository = new ForgotPasswordResetTokenImpl();

// Initialize Interfaces
export const tokenInterface: ITokenService = new TokenServicesImpl();
export const emailService: IEmailService = new EmailServiceImpl();
export const redisService: ICacheRepository = new RedisCacheRepository();

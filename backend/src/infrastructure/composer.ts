import { UserRepositoryImpl } from "./database/implementation/user/user.repository.impl";
import { ForgotPasswordResetTokenImpl } from "./database/implementation/user/forgot.password.token.impl";
import { TokenServicesImpl } from "./auth/jwt/jwt.services";
import { EmailServiceImpl } from "./services/email-services/email.service";
import { RedisCacheRepository } from "./cache/redis.cache.repository";
import { IUserRepository } from "../domain/dbrepository/user.repository";
import { IForgotPasswordTokensRepository } from "../domain/dbrepository/forgot.password.token.respository";
import { ITokenService } from "../application/interfaces/user/token.service.interface";
import { IEmailService } from "../application/interfaces/user/email.service.interface";
import { ICacheRepository } from "../domain/dbrepository/cache.respository";
import { IAdminRepository } from "../domain/dbrepository/admin.repository";
import { AdminRepositoryImpl } from "./database/implementation/admin/admin.repository.impl";
import { ICloudinaryService } from "../application/interfaces/user/user.profile.usecase.interfaces";
import { CloudinaryService } from "./cloud/cloudinary/cloudinary";
import { IMentorProfileRepository } from "../domain/dbrepository/mentor.details.repository";
import { MentorDetailsRepositoryImpl } from "./database/implementation/user/mentor.respository.impl";

// Initialize Database Implementations
export const userRepository: IUserRepository = new UserRepositoryImpl();
export const forgotResetRepository: IForgotPasswordTokensRepository = new ForgotPasswordResetTokenImpl();
export const adminRepository: IAdminRepository = new AdminRepositoryImpl();
export const mentorRepository: IMentorProfileRepository = new MentorDetailsRepositoryImpl()

// Initialize services implementation
export const tokenInterface: ITokenService = new TokenServicesImpl();
export const emailService: IEmailService = new EmailServiceImpl();
export const redisService: ICacheRepository = new RedisCacheRepository();
export const cloudinaryService: ICloudinaryService = new CloudinaryService();

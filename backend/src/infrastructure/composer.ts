import { UserRepositoryImpl } from "./database/implementation/user.repository.impl";
import { ForgotPasswordResetTokenImpl } from "./database/implementation/forgot.password.token.impl";
import { TokenServicesImpl } from "./auth/jwt/jwt.services";
import { EmailServiceImpl } from "./services/email-services/email.service";
import { RedisCacheRepository } from "./cache/redis.cache.repository";
import { IUserRepository } from "../domain/dbrepository/user.repository";
import { IForgotPasswordTokensRepository } from "../domain/dbrepository/forgot.password.token.respository";
import { ITokenService } from "../application/interfaces/user/token.service.interface";
import { IEmailService } from "../application/interfaces/user/email.service.interface";
import { ICacheRepository } from "../domain/dbrepository/cache.respository";
import { IAdminRepository } from "../domain/dbrepository/admin.repository";
import { AdminRepositoryImpl } from "./database/implementation/admin.repository.impl";
import { ICloudinaryService } from "../application/interfaces/user/user.profile.usecase.interfaces";
import { CloudinaryService } from "./cloud/cloudinary/cloudinary";
import { IMentorProfileRepository } from "../domain/dbrepository/mentor.details.repository";
import { MentorDetailsRepositoryImpl } from "./database/implementation/mentor.respository.impl";
import { ISessionRepository } from "../domain/dbrepository/session.repository";
import { SessionRepositoryImpl } from "./database/implementation/session.repository.impl";
import { S3Service } from "./cloud/S3 bucket/s3.implementation";
import { IS3Service } from "../domain/interface/s3.service.interface";

// Initialize Database Implementations
export const userRepository: IUserRepository = new UserRepositoryImpl();
export const forgotResetRepository: IForgotPasswordTokensRepository = new ForgotPasswordResetTokenImpl();
export const adminRepository: IAdminRepository = new AdminRepositoryImpl();
export const mentorRepository: IMentorProfileRepository = new MentorDetailsRepositoryImpl()
export const sessionRepository: ISessionRepository = new SessionRepositoryImpl();

// Initialize services implementation
export const tokenInterface: ITokenService = new TokenServicesImpl();
export const emailService: IEmailService = new EmailServiceImpl();
export const redisService: ICacheRepository = new RedisCacheRepository();
export const cloudinaryService: ICloudinaryService = new CloudinaryService();
export const s3BucketService: IS3Service = new S3Service();

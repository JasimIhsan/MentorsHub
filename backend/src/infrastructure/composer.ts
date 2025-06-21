import { UserRepositoryImpl } from "./database/implementation/user.repository.impl";
import { ForgotPasswordResetTokenImpl } from "./database/implementation/forgot.password.token.impl";
import { TokenServicesImpl } from "./auth/jwt/jwt.services";
import { EmailServiceImpl } from "./services/email-services/email.service";
import { RedisCacheRepository } from "./cache/redis.cache.repository";
import { IUserRepository } from "../domain/repositories/user.repository";
import { IForgotPasswordTokensRepository } from "../domain/repositories/forgot.password.token.respository";
import { ITokenService } from "../application/interfaces/user/token.service.interface";
import { IEmailService } from "../application/interfaces/user/email.service.interface";
import { ICacheRepository } from "../domain/repositories/cache.respository";
import { IAdminRepository } from "../domain/repositories/admin.repository";
import { AdminRepositoryImpl } from "./database/implementation/admin.repository.impl";
import { ICloudinaryService } from "../application/interfaces/user/user.profile.usecase.interfaces";
import { CloudinaryService } from "./cloud/cloudinary/cloudinary";
import { IMentorProfileRepository } from "../domain/repositories/mentor.details.repository";
import { MentorDetailsRepositoryImpl } from "./database/implementation/mentor.respository.impl";
import { ISessionRepository } from "../domain/repositories/session.repository";
import { SessionRepositoryImpl } from "./database/implementation/session.repository.impl";
import { S3Service } from "./cloud/S3 bucket/s3.implementation";
import { IS3Service } from "../domain/interface/s3.service.interface";
import { INotificationRepository } from "../domain/repositories/notification.repository";
import { NotificationRepositoryImpl } from "./database/implementation/notification.repository.impl";
import { IReviewRepository } from "../domain/repositories/review.repository";
import { ReviewRepositoryImpl } from "./database/implementation/review.repository.impl";
import { IWalletRepository } from "../domain/repositories/wallet.repository";
import { WalletRepositoryImpl } from "./database/implementation/wallet.repository.impl";
import { IMessageRepository } from "../domain/repositories/message.repository";
import { MessageRepositoryImpl } from "./database/implementation/message.repository.impl";
import { IChatRepository } from "../domain/repositories/chat.repository";
import { ChatRepositoryImpl } from "./database/implementation/chat.repository.impl";

// Initialize Database Implementations
export const userRepository: IUserRepository = new UserRepositoryImpl();
export const forgotResetRepository: IForgotPasswordTokensRepository = new ForgotPasswordResetTokenImpl();
export const adminRepository: IAdminRepository = new AdminRepositoryImpl();
export const mentorRepository: IMentorProfileRepository = new MentorDetailsRepositoryImpl();
export const sessionRepository: ISessionRepository = new SessionRepositoryImpl();
export const notificationRepository: INotificationRepository = new NotificationRepositoryImpl();
export const reviewRepository: IReviewRepository = new ReviewRepositoryImpl();
export const walletRepository: IWalletRepository = new WalletRepositoryImpl();
export const messageRepository: IMessageRepository = new MessageRepositoryImpl();
export const chatRepository: IChatRepository = new ChatRepositoryImpl();

// Initialize services implementation
export const emailService: IEmailService = new EmailServiceImpl();
export const redisService: ICacheRepository = new RedisCacheRepository();
export const tokenInterface: ITokenService = new TokenServicesImpl(redisService);
export const cloudinaryService: ICloudinaryService = new CloudinaryService();
export const s3BucketService: IS3Service = new S3Service();

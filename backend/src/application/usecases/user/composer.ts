import { ForgotPasswordUseCase } from "./forgot-password/forgot.password.usecase";
import { RefreshTokenUseCase } from "./authentication/refresh.token.usecase";
import { SigninUseCase } from "./authentication/signin.usecase";
import { VerifyOtpUsecase } from "./authentication/verify.otp.usecase";
import { VerifyResetTokenUseCase } from "./forgot-password/verify.rest.password.usecase";
import { ResetPasswordUseCase } from "./forgot-password/reset.password.usecase";
import { SignupUseCase } from "./authentication/signup.usecase";
import { SendOtpUsecase } from "./authentication/send.otp.usecase";
import { GoogleAuthUsecase } from "./authentication/google.auth.usecase";

import { userRepository, forgotResetRepository, tokenInterface, emailService, redisService, cloudinaryService, mentorRepository, sessionRepository, s3BucketService, walletRepository } from "../../../infrastructure/composer";
import { UpdateUserProfileUseCase } from "./user-profile/update.user.profile.usecase";
import { UploadAvatarUseCase } from "./user-profile/upload.avatar.usecase";
import { ChangePasswordUsecase } from "./user-profile/change.password.usecase";
import { BecomeMentorUseCase } from "./user-profile/become.mentor.application.usecase";
import { GetUserProfileUseCase } from "./user-profile/get.user.profile.usecase";
import { RequestSessionUseCase } from "./session/request.session.usecase";
import { GetSessionsByUserUseCase } from "./session/get.sessions.by.user.usecase";
import { PaySessionUseCase } from "./session/pay.session.usecase";
import { UploadMentorDocumentUseCase } from "../documents/upload.mentor.document.usecase";
import { ReApplyMentorApplicationUseCase } from "./user-profile/re.apply.mentor.application.usecase";
import { CancelSessionUseCase } from "./session/cancel.session.usecase";

// Initialize UseCases
export const signinUseCase = new SigninUseCase(userRepository, tokenInterface);
export const refreshUseCase = new RefreshTokenUseCase(tokenInterface);
export const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, emailService, forgotResetRepository);
export const verifyResetTokenUseCase = new VerifyResetTokenUseCase(forgotResetRepository);
export const resetPasswordUseCase = new ResetPasswordUseCase(forgotResetRepository, userRepository);
export const verifyOTPUsecase = new VerifyOtpUsecase(redisService);
export const signupUseCase = new SignupUseCase(userRepository, tokenInterface, verifyOTPUsecase);
export const sendOtpUseCase = new SendOtpUsecase(emailService, userRepository, redisService);
export const googleAuthUsecase = new GoogleAuthUsecase(userRepository, tokenInterface);
export const updateUserProfileUsecase = new UpdateUserProfileUseCase(userRepository);
export const uploadImageCloudinaryUsecase = new UploadAvatarUseCase(cloudinaryService);
export const changePasswordUsecase = new ChangePasswordUsecase(userRepository);
export const uploadMentorDocumentUseCase = new UploadMentorDocumentUseCase(s3BucketService);
export const becomeMentorUseCase = new BecomeMentorUseCase(mentorRepository, userRepository, uploadMentorDocumentUseCase);
export const reApplyMentorApplicationUseCase = new ReApplyMentorApplicationUseCase(mentorRepository, userRepository, uploadMentorDocumentUseCase);
export const getUserProfileUsecase = new GetUserProfileUseCase(userRepository);
export const requestSessionUsecase = new RequestSessionUseCase(sessionRepository, mentorRepository);
export const getSessionsByUserUsecase = new GetSessionsByUserUseCase(sessionRepository);
export const getSessionByMentorUsecase = new GetSessionsByUserUseCase(sessionRepository);
export const paySessionUsecase = new PaySessionUseCase(sessionRepository, walletRepository);
export const cancelSessionUseCase = new CancelSessionUseCase(sessionRepository)

import { ForgotPasswordUseCase } from "./forgot-password/forgot.password.usecase";
import { RefreshTokenUseCase } from "./authentication/refresh.token.usecase";
import { SigninUseCase } from "./authentication/signin.usecase";
import { VerifyOtpUsecase } from "./authentication/verify.otp.usecase";
import { VerifyResetTokenUseCase } from "./forgot-password/verify.rest.password.usecase";
import { ResetPasswordUseCase } from "./forgot-password/reset.password.usecase";
import { SignupUseCase } from "./authentication/signup.usecase";
import { SendOtpUsecase } from "./authentication/send.otp.usecase";
import { GoogleAuthUsecase } from "./authentication/google.auth.usecase";

import { userRepository, forgotResetRepository, tokenInterface, emailService, redisService, cloudinaryService, mentorRepository, sessionRepository } from "../../../infrastructure/composer";
import { UpdateUserProfileUseCase } from "./user-profile/update.user.profile.usecase";
import { UploadAvatarUseCase } from "./user-profile/upload.avatar.usecase";
import { ChangePasswordUsecase } from "./user-profile/change.password.usecase";
import { BecomeMentorUseCase } from "./user-profile/become.mentor.application.usecase";
import { FetchUserProfileUseCase } from "./user-profile/fetch.user.profile.usecase";
import { RequestSessionUseCase } from "./session/create.session.usecase";
import { FetchSessionsByUserUseCase } from "./session/fetch.sessions.by.user.usecase";

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
export const becomeMentorUseCase = new BecomeMentorUseCase(mentorRepository, userRepository);
export const fetchUserProfileUsecase = new FetchUserProfileUseCase(userRepository);
export const requestSessionUsecase = new RequestSessionUseCase(sessionRepository, mentorRepository);
export const fetchSessionsByUserUsecase = new FetchSessionsByUserUseCase(sessionRepository);
export const fetchSessionByMentorUsecase = new FetchSessionsByUserUseCase(sessionRepository);

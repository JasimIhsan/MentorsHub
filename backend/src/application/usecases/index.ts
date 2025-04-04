import { ForgotPasswordUseCase } from "./forgot-password/forgot.password.usecase";
import { RefreshTokenUseCase } from "./authentication/refresh.token.usecase";
import { SigninUseCase } from "./authentication/signin.usecase";
import { VerifyOtpUsecase } from "./authentication/verify.otp.usecase";
import { VerifyResetTokenUseCase } from "./forgot-password/verify.rest.password.usecase";
import { ResetPasswordUseCase } from "./forgot-password/reset.password.usecase";
import { SignupUseCase } from "./authentication/signup.usecase";
import { SendOtpUsecase } from "./authentication/send.otp.usecase";
import { GoogleAuthUsecase } from "./authentication/google.auth.usecase";

import { userRepository, forgotResetRepository, tokenInterface, emailService, redisService } from "../../infrastructure/index";

// Initialize UseCases
export const signinUseCase = new SigninUseCase(userRepository, tokenInterface);
export const refreshUseCase = new RefreshTokenUseCase(tokenInterface);
export const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, emailService, forgotResetRepository);
export const verifyResetTokenUseCase = new VerifyResetTokenUseCase(forgotResetRepository);
export const resetPasswordUseCase = new ResetPasswordUseCase(forgotResetRepository, userRepository);
export const verifyOTPUsecase = new VerifyOtpUsecase(redisService);
export const signupUseCase = new SignupUseCase(userRepository, tokenInterface, verifyOTPUsecase);
export const sendOtpUseCase = new SendOtpUsecase(emailService, userRepository, redisService);
export const googleAuthUsecase = new GoogleAuthUsecase(userRepository, tokenInterface)

import { SignupController } from "./signup.controller";
import { SigninController } from "./signin.controller";
import { RefreshTokenController } from "./refresh.token.controller";
import { ForgotPasswrodController } from "./forgot.password.controller";
import { VerifyResetTokenController } from "./verify.reset.token.controller";
import { ResetPasswordController } from "./reset.password.controller";
import { LogoutController } from "./logout.controller";
import { SendOtpController } from "./send.otp.controller";
import { GoogleAuthController } from "./google.auth.controller";

import { signupUseCase, signinUseCase, refreshUseCase, forgotPasswordUseCase, verifyResetTokenUseCase, resetPasswordUseCase, sendOtpUseCase, googleAuthUsecase } from "../../application/usecases/index";

export const signupController = new SignupController(signupUseCase);
export const signinController = new SigninController(signinUseCase);
export const refreshController = new RefreshTokenController(refreshUseCase);
export const forgotPasswordController = new ForgotPasswrodController(forgotPasswordUseCase);
export const verifyResetTokenController = new VerifyResetTokenController(verifyResetTokenUseCase);
export const resetPasswordController = new ResetPasswordController(resetPasswordUseCase);
export const logoutController = new LogoutController();
export const sendOtpController = new SendOtpController(sendOtpUseCase);
export const googleAuthController = new GoogleAuthController(googleAuthUsecase);

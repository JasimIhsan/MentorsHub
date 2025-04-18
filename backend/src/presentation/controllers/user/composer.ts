import { SignupController } from "./auth/signup.controller";
import { SigninController } from "./auth/signin.controller";
import { RefreshTokenController } from "./auth/refresh.token.controller";
import { ForgotPasswrodController } from "./auth/forgot.password.controller";
import { VerifyResetTokenController } from "./auth/verify.reset.token.controller";
import { ResetPasswordController } from "./auth/reset.password.controller";
import { LogoutController } from "./auth/logout.controller";
import { SendOtpController } from "./auth/send.otp.controller";
import { GoogleAuthController } from "./auth/google.auth.controller";

import {
	signupUseCase,
	signinUseCase,
	refreshUseCase,
	forgotPasswordUseCase,
	verifyResetTokenUseCase,
	resetPasswordUseCase,
	sendOtpUseCase,
	googleAuthUsecase,
	updateUserProfileUsecase,
	changePasswordUsecase,
	becomeMentorUseCase,
	fetchUserProfileUsecase,
} from "../../../application/usecases/user/composer";
import { UpdateUserController } from "../admin/user-tab/update.user.controller";
import { UpdateUserProfileController } from "./user-profile/update.user.profile.controller";
import { cloudinaryService } from "../../../infrastructure/composer";
import { ChangePasswordController } from "./user-profile/change.password.controller";
import { BecomeMentorController } from "./user-profile/become.mentor.application.controller";
import { FetchUserProfileController } from "./user-profile/fetch.user.profile.controller";

export const signupController = new SignupController(signupUseCase);
export const signinController = new SigninController(signinUseCase);
export const refreshController = new RefreshTokenController(refreshUseCase);
export const forgotPasswordController = new ForgotPasswrodController(forgotPasswordUseCase);
export const verifyResetTokenController = new VerifyResetTokenController(verifyResetTokenUseCase);
export const resetPasswordController = new ResetPasswordController(resetPasswordUseCase);
export const logoutController = new LogoutController();
export const sendOtpController = new SendOtpController(sendOtpUseCase);
export const googleAuthController = new GoogleAuthController(googleAuthUsecase);
export const updateUseProfileController = new UpdateUserProfileController(updateUserProfileUsecase, cloudinaryService);
export const changePasswordController = new ChangePasswordController(changePasswordUsecase);
export const becomeMentorApplicationController = new BecomeMentorController(becomeMentorUseCase);
export const fetchUserProfileController = new FetchUserProfileController(fetchUserProfileUsecase);

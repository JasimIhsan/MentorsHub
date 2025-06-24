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
	getUserProfileUsecase,
	requestSessionUsecase,
	getSessionsByUserUsecase,
	paySessionUsecase,
	reApplyMentorApplicationUseCase,
	cancelSessionUseCase,
	verifySessionPaymentUseCase,
	createSessionPaymentOrderUsecase,
} from "../../../application/usecases/user/composer";
import { UpdateUserProfileController } from "./user-profile/update.user.profile.controller";
import { cloudinaryService } from "../../../infrastructure/composer";
import { ChangePasswordController } from "./user-profile/change.password.controller";
import { BecomeMentorController } from "./user-profile/become.mentor.application.controller";
import { GetUserProfileController } from "./user-profile/get.user.profile.controller";
import { RequestSessionController } from "./session/request.session.controller";
import { GetSessionByUserController } from "./session/get.session.by.user.controller";
import { PaySessionController } from "./session/pay.session.usecase.controller";
import { GetMentorAvailabilityController } from "./session/get.mentor.availability.controller";
import { getAvailabilityUsecase } from "../../../application/usecases/mentors/composer";
import { ReApplyMentorApplicationController } from "./user-profile/update.mentor.profile.controller";
import { CancelSessionController } from "./session/cancel.session.controller";
import { VerifySessionPaymentController } from "./session/verify.session.payment.controller";
import { CreateSessionPaymentOrderController } from "./session/create.session.payment.order.controller";

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
export const reApplyMentorApplicationController = new ReApplyMentorApplicationController(reApplyMentorApplicationUseCase);
export const getUserProfileController = new GetUserProfileController(getUserProfileUsecase);
export const createSessionController = new RequestSessionController(requestSessionUsecase);
export const getSessionsByUserController = new GetSessionByUserController(getSessionsByUserUsecase);
export const paySessionController = new PaySessionController(paySessionUsecase);
export const getAvailabilityController = new GetMentorAvailabilityController(getAvailabilityUsecase);
export const cancelSessionController = new CancelSessionController(cancelSessionUseCase);
export const verifySessionPaymentController = new VerifySessionPaymentController(verifySessionPaymentUseCase);
export const createSessionPaymentOrderController = new CreateSessionPaymentOrderController(createSessionPaymentOrderUsecase);
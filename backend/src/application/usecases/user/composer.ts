import { ForgotPasswordUseCase } from "./forgot-password/forgot.password.usecase";
import { RefreshTokenUseCase } from "./authentication/refresh.token.usecase";
import { SigninUseCase } from "./authentication/signin.usecase";
import { VerifyOtpUsecase } from "./authentication/verify.otp.usecase";
import { VerifyResetTokenUseCase } from "./forgot-password/verify.rest.password.usecase";
import { ResetPasswordUseCase } from "./forgot-password/reset.password.usecase";
import { SignupUseCase } from "./authentication/signup.usecase";
import { SendOtpUsecase } from "./authentication/send.otp.usecase";
import { GoogleAuthUsecase } from "./authentication/google.auth.usecase";

import {
	userRepository,
	forgotResetRepository,
	tokenService,
	emailService,
	redisService,
	cloudinaryService,
	mentorRepository,
	sessionRepository,
	s3BucketService,
	walletRepository,
	getPaymentGatewayService,
	hashService,
} from "../../../infrastructure/composer";
import { UpdateUserProfileUseCase } from "./user-profile/update.user.profile.usecase";
import { UploadAvatarUseCase } from "./user-profile/upload.avatar.usecase";
import { ChangePasswordUsecase } from "./user-profile/change.password.usecase";
import { BecomeMentorUseCase } from "./user-profile/become.mentor.application.usecase";
import { GetUserProfileUseCase } from "./user-profile/get.user.profile.usecase";
import { RequestSessionUseCase } from "./session/request.session.usecase";
import { GetSessionsByUserUseCase } from "./session/get.sessions.by.user.usecase";
import { PaySessionWithWalletUseCase } from "./session/pay.session.with.wallet.usecase";
import { UploadMentorDocumentUseCase } from "../documents/upload.mentor.document.usecase";
import { ReApplyMentorApplicationUseCase } from "./user-profile/re.apply.mentor.application.usecase";
import { CancelSessionUseCase } from "./session/cancel.session.usecase";
import { get } from "axios";
import { getAvailabilityUsecase } from "../mentors/composer";
import { VerifySessionPaymentUseCase } from "./session/verify.session.payment.usecase";
import { CreateSessionPaymentOrderUseCase } from "./session/create.session.payment.order.usecase";
import { PaySessionWithGatewayUseCase } from "./session/pay.session.with.gateway.usecase";
import { createUserProgressUseCase } from "../gamification/composer";

// Initialize UseCases
export const signinUseCase = new SigninUseCase(userRepository, tokenService, hashService);
export const refreshUseCase = new RefreshTokenUseCase(tokenService);
export const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, emailService, forgotResetRepository);
export const verifyResetTokenUseCase = new VerifyResetTokenUseCase(forgotResetRepository);
export const resetPasswordUseCase = new ResetPasswordUseCase(forgotResetRepository, userRepository, hashService);
export const verifyOTPUsecase = new VerifyOtpUsecase(redisService);
export const signupUseCase = new SignupUseCase(userRepository, tokenService, verifyOTPUsecase, createUserProgressUseCase, hashService);
export const sendOtpUseCase = new SendOtpUsecase(emailService, userRepository, redisService);
export const googleAuthUsecase = new GoogleAuthUsecase(userRepository, tokenService, hashService);
export const updateUserProfileUsecase = new UpdateUserProfileUseCase(userRepository);
export const uploadImageCloudinaryUsecase = new UploadAvatarUseCase(cloudinaryService);
export const changePasswordUsecase = new ChangePasswordUsecase(userRepository, hashService);
export const uploadMentorDocumentUseCase = new UploadMentorDocumentUseCase(s3BucketService);
export const becomeMentorUseCase = new BecomeMentorUseCase(mentorRepository, userRepository, uploadMentorDocumentUseCase);
export const reApplyMentorApplicationUseCase = new ReApplyMentorApplicationUseCase(mentorRepository, userRepository, uploadMentorDocumentUseCase);
export const getUserProfileUsecase = new GetUserProfileUseCase(userRepository);
export const requestSessionUsecase = new RequestSessionUseCase(sessionRepository, mentorRepository, getAvailabilityUsecase);
export const getSessionsByUserUsecase = new GetSessionsByUserUseCase(sessionRepository);
export const getSessionByMentorUsecase = new GetSessionsByUserUseCase(sessionRepository);
export const paySessionWithWalletUseCase = new PaySessionWithWalletUseCase(sessionRepository, walletRepository);
export const paySessionWithGatewayUsecase = new PaySessionWithGatewayUseCase(sessionRepository, walletRepository);
export const cancelSessionUseCase = new CancelSessionUseCase(sessionRepository);
export const verifySessionPaymentUseCase = new VerifySessionPaymentUseCase(sessionRepository);

// lazy loading usecases
export const getCreateSessionPaymentOrderUsecase = () => new CreateSessionPaymentOrderUseCase(sessionRepository, getPaymentGatewayService());

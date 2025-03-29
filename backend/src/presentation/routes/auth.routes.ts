import { Router } from "express";
import { SignupUseCase } from "../../application/usecases/authentication/signup.usecase";
import { UserRepositoryImpl } from "../../infrastructure/database/implementation/user.repository.impl";
import { SignupController } from "../controllers/signup.controller";
import { SigninUseCase } from "../../application/usecases/authentication/signin.usecase";
import { SigninController } from "../controllers/signin.controller";
import { TokenServicesImpl } from "../../infrastructure/jwt/jwt.services";
import { IUserRepository } from "../../domain/dbrepository/user.repository";
import { ITokenService } from "../../application/interfaces/token.service.interface";
import { verifyAccessToken } from "../middlewares/auth.access.token.middleware";
import { verifyRefreshToken } from "../middlewares/auth.refresh.token.middleware";
import { RefreshTokenUseCase } from "../../application/usecases/authentication/refresh.token.usecase";
import { RefreshTokenController } from "../controllers/refresh.token.controller";
import { ForgotPasswrodController } from "../controllers/forgot.password.controller";
import { ForgotPasswordUseCase } from "../../application/usecases/forgot-password/forgot.password.usecase";
import { IEmailService } from "../../application/interfaces/email.service.interface";
import { EmailServiceImpl } from "../../infrastructure/services/email.service";
import { VerifyResetTokenController } from "../controllers/verify.reset.token.controller";
import { VerifyResetTokenUseCase } from "../../application/usecases/forgot-password/verify.rest.password.usecase";
import { ResetPasswordController } from "../controllers/reset.password.controller";
import { ResetPasswordUseCase } from "../../application/usecases/forgot-password/reset.password.usecase";
import { ForgotPasswordResetTokenImpl } from "../../infrastructure/database/implementation/forgot.password.token.impl";
import { IForgotPasswordTokensRepository } from "../../domain/dbrepository/forgot.password.token.respository";
import { LogoutController } from "../controllers/logout.controller";

export const authRouter = Router();

// initialize database repository implementation
const userRepository: IUserRepository = new UserRepositoryImpl();
const forgotResetRespository: IForgotPasswordTokensRepository = new ForgotPasswordResetTokenImpl();

// intialize interface
const tokenInterface: ITokenService = new TokenServicesImpl();
const emailService: IEmailService = new EmailServiceImpl();

// intialize useCases
const signupUseCase = new SignupUseCase(userRepository, tokenInterface);
const signinUseCase = new SigninUseCase(userRepository, tokenInterface);
const refreshUseCase = new RefreshTokenUseCase(tokenInterface);
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, emailService, forgotResetRespository);
const verifyRefreshTokenUseCase = new VerifyResetTokenUseCase(forgotResetRespository);
const resetPasswordUseCase = new ResetPasswordUseCase(forgotResetRespository, userRepository);

// initialize controller implementation
const signupController = new SignupController(signupUseCase); 
const signinController = new SigninController(signinUseCase);
const refreshController = new RefreshTokenController(refreshUseCase);
const forgotPasswordController = new ForgotPasswrodController(forgotPasswordUseCase);
const verifyResetTokenController = new VerifyResetTokenController(verifyRefreshTokenUseCase);
const resetPasswordController = new ResetPasswordController(resetPasswordUseCase);
const logoutController = new LogoutController()

authRouter.post("/register", (req, res) => signupController.handle(req, res));
authRouter.post("/login", (req, res) => signinController.handle(req, res));
authRouter.post("/refresh-token", verifyRefreshToken, (req, res) => refreshController.handle(req, res));
authRouter.post("/forgot-password", (req, res) => forgotPasswordController.handle(req, res));
authRouter.get("/verify-reset-token/:token", (req, res) => verifyResetTokenController.handle(req, res));
authRouter.post("/reset-password", (req, res) => resetPasswordController.handle(req, res));
authRouter.post("/logout", verifyAccessToken, (req, res) => logoutController.handle(req, res));

authRouter.get("/test", verifyAccessToken, (req, res) => {
	res.json({ success: true, message: "Hello, authenticated user!" });
});

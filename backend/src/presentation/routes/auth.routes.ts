import { Router } from "express";
import { SignupUseCase } from "../../application/usecases/signup.usecase";
import { UserRepositoryImpl } from "../../infrastructure/database/implementation/user.repository.impl";
import { SignupController } from "../controllers/signup.controller";
import { SigninUseCase } from "../../application/usecases/signin.usecase";
import { SigninController } from "../controllers/signin.controller";
import { TokenServices } from "../../infrastructure/jwt/jwt.services";
import { IUserRepository } from "../../domain/repository/user.repository";
import { ITokenService } from "../../application/providers/token.service.interface";
import { verifyAccessToken } from "../middlewares/auth.access.token.middleware";
import { verifyRefreshToken } from "../middlewares/auth.refresh.token.middleware";
import { RefreshTokenUseCase } from "../../application/usecases/refresh.token.usecase";
import { RefreshTokenController } from "../controllers/refresh.token.controller";

export const authRouter = Router();

// initialize database repository implementation
const userRepository: IUserRepository = new UserRepositoryImpl();

// intialize interface
const tokenInterface: ITokenService = new TokenServices();

// intialize useCases
const signupUseCase = new SignupUseCase(userRepository, tokenInterface);
const signinUseCase = new SigninUseCase(userRepository, tokenInterface);
const refreshUseCase = new RefreshTokenUseCase(tokenInterface)

// initialize controller implementation
const signupController = new SignupController(signupUseCase);
const signinController = new SigninController(signinUseCase);
const refreshController = new RefreshTokenController(refreshUseCase)

authRouter.post("/register", (req, res) => signupController.handle(req, res));
authRouter.post("/login", (req, res) => signinController.handle(req, res));
authRouter.post('/refresh-token', verifyRefreshToken, (req, res) => refreshController.handle(req, res))
authRouter.get("/test", verifyAccessToken, (req, res) => {
	res.json({ message: "Hello, authenticated user!" });
});
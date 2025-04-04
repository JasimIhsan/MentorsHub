"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const signup_usecase_1 = require("../../application/usecases/signup.usecase");
const user_repository_impl_1 = require("../../infrastructure/database/implementation/user.repository.impl");
const signup_controller_1 = require("../controllers/signup.controller");
const signin_usecase_1 = require("../../application/usecases/signin.usecase");
const signin_controller_1 = require("../controllers/signin.controller");
const jwt_services_1 = require("../../infrastructure/jwt/jwt.services");
const auth_middleware_1 = require("../middlewares/auth.middleware");
exports.authRouter = (0, express_1.Router)();
// initialize database repository implementation
const userRepository = new user_repository_impl_1.UserRepositoryImpl();
// intialize interface
const tokenInterface = new jwt_services_1.TokenServices();
// intialize useCases
const signupUseCase = new signup_usecase_1.SignupUseCase(userRepository, tokenInterface);
const signinUseCase = new signin_usecase_1.SigninUseCase(userRepository, tokenInterface);
// initialize controller implementation
const signupController = new signup_controller_1.SignupController(signupUseCase);
const signinController = new signin_controller_1.SigninController(signinUseCase);
exports.authRouter.post("/register", (req, res) => signupController.handle(req, res));
exports.authRouter.post("/login", (req, res) => signinController.handle(req, res));
exports.authRouter.get("/dashboard", auth_middleware_1.verifyAccessToken, (req, res) => {
    res.json({ message: "Hello, authenticated user!" });
});

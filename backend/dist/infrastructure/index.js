"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisService = exports.emailService = exports.tokenInterface = exports.adminRepository = exports.forgotResetRepository = exports.userRepository = void 0;
const user_repository_impl_1 = require("./database/implementation/user/user.repository.impl");
const forgot_password_token_impl_1 = require("./database/implementation/user/forgot.password.token.impl");
const jwt_services_1 = require("./jwt/jwt.services");
const email_service_1 = require("./services/email-services/email.service");
const redis_cache_repository_1 = require("./cache/redis.cache.repository");
const admin_repository_impl_1 = require("./database/implementation/admin/admin.repository.impl");
// Initialize Database Implementations
exports.userRepository = new user_repository_impl_1.UserRepositoryImpl();
exports.forgotResetRepository = new forgot_password_token_impl_1.ForgotPasswordResetTokenImpl();
exports.adminRepository = new admin_repository_impl_1.AdminRepositoryImpl();
// Initialize Interfaces
exports.tokenInterface = new jwt_services_1.TokenServicesImpl();
exports.emailService = new email_service_1.EmailServiceImpl();
exports.redisService = new redis_cache_repository_1.RedisCacheRepository();

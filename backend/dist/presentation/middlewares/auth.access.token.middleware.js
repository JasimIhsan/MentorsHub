"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
const jwt_services_1 = require("../../infrastructure/jwt/jwt.services");
const user_repository_impl_1 = require("../../infrastructure/database/implementation/user/user.repository.impl");
const tokenService = new jwt_services_1.TokenServicesImpl();
const userRepo = new user_repository_impl_1.UserRepositoryImpl();
const verifyAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.cookies.access_token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
        if (!token) {
            res.status(401).json({ success: false, message: "Token not provided" });
            return;
        }
        const decoded = tokenService.validateAccessToken(token);
        if (!decoded) {
            res.status(401).json({ success: false, message: "Invalid token" });
            return;
        }
        const user = yield userRepo.findUserById(decoded.userId);
        if (!user) {
            res.status(401).json({ success: false, message: "User not found" });
            return;
        }
        req.user = user;
        return next();
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.verifyAccessToken = verifyAccessToken;

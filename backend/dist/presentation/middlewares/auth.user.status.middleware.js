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
exports.checkUserStatusInLogin = exports.checkUserStatus = void 0;
const user_repository_impl_1 = require("../../infrastructure/database/implementation/user/user.repository.impl");
const userRepo = new user_repository_impl_1.UserRepositoryImpl();
const checkUserStatus = (req, res, next) => {
    const user = req.user;
    console.log("user: ", user);
    if (user.getStatus() === "blocked") {
        console.log(`is blocked`);
        res.status(403).json({ success: false, blocked: true, message: "User is blocked" });
        return;
    }
    next();
};
exports.checkUserStatus = checkUserStatus;
const checkUserStatusInLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield userRepo.findUserByEmail(email);
    console.log("user: ", user);
    if (!user) {
        return next();
    }
    if (user.getStatus() === "blocked") {
        console.log(`is blocked`);
        res.status(403).json({ success: false, blocked: true, message: "User is blocked" });
        return;
    }
    next();
});
exports.checkUserStatusInLogin = checkUserStatusInLogin;

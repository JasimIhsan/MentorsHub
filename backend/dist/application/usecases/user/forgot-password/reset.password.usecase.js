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
exports.ResetPasswordUseCase = void 0;
const user_entity_1 = require("../../../../domain/entities/user.entity");
class ResetPasswordUseCase {
    constructor(restRepo, userRepo) {
        this.restRepo = restRepo;
        this.userRepo = userRepo;
    }
    execute(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.restRepo.findUserByResetToken(token);
            const tokenDetails = yield this.restRepo.findAllTokenDetails(token);
            if (!user || !(tokenDetails === null || tokenDetails === void 0 ? void 0 : tokenDetails.token) || !tokenDetails.expiresAt || tokenDetails.expiresAt.getTime() < Date.now()) {
                throw new Error("Invalid or expired reset token");
            }
            const isSamePassword = yield user.isPasswordValid(newPassword);
            console.log('isSamePassword: ', isSamePassword);
            if (isSamePassword) {
                throw new Error("Password cannot be the same as the old password");
            }
            const hashedPassword = yield user_entity_1.UserEntity.hashPassword(newPassword);
            user.updateUserDetails({ password: hashedPassword });
            yield this.userRepo.save(user);
        });
    }
}
exports.ResetPasswordUseCase = ResetPasswordUseCase;

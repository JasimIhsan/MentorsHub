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
exports.ForgotPasswordResetTokenImpl = void 0;
const forgot_token_dto_1 = require("../../../../application/dtos/forgot.token.dto");
const forgot_password_token_entity_1 = require("../../../../domain/entities/forgot.password.token.entity");
const user_entity_1 = require("../../../../domain/entities/user.entity");
const forgot_password_reset_token_model_1 = require("../../models/user/forgot.password.reset.token.model");
const user_repository_impl_1 = require("../../implementation/user/user.repository.impl");
class ForgotPasswordResetTokenImpl {
    createToken(userId, token, expiresInMinutes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenEntity = forgot_password_token_entity_1.ForgotPasswordTokenEntity.create(userId, token, expiresInMinutes);
                const createdToken = new forgot_password_reset_token_model_1.ForgotTokenModel({
                    token: tokenEntity.getToken(),
                    expiresAt: tokenEntity.getExpires(),
                    userId: tokenEntity.getUserId(),
                });
                yield createdToken.save();
                return tokenEntity.toDBDocument();
            }
            catch (error) {
                return (0, user_repository_impl_1.handleError)(error, "Error creating forgot password token");
            }
        });
    }
    findAllTokenDetails(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenDoc = yield forgot_password_reset_token_model_1.ForgotTokenModel.findOne({ token }).populate("userId");
                if (!tokenDoc || !tokenDoc.userId)
                    return null;
                return forgot_token_dto_1.ForgotPasswordTokenDTO.fromEntity(tokenDoc);
            }
            catch (error) {
                return (0, user_repository_impl_1.handleError)(error, "Error finding forgot password token");
            }
        });
    }
    findToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenDoc = yield forgot_password_reset_token_model_1.ForgotTokenModel.findOne({ token }).populate("userId");
                if (!tokenDoc)
                    return null;
                return forgot_password_token_entity_1.ForgotPasswordTokenEntity.fromDBDocument({ token: tokenDoc.token, userId: tokenDoc.userId.toString(), expiresAt: tokenDoc.expires });
            }
            catch (error) {
                return (0, user_repository_impl_1.handleError)(error, "Error finding forgot password token");
            }
        });
    }
    findUserByResetToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenDoc = yield forgot_password_reset_token_model_1.ForgotTokenModel.findOne({ token }).populate("userId");
                // console.log("Token Document: ", tokenDoc);
                if (!tokenDoc || !tokenDoc.userId)
                    return null;
                return user_entity_1.UserEntity.fromDBDocument(tokenDoc.userId);
            }
            catch (error) {
                return (0, user_repository_impl_1.handleError)(error, "Error finding user by forgot password token");
            }
        });
    }
}
exports.ForgotPasswordResetTokenImpl = ForgotPasswordResetTokenImpl;

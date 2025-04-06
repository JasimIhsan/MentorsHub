"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordTokenDTO = void 0;
class ForgotPasswordTokenDTO {
    constructor(data) {
        this.token = data.token;
        this.expiresAt = data.expiresAt;
        this.user = data.user;
    }
    static fromEntity(tokenDoc) {
        return new ForgotPasswordTokenDTO({
            token: tokenDoc.token,
            expiresAt: tokenDoc.expiresAt,
            user: {
                _id: tokenDoc.userId._id.toString(),
                email: tokenDoc.userId.email,
                firstName: tokenDoc.userId.firstName,
                lastName: tokenDoc.userId.lastName,
                role: tokenDoc.userId.role,
                avatar: tokenDoc.userId.avatar,
                isVerified: tokenDoc.userId.isVerified,
            },
        });
    }
}
exports.ForgotPasswordTokenDTO = ForgotPasswordTokenDTO;

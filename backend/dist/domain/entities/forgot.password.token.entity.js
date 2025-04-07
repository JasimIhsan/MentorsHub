"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordTokenEntity = void 0;
class ForgotPasswordTokenEntity {
    constructor(data) {
        var _a, _b;
        this.userId = data.userId;
        this.token = data.token;
        this.expiresAt = new Date(data.expiresAt);
        this.createdAt = (_a = data.createdAt) !== null && _a !== void 0 ? _a : new Date();
        this.updatedAt = (_b = data.updatedAt) !== null && _b !== void 0 ? _b : null;
    }
    static create(userId, token, expiresInMinutes) {
        const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
        return new ForgotPasswordTokenEntity({ userId, token, expiresAt });
    }
    isExpired() {
        return Date.now() > this.expiresAt.getTime();
    }
    toDBDocument() {
        return {
            userId: this.userId,
            token: this.token,
            expiresAt: this.expiresAt,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
    static fromDBDocument(doc) {
        return new ForgotPasswordTokenEntity({
            userId: doc.userId.toString(),
            token: doc.token,
            expiresAt: new Date(doc.expiresAt),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
    getUserId() {
        return this.userId;
    }
    getToken() {
        return this.token;
    }
    getExpires() {
        return this.expiresAt;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
}
exports.ForgotPasswordTokenEntity = ForgotPasswordTokenEntity;

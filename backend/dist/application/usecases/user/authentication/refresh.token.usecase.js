"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenUseCase = void 0;
class RefreshTokenUseCase {
    constructor(tokenServices) {
        this.tokenServices = tokenServices;
    }
    execute(userId) {
        const newAccessToken = this.tokenServices.generateAccessToken(userId);
        return newAccessToken;
    }
}
exports.RefreshTokenUseCase = RefreshTokenUseCase;

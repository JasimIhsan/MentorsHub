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
exports.SigninUseCase = void 0;
class SigninUseCase {
    constructor(userRepo, tokenService) {
        this.userRepo = userRepo;
        this.tokenService = tokenService;
    }
    execute(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findUserByEmail(email);
            console.log(`user in login controller  : `, user);
            if (!user)
                throw new Error("User not found");
            const isPasswordValid = yield user.isPasswordValid(password);
            if (!isPasswordValid)
                throw new Error("Invalid user credentials");
            const userId = user.getId();
            const accessToken = this.tokenService.generateAccessToken(userId);
            const refreshToken = this.tokenService.generateRefreshToken(userId);
            return { user, accessToken, refreshToken };
        });
    }
}
exports.SigninUseCase = SigninUseCase;

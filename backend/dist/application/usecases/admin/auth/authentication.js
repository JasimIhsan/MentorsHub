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
exports.AdminLoginUsecase = void 0;
const compare_password_1 = require("../../../../infrastructure/services/utils/compare.password");
class AdminLoginUsecase {
    constructor(adminAuthRepo, tokenService) {
        this.adminAuthRepo = adminAuthRepo;
        this.tokenService = tokenService;
    }
    execute(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.adminAuthRepo.findAdminByUsername(username);
                if (!admin)
                    throw new Error("Admin not found");
                const isPasswordValid = yield (0, compare_password_1.comparePassword)(password, admin.password);
                if (!isPasswordValid)
                    throw new Error("Invalid admin credentials");
                const accessToken = this.tokenService.generateAccessToken(admin.id);
                const refreshToken = this.tokenService.generateRefreshToken(admin.id);
                return { admin, refreshToken, accessToken };
            }
            catch (error) {
                // console.error("Admin authentication error: ", error);
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                throw new Error("An error occurred during admin authentication");
            }
        });
    }
}
exports.AdminLoginUsecase = AdminLoginUsecase;

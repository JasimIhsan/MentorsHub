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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthUsecase = void 0;
const axios_1 = __importDefault(require("axios"));
const user_entity_1 = require("../../../../domain/entities/user.entity");
class GoogleAuthUsecase {
    constructor(userRepo, tokenService) {
        this.userRepo = userRepo;
        this.tokenService = tokenService;
    }
    getGoogleUserData(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                throw new Error("Google token is required");
            }
            const response = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
            console.log(`Google user data: `, response.data);
            return response.data;
        });
    }
    execute(googleToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.getGoogleUserData(googleToken);
                const userEntity = yield user_entity_1.UserEntity.createWithGoogle(data.email, "", data.given_name, data.family_name, data.sub, data.picture);
                console.log(userEntity);
                const user = yield this.userRepo.findUserByEmail(data.email);
                if (!user) {
                    const newUser = yield this.userRepo.createUser(userEntity);
                    if (!newUser) {
                        throw new Error("User creation failed");
                    }
                    const accessToken = this.tokenService.generateAccessToken(newUser.getId());
                    const refreshToken = this.tokenService.generateRefreshToken(newUser.getId());
                    return { user: newUser, accessToken, refreshToken };
                }
                else {
                    const accessToken = this.tokenService.generateAccessToken(user.getId());
                    const refreshToken = this.tokenService.generateRefreshToken(user.getId());
                    return { user, accessToken, refreshToken };
                }
            }
            catch (error) {
                console.error("Google authentication error: ", error.message);
                throw new Error(error.message || "An error occurred during Google authentication");
            }
        });
    }
}
exports.GoogleAuthUsecase = GoogleAuthUsecase;

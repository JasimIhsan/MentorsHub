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
exports.SignupUseCase = void 0;
const user_entity_1 = require("../../domain/entities/user.entity");
class SignupUseCase {
    constructor(userRepository, tokenSerivice) {
        this.userRepository = userRepository;
        this.tokenSerivice = tokenSerivice;
    }
    execute(email, password, firstName, lastName) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findUserByEmail(email);
            if (existingUser)
                throw new Error("User already exists");
            const newUser = yield user_entity_1.UserEntity.create(email, password, firstName, lastName);
            const accessToken = this.tokenSerivice.generateAccessToken(newUser);
            const refreshToken = this.tokenSerivice.generateRefreshToken(newUser);
            this.userRepository.createUser(newUser);
            return { user: newUser, refreshToken, accessToken };
        });
    }
}
exports.SignupUseCase = SignupUseCase;

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
exports.ForgotPasswordUseCase = void 0;
const crypto_1 = __importDefault(require("crypto"));
class ForgotPasswordUseCase {
    constructor(userRepo, emailService, tokenRepo) {
        this.userRepo = userRepo;
        this.emailService = emailService;
        this.tokenRepo = tokenRepo;
    }
    execute(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findUserByEmail(email);
            if (!user)
                throw new Error("User not found: ");
            const userId = user.getId();
            if (!userId)
                throw new Error("User not found");
            const token = crypto_1.default.randomBytes(32).toString("hex");
            yield this.tokenRepo.createToken(userId, token, 10);
            let username = user.getName();
            yield this.emailService.sendPasswordResetEmail(email, token, username);
        });
    }
}
exports.ForgotPasswordUseCase = ForgotPasswordUseCase;
